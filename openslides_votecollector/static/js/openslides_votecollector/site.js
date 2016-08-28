(function () {

'use strict';

angular.module('OpenSlidesApp.openslides_votecollector.site', [
    'OpenSlidesApp.openslides_votecollector'
])

.config([
    'mainMenuProvider',
    'gettext',
    function (mainMenuProvider, gettext) {
        mainMenuProvider.register({
            'ui_sref': 'openslides_votecollector.keypad.list',
            'img_class': 'wifi',
            'title': gettext('VoteCollector'),
            'weight': 700,
            'perm': 'openslides_votecollector.can_manage_votecollector',
        });
    }
])

.config([
    '$stateProvider',
    function ($stateProvider) {
        $stateProvider
        .state('openslides_votecollector', {
            url: '/votecollector',
            abstract: true,
            template: "<ui-view/>",
        })
        .state('openslides_votecollector.keypad', {
            abstract: true,
            template: "<ui-view/>",
        })
        .state('openslides_votecollector.keypad.list', {
            resolve: {
                keypads: function (Keypad) {
                    return Keypad.findAll();
                },
                users: function (User) {
                    return User.findAll();
                },
                seats: function (Seat) {
                    return Seat.findAll();
                },
                vc: function(VoteCollector) {
                    return VoteCollector.find(1);
                }
            }
        })
        .state('openslides_votecollector.motionpoll', {
            abstract: true,
            template: "<ui-view/>",
        })
        .state('openslides_votecollector.motionpoll.detail', {
            url: '/motionpoll/:id',
            controller: 'MotionPollDetailCtrl',
            resolve: {
                motions: function (Motion) {
                    return Motion.findAll();
                },
                motionpollkeypadconnections: function (MotionPollKeypadConnection) {
                    return MotionPollKeypadConnection.findAll();
                },
                keypads: function (Keypad) {
                    return Keypad.findAll();
                },
                users: function (User) {
                    return User.findAll();
                },
            }
        })
    }
])

// Service for generic keypad form (create and update)
.factory('KeypadForm', [
    'gettextCatalog',
    'User',
    'Seat',
    function (gettextCatalog, User, Seat) {
        return {
            // ngDialog for keypad form
            getDialog: function (keypad) {
                var resolve = {};
                if (keypad) {
                    resolve = {
                        keypad: function () {
                            return keypad;
                        }
                    }
                }
                return {
                    template: 'static/templates/openslides_votecollector/keypad-form.html',
                    controller: (keypad) ? 'KeypadUpdateCtrl' : 'KeypadCreateCtrl',
                    className: 'ngdialog-theme-default',
                    closeByEscape: false,
                    closeByDocument: false,
                    resolve: (resolve) ? resolve : null
                }
            },
            // angular-formly fields for keypad form
            getFormFields: function () {
                return [
                {
                    key: 'user_id',
                    type: 'select-single',
                    templateOptions: {
                        label: gettextCatalog.getString('Participant'),
                        options: User.getAll(),
                        ngOptions: 'option.id as option.full_name for option in to.options',
                        placeholder: gettextCatalog.getString('(Anonymous)')
                    }
                },
                {
                    key: 'keypad_id',
                    type: 'input',
                    templateOptions: {
                        label: gettextCatalog.getString('Keypad ID'),
                        type: 'number',
                        required: true
                    }
                },
                {
                    key: 'seat_id',
                    type: 'select-single',
                    templateOptions: {
                        label: gettextCatalog.getString('Seat'),
                        options: Seat.getAll(),
                        ngOptions: 'option.id as option.number for option in to.options',
                        placeholder: gettextCatalog.getString('–')
                    }
                }
                ]
            }
        }
    }
])

.controller('KeypadListCtrl', [
    '$scope',
    '$http',
    '$timeout',
    'ngDialog',
    'SeatingPlan',
    'KeypadForm',
    'Keypad',
    'User',
    'Seat',
    'VoteCollector',
    function ($scope, $http, $timeout, ngDialog, SeatingPlan, KeypadForm, Keypad, User, Seat, VoteCollector) {
        Keypad.bindAll({}, $scope, 'keypads');
        User.bindAll({}, $scope, 'users');
        Seat.bindAll({}, $scope, 'seats');
        VoteCollector.bindOne(1, $scope, 'vc');
        $scope.alert = {};

        // setup table sorting
        $scope.sortColumn = 'keypad_id';
        $scope.reverse = false;
        // function to sort by clicked column
        $scope.toggleSort = function ( column ) {
            if ( $scope.sortColumn === column ) {
                $scope.reverse = !$scope.reverse;
            }
            $scope.sortColumn = column;
        };
        // define custom search filter string
        $scope.getFilterString = function (keypad) {
            var seat = '', user = '';
            if (keypad.seat) {
                seat = keypad.seat.number;
            }
            if (keypad.user) {
                user = keypad.user.get_full_name();
            }
            return [
                keypad.keypad_id,
                seat,
                user
            ].join(" ");
        };

        // open new/edit dialog
        $scope.openDialog = function (keypad) {
            ngDialog.open(KeypadForm.getDialog(keypad));
        };
        // open new range dialog
        $scope.openRangeDialog = function () {
            // TODO: Implement open range form
        }


        // *** delete mode functions ***
        $scope.isDeleteMode = false;
        // check all checkboxes
        $scope.checkAll = function () {
            angular.forEach($scope.keypads, function (keypad) {
                keypad.selected = $scope.selectedAll;
            });
        };
        // uncheck all checkboxes if isDeleteMode is closed
        $scope.uncheckAll = function () {
            if (!$scope.isDeleteMode) {
                $scope.selectedAll = false;
                angular.forEach($scope.keypads, function (keypad) {
                    keypad.selected = false;
                });
            }
        };
        // delete selected keypads
        $scope.deleteMultiple = function () {
            angular.forEach($scope.keypads, function (keypad) {
                if (keypad.selected)
                    Keypad.destroy(keypad.id);
            });
            $scope.isDeleteMode = false;
            $scope.uncheckAll();
        };
        // delete single keypad
        $scope.delete = function (keypad) {
            Keypad.destroy(keypad.id);
        };

        // keypad test
        $scope.checkKeypads = function () {
            $scope.device = null;
            $http.get('/votecollector/device/').then(
                function (success) {
                    if (success.data.error) {
                        $scope.device = success.data.error;
                    }
                    else {
                        $scope.device = success.data.device;
                        if (success.data.connected) {
                            $http.get('/votecollector/start_ping/').then(
                                function (success) {
                                    if (success.data.error) {
                                        $scope.device = success.data.error;
                                    }
                                    else {
                                        // Stop pinging after 5 seconds.
                                        $timeout(function () {
                                            $http.get('/votecollector/stop/');
                                        }, 5000);
                                    }
                                }
                            );
                        }
                     }
                },
                function (failure) {
                    $scope.device = $scope.vc.getErrorMessage(failure.status, failure.statusText);
                }
            );
        };

        // Generate seating plan with empty seats
        $scope.seatingPlan = SeatingPlan.generate(Seat.getAll());

        $scope.changeSeat = function (seat, result) {
            seat.number = result;
            // Inject the changed seat object back into DS store.
            Seat.inject(seat);
            // Save change seat object on server.
            Seat.save(seat).then(
                function (success) {},
                function (error) {}
            );
        }

    }
])

.controller('KeypadCreateCtrl', [
    '$scope',
    'Keypad',
    'KeypadForm',
    function ($scope, Keypad, KeypadForm) {
        $scope.model = {};
        // get all form fields
        $scope.formFields = KeypadForm.getFormFields();

        // save keypad
        $scope.save = function (keypad) {
            Keypad.create(keypad).then(
                function (success) {
                    $scope.closeThisDialog();
                },
                function (error) {
                    var message = '';
                    for (var e in error.data) {
                        message += e + ': ' + error.data[e] + ' ';
                    }
                    $scope.alert = {type: 'danger', msg: message, show: true};
                }
            );
        };
    }
])

.controller('KeypadUpdateCtrl', [
    '$scope',
    'Keypad',
    'KeypadForm',
    'keypad',
    function ($scope, Keypad, KeypadForm, keypad) {
        $scope.alert = {};
        // set initial values for form model by create deep copy of keypad object
        // so list/detail view is not updated while editing
        $scope.model = angular.copy(keypad);

        // get all form fields
        $scope.formFields = KeypadForm.getFormFields();

        // save keypad
        $scope.save = function (keypad) {
            // inject the changed keypad (copy) object back into DS store
            Keypad.inject(keypad);
            // save change keypad object on server
            Keypad.save(keypad).then(
                function (success) {
                    $scope.closeThisDialog();
                },
                function (error) {
                    // save error: revert all changes by restore
                    // (refresh) original keypad object from server
                    Keypad.refresh(keypad);
                    var message = '';
                    for (var e in error.data) {
                        message += e + ': ' + error.data[e] + ' ';
                    }
                    $scope.alert = {type: 'danger', msg: message, show: true};
                }
            );
        };
    }
])

// Button at template hook motionPollSmallButtons
.run([
    'templateHooks',
    function (templateHooks) {
        templateHooks.registerHook({
            Id: 'motionPollSmallButtons',
            template: '<div class="spacer" ng-if="poll.has_votes">' +
                      '<a ui-sref="openslides_votecollector.motionpoll.detail({id: poll.id})">' +
                      '<button class="btn btn-xs btn-default">' +
                      '<i class="fa fa-table" aria-hidden="true"></i> <translate>Single votes</translate>' +
                      '</button></a></div>'
        })
    }
])

.controller('MotionPollDetailCtrl', [
    '$scope',
    '$stateParams',
    '$http',
    'Keypad',
    'Projector',
    'User',
    'MotionPollFinder',
    'motions',
    'motionpollkeypadconnections',
    function ($scope, $stateParams, $http, Keypad, Projector, User, MotionPollFinder, motions, motionpollkeypadconnections) {
        // Find motion and poll from URL parameter (via $stateparams).
        _.assign($scope, MotionPollFinder.find(motions, $stateParams.id));

        // Create table for single votes
        $scope.votesList = [];
        angular.forEach(motionpollkeypadconnections, function(motionpollkeypadconnection) {
            if (motionpollkeypadconnection.poll_id == $scope.poll.id) {
                var keypad = null;
                if (motionpollkeypadconnection.keypad_id) {
                    keypad = Keypad.get(motionpollkeypadconnection.keypad_id);
                    var user = null;
                    if (keypad.user_id) {
                        user = User.get(keypad.user_id);
                    }
                }
                $scope.votesList.push({
                    motionpollkeypadconnection: motionpollkeypadconnection,
                    keypad: keypad,
                    user: user,
                });
            }
        });

        $scope.isProjected = function (poll) {
            // Returns true if there is a projector element with the same
            // name and the same id of poll.
            var projector = Projector.get(1);
            var isProjected;
            if (typeof projector !== 'undefined') {
                var self = this;
                var predicate = function (element) {
                    return element.name == "votecollector/motionpoll" &&
                        typeof element.id !== 'undefined' &&
                        element.id == poll.id;
                };
                isProjected = typeof _.findKey(projector.elements, predicate) === 'string';
            } else {
                isProjected = false;
            }
            return isProjected;
        }

        $scope.projectSlide = function () {
            return $http.post(
                '/rest/core/projector/1/prune_elements/',
                [{name: 'votecollector/motionpoll', id: $scope.poll.id}]
            );
        };

        $scope.anonymizeVotes = function () {
            return $http.post(
                '/rest/openslides_votecollector/motionpollkeypadconnection/anonymize_votes/',
                {poll_id: $scope.poll.id}
            ).then(function (success) {}, function (error) {});
        };
    }
])

.controller('VotingCtrl', [
    '$scope',
    '$http',
    'gettextCatalog',
    'Projector',
    'VoteCollector',
    function ($scope, $http,  gettextCatalog, Projector, VoteCollector) {
        VoteCollector.find(1);
        VoteCollector.bindOne(1, $scope, 'vc');

        // TODO: Show voting duration.

        $scope.startVoting = function (poll) {
            $scope.$parent.$parent.$parent.alert = {};
            // TODO: Render form inputs readonly.
            // Clear votes, clearing form inputs.
            poll.yes = poll.no = poll.abstain = null;
            poll.votesvalid = poll.votesinvalid = poll.votescast = null;
            $http.get('/votecollector/start_yna/' + poll.id + '/').then(
                function (success) {
                    if (success.data.error) {
                        $scope.$parent.$parent.$parent.alert = { type: 'danger', msg: success.data.error, show: true };
                    }
                },
                function (failure) {
                    $scope.$parent.$parent.$parent.alert = {
                        type: 'danger',
                        msg: $scope.vc.getErrorMessage(failure.status, failure.statusText),
                        show: true };
                }
            );
        };

        $scope.stopVoting = function (poll) {
            $scope.$parent.$parent.$parent.alert = {};
            $http.get('/votecollector/stop/').then(
                function (success) {
                    if (success.data.error) {
                        $scope.$parent.$parent.$parent.alert = { type: 'danger',
                            msg: success.data.error, show: true };
                    }
                    else {
                        $http.get('/votecollector/result_yna/' + poll.id + '/').then(
                            function (success) {
                                if (success.data.error) {
                                    $scope.$parent.$parent.$parent.alert = { type: 'danger',
                                        msg: success.data.error, show: true };
                                }
                                else {
                                    // Store result in DS model; updates form inputs.
                                    poll.yes = success.data.votes[0];
                                    poll.no = success.data.votes[1];
                                    poll.abstain = success.data.votes[2];
                                    poll.votesvalid = $scope.vc.votes_received;
                                    poll.votesinvalid = 0;
                                    poll.votescast = $scope.vc.votes_received;

                                    // Prompt user to save result.
                                    $scope.$parent.$parent.$parent.alert = {
                                        type: 'info',
                                        msg: gettextCatalog.getString('Voting has finished.') + ' ' +
                                             gettextCatalog.getString('Received votes:') + ' ' +
                                             $scope.vc.votes_received + ' / ' + $scope.vc.voters_count + '. ' +
                                             gettextCatalog.getString('Save this result now!'),
                                        show: true
                                    };
                                }
                            }
                        );
                    }
                },
                function (failure) {
                    $scope.$parent.$parent.$parent.alert = {
                        type: 'danger',
                        msg: $scope.vc.getErrorMessage(failure.status, failure.statusText),
                        show: true };
                }
            );
        };

        $scope.projectSlide = function (poll) {
            console.log("project");
            console.log(poll);
            return $http.post(
                '/rest/core/projector/1/prune_elements/',
                [{name: 'votecollector/motionpoll', id: poll.id}]
            );
        };

        $scope.isProjected = function (poll) {
            // Returns true if there is a projector element with the same
            // name and the same id of poll.
            var projector = Projector.get(1);
            var isProjected;
            if (typeof projector !== 'undefined') {
                var self = this;
                var predicate = function (element) {
                    return element.name == "votecollector/motionpoll" &&
                        typeof element.id !== 'undefined' &&
                        element.id == poll.id;
                };
                isProjected = typeof _.findKey(projector.elements, predicate) === 'string';
            } else {
                isProjected = false;
            }
            return isProjected;
        }
    }
])

.controller('ElectionCtrl', [
    '$scope',
    '$http',
    'gettextCatalog',
    'VoteCollector',
    function ($scope, $http, gettextCatalog, VoteCollector) {
        VoteCollector.find(1);
        VoteCollector.bindOne(1, $scope, 'vc');

        // TODO: Show voting duration.

        // FIXME: Prevent deleting a poll while voting is active

        $scope.startElection = function (poll) {
            $scope.$parent.$parent.$parent.alert = {};

            // TODO: Render form inputs readonly.

            // Clear votes, clearing form inputs.
            if (poll.yesnoabstain) {
                poll.yes = null;
                poll.no = null;
                poll.abstain = null;
            }
            else {
                for (var i = 0; i < poll.options.length; i++) {
                    poll['vote_' + poll.options[i].candidate_id] = null;
                }
            }
            poll.votesvalid = null;
            poll.votesinvalid = null;
            poll.votescast = null;

            // Start votecollector.
            var url = '/votecollector/start_election/' + poll.id + '/' + poll.options.length + '/';
            if (poll.yesnoabstain) {
                url = '/votecollector/start_election_one/' + poll.id + '/';
            }
            $http.get(url).then(
                function (success) {
                    if (success.data.error) {
                        $scope.$parent.$parent.$parent.alert = { type: 'danger', msg: success.data.error, show: true };
                    }
                },
                function (failure) {
                    $scope.$parent.$parent.$parent.alert = {
                        type: 'danger',
                        msg: $scope.vc.getErrorMessage(failure.status, failure.statusText),
                        show: true };
                }
            );
        };

        $scope.stopElection = function (poll) {
            $scope.$parent.$parent.$parent.alert = {};

            // Stop votecollector.
            $http.get('/votecollector/stop/').then(
                function (success) {
                    if (success.data.error) {
                        $scope.$parent.$parent.$parent.alert = { type: 'danger',
                            msg: success.data.error, show: true };
                    }
                    else {
                        // Get votecollector result.
                        $http.get('/votecollector/result_election/' + poll.id + '/').then(
                            function (success) {
                                if (success.data.error) {
                                    $scope.$parent.$parent.$parent.alert = { type: 'danger',
                                        msg: success.data.error, show: true };
                                }
                                else {
                                    // Store result in DS model, updates form inputs.
                                    if (poll.yesnoabstain) {
                                        var id = poll.options[0].candidate_id;
                                        poll['yes_' + id] = success.data.votes[0];
                                        poll['no_' + id] = success.data.votes[1];
                                        poll['abstain_' + id] = success.data.votes[2];
                                    }
                                    else {
                                        for (var i = 0; i < poll.options.length; i++) {
                                            poll['vote_' + poll.options[i].candidate_id] = success.data.votes[i]
                                        }
                                    }
                                    poll.votesvalid = $scope.vc.votes_received;
                                    poll.votesinvalid = 0;
                                    poll.votescast = $scope.vc.votes_received;

                                    // Prompt user to save result.
                                    $scope.$parent.$parent.$parent.alert = {
                                        type: 'info',
                                        msg: gettextCatalog.getString('Voting has finished.') + ' ' +
                                             gettextCatalog.getString('Received votes:') + ' ' +
                                             $scope.vc.votes_received + ' / ' + $scope.vc.voters_count + '. ' +
                                             gettextCatalog.getString('Save this result now!'),
                                        show: true
                                    };
                                }
                            }
                        );
                    }
                },
                function (failure) {
                    $scope.$parent.$parent.$parent.alert = {
                        type: 'danger',
                        msg: $scope.vc.getErrorMessage(failure.status, failure.statusText),
                        show: true };
                }
            );
        };
    }
])

.controller('SpeakerListCtrl', [
    '$scope',
    '$http',
    'VoteCollector',
    function ($scope, $http, VoteCollector) {
        VoteCollector.find(1);
        VoteCollector.bindOne(1, $scope, 'vc');

        $scope.startSpeakerList = function (item) {
            $scope.alert = {};
            $http.get('/votecollector/start_speaker_list/' + item.id + '/').then(
                function (success) {
                    if (success.data.error) {
                        $scope.alert = { type: 'danger', msg: success.data.error, show: true };
                    }
                },
                function (failure) {
                    $scope.alert = {
                        type: 'danger',
                        msg: $scope.vc.getErrorMessage(failure.status, failure.statusText),
                        show: true };
                }
            );
        };

        $scope.stopSpeakerList = function () {
            $scope.alert = {};
            $http.get('/votecollector/stop/').then(
                function (success) {
                    if (success.data.error) {
                        $scope.alert = { type: 'danger', msg: success.data.error, show: true };
                    }
                },
                function (failure) {
                    $scope.alert = {
                        type: 'danger',
                        msg: $scope.vc.getErrorMessage(failure.status, failure.statusText),
                        show: true };
                }
            );
        };
    }
])

// VotingCtrl at template hook motionPollFormButtons
.run([
    'templateHooks',
    function (templateHooks) {
        templateHooks.registerHook({
            Id: 'motionPollFormButtons',
            template:
                '<div ng-controller="VotingCtrl" class="spacer">' +
                    '<button type="button" ng-if="vc.canStartVoting($parent.$parent.model)" ' +
                        'ng-click="startVoting($parent.$parent.model)"' +
                        'class="btn btn-default">' +
                        '<i class="fa fa-wifi" aria-hidden="true"></i> '+
                        '<translate>Start voting</translate></button> ' +
                    '<button type="button" ng-if="vc.canStopVoting($parent.$parent.model)" ' +
                        'ng-click="stopVoting($parent.$parent.model)"' +
                        'class="btn btn-primary">' +
                        '<i class="fa fa-wifi" aria-hidden="true"></i> '+
                        '<translate>Stop voting<translate></button> ' +
                    '<button type="button" os-perms="core.can_manage_projector" class="btn btn-default"' +
                      ' ng-class="{ \'btn-primary\': isProjected($parent.$parent.model) }"' +
                      ' ng-click="projectSlide($parent.$parent.model)"' +
                      ' title="{{ \'Project vote\' | translate }}">' +
                      '<i class="fa fa-video-camera"></i> ' +
                      '<translate>Vote<translate></button>' +
                    '<p>{{ vc.getVotingStatus($parent.$parent.model) }}</p>' +
                '</div>'
        })
    }
])

// ElectionCtrl at template hook assignmentPollFormButtons
.run([
    'templateHooks',
    function (templateHooks) {
        templateHooks.registerHook({
            Id: 'assignmentPollFormButtons',
            template:
                '<div ng-controller="ElectionCtrl" class="spacer">' +
                    '<button type="button" ng-if="vc.canStartElection($parent.$parent.model)" ' +
                        'ng-click="startElection($parent.$parent.model)"' +
                        'class="btn btn-default">' +
                        '<i class="fa fa-wifi" aria-hidden="true"></i> '+
                        '<translate>Start voting</translate></button> ' +
                    '<button type="button" ng-if="vc.canStopElection($parent.$parent.model)" ' +
                        'ng-click="stopElection($parent.$parent.model)"' +
                        'class="btn btn-primary">' +
                        '<i class="fa fa-wifi" aria-hidden="true"></i> '+
                        '<translate>Stop voting<translate></button> ' +
                    '<p>{{ vc.getElectionStatus($parent.$parent.model) }}</p>' +
                '</div>'
        })
    }
])

// SpeakerListCtrl at template hook itemDetailListOfSpeakersButtons
.run([
    'templateHooks',
    function (templateHooks) {
        templateHooks.registerHook({
            Id: 'itemDetailListOfSpeakersButtons',
            template:
                '<div ng-controller="SpeakerListCtrl" class="spacer">' +
                    '<button ng-if="vc.canStartSpeakerList($parent.$parent.item)" ' +
                        'ng-click="startSpeakerList($parent.$parent.item)"' +
                        'class="btn btn-sm btn-default">' +
                        '<i class="fa fa-wifi" aria-hidden="true"></i> '+
                        '<translate>Start speakers voting</translate></button>' +
                    '<button ng-if="vc.canStopSpeakerList($parent.$parent.item)" ' +
                        'ng-click="stopSpeakerList()"' +
                        'class="btn btn-sm btn-primary">' +
                        '<i class="fa fa-wifi" aria-hidden="true"></i> '+
                        '<translate>Stop speakers voting</translate></button>' +
                    '<uib-alert ng-show="alert.show" type="{{ alert.type }}" ng-click="alert={}" close="alert={}">' +
                        '{{ alert.msg }}</uib-alert>' +
                '</div>'
        })
    }
])

// Mark strings for translation in javascript
.config([
    'gettext',
    function (gettext) {
        // TODO: add strings to be translated
    }
])
}());
