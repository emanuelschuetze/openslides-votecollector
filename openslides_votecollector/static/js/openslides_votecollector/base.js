(function () {

'use strict';

angular.module('OpenSlidesApp.openslides_votecollector', ['OpenSlidesApp.users'])

.factory('VoteCollector', [
    'DS',
    'gettext',
    function (DS, gettext) {
        return DS.defineResource({
            name: 'openslides_votecollector/votecollector',
            methods: {
                getErrorMessage: function (status, text) {
                    if (status == 503) {
                        return gettext('VoteCollector not running!');
                    }
                    return status + ': ' + text;
                }
            }
        });
    }
])

.factory('Keypad', [
    'DS',
    'jsDataModel',
    function (DS, jsDataModel) {
        var name = 'openslides_votecollector/keypad',
            powerLevel = ['', 'full', 'medium', 'low', 'empty'],
            powerCSSIcon = ['', 'full', 'half', 'quarter', 'empty'],
            powerCSSColor = ['', '', '', 'danger', 'danger'];

        return DS.defineResource({
            name: name,
            useClass: jsDataModel,
            computed: {
                // No websocket update on computed!
                active: function () {
                    return this.isActive();
                },
                identified: function () {
                    return this.isIdentified();
                }
            },
            methods: {
                getTitle: function () {
                    return "Keypad " + this.keypad_id;
                },
                isActive: function () {
                    return this.user === undefined || this.user.is_active;
                },
                isIdentified: function () {
                    return this.user !== undefined;
                },
                getSeatNumber: function () {
                    if (this.seat !== undefined) {
                        return this.seat.number;
                    }
                    else {
                        return '-';
                    }
                },
                power: function () {
                    return powerLevel[this.battery_level + 1];
                },
                powerCSSIcon: function () {
                    return powerCSSIcon[this.battery_level + 1]
                },
                powerCSSColor: function () {
                    return powerCSSColor[this.battery_level + 1]
                }
            },
            relations: {
                belongsTo: {
                    'users/user': {
                        localField: 'user',
                        localKey: 'user_id'
                    },
                    'openslides_votecollector/seat': {
                        localField: 'seat',
                        localKey: 'seat_id'
                    }
                }
            }
        });
    }
])

.factory('Seat', [
    'DS',
    function (DS) {
        return DS.defineResource({
            name: 'openslides_votecollector/seat'
        });
    }
])

.factory('MotionPollKeypadConnection', [
    'DS',
    function (DS) {
        return DS.defineResource({
            name: 'openslides_votecollector/motionpollkeypadconnection',
            relations: {
                belongsTo: {
                    'openslides_votecollector/keypad': {
                        localField: 'keypad',
                        localKey: 'keypad_id'
                    },
                }
            }
        });
    }
])

.factory('MotionPollFinder', [
    function () {
        return {
            find: function (motions, pollId) {
                // Find motion and poll from poll id.
                var i = -1;
                var result = {};
                while (++i < motions.length && !result.poll) {
                    result.poll = _.find(
                        motions[i].polls,
                        function (poll) {
                            return poll.id == pollId;
                        }
                    );
                    if (result.poll) {
                        result.motion = motions[i];
                    }
                }
                return result;
            }
        }
    }
])

.factory('AssignmentPollKeypadConnection', [
    'DS',
    function (DS) {
        return DS.defineResource({
            name: 'openslides_votecollector/assignmentpollkeypadconnection',
        });
    }
])

.factory('AssignmentPollFinder', [
    function () {
        return {
            find: function (assignments, pollId) {
                // Find assignment and poll from poll id.
                var i = -1;
                var result = {};
                while (++i < assignments.length && !result.poll) {
                    result.poll = _.find(
                        assignments[i].polls,
                        function (poll) {
                            return poll.id == pollId;
                        }
                    );
                    if (result.poll) {
                        result.assignment = assignments[i];
                    }
                }
                return result;
            }
        }
    }
])

.factory('SeatingPlan', [
    function () {
        return {
            generate: function (seats, votes) {
                // Generate seating plan with votes or empty seats
                var seatingPlan = {};
                var maxXAxis = _.reduce(seats, function (max, seat) {
                    return seat.seating_plan_x_axis > max ? seat.seating_plan_x_axis : max;
                }, 0);
                var maxYAxis = _.reduce(seats, function (max, seat) {
                    return seat.seating_plan_y_axis > max ? seat.seating_plan_y_axis : max;
                }, 0);
                seatingPlan.rows = _.map(_.range(maxYAxis), function () {
                    return _.map(_.range(maxXAxis), function () {
                        return {};
                    });
                });
                angular.forEach(seats, function (seat) {
                    var css = 'seat';
                    if (votes && votes[seat.id]) {
                        css += ' ' + votes[seat.id];
                    }
                    seatingPlan.rows[seat.seating_plan_y_axis-1][seat.seating_plan_x_axis-1] = {
                        'css': css,
                        'number': seat.number,
                        'id': seat.id
                    };
                });
                return seatingPlan;
            }
        };
    }
])

.run(['VoteCollector', 'Keypad', 'Seat', 'MotionPollKeypadConnection', 'AssignmentPollKeypadConnection',
    function (VoteCollector, Keypad, Seat, MotionPollKeypadConnection, AssignmentPollKeypadConnection) {}]);

}());
