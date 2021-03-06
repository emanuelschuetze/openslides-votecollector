from .models import Seat


def setup_default_plan():
    """
    Adds a default seating plan.
    """
    seats = []

    # Podium
    seats.append(Seat(number=1, seating_plan_x_axis=8, seating_plan_y_axis=1))
    seats.append(Seat(number=2, seating_plan_x_axis=9, seating_plan_y_axis=1))
    seats.append(Seat(number=3, seating_plan_x_axis=10, seating_plan_y_axis=1))
    seats.append(Seat(number=4, seating_plan_x_axis=11, seating_plan_y_axis=1))
    seats.append(Seat(number=5, seating_plan_x_axis=12, seating_plan_y_axis=1))
    seats.append(Seat(number=6, seating_plan_x_axis=13, seating_plan_y_axis=1))

    # 1st row
    seats.append(Seat(number=7, seating_plan_x_axis=1, seating_plan_y_axis=3))
    seats.append(Seat(number=8, seating_plan_x_axis=2, seating_plan_y_axis=3))
    seats.append(Seat(number=9, seating_plan_x_axis=3, seating_plan_y_axis=3))
    seats.append(Seat(number=10, seating_plan_x_axis=4, seating_plan_y_axis=3))
    seats.append(Seat(number=11, seating_plan_x_axis=5, seating_plan_y_axis=3))
    seats.append(Seat(number=12, seating_plan_x_axis=6, seating_plan_y_axis=3))
    seats.append(Seat(number=13, seating_plan_x_axis=8, seating_plan_y_axis=3))
    seats.append(Seat(number=14, seating_plan_x_axis=9, seating_plan_y_axis=3))
    seats.append(Seat(number=15, seating_plan_x_axis=10, seating_plan_y_axis=3))
    seats.append(Seat(number=16, seating_plan_x_axis=11, seating_plan_y_axis=3))
    seats.append(Seat(number=17, seating_plan_x_axis=12, seating_plan_y_axis=3))
    seats.append(Seat(number=18, seating_plan_x_axis=13, seating_plan_y_axis=3))
    seats.append(Seat(number=19, seating_plan_x_axis=15, seating_plan_y_axis=3))
    seats.append(Seat(number=20, seating_plan_x_axis=16, seating_plan_y_axis=3))
    seats.append(Seat(number=21, seating_plan_x_axis=17, seating_plan_y_axis=3))
    seats.append(Seat(number=22, seating_plan_x_axis=18, seating_plan_y_axis=3))
    seats.append(Seat(number=23, seating_plan_x_axis=19, seating_plan_y_axis=3))
    seats.append(Seat(number=24, seating_plan_x_axis=20, seating_plan_y_axis=3))

    # 2nd row
    seats.append(Seat(number=25, seating_plan_x_axis=1, seating_plan_y_axis=4))
    seats.append(Seat(number=26, seating_plan_x_axis=2, seating_plan_y_axis=4))
    seats.append(Seat(number=27, seating_plan_x_axis=3, seating_plan_y_axis=4))
    seats.append(Seat(number=28, seating_plan_x_axis=4, seating_plan_y_axis=4))
    seats.append(Seat(number=29, seating_plan_x_axis=5, seating_plan_y_axis=4))
    seats.append(Seat(number=30, seating_plan_x_axis=6, seating_plan_y_axis=4))
    seats.append(Seat(number=31, seating_plan_x_axis=8, seating_plan_y_axis=4))
    seats.append(Seat(number=32, seating_plan_x_axis=9, seating_plan_y_axis=4))
    seats.append(Seat(number=33, seating_plan_x_axis=10, seating_plan_y_axis=4))
    seats.append(Seat(number=34, seating_plan_x_axis=11, seating_plan_y_axis=4))
    seats.append(Seat(number=35, seating_plan_x_axis=12, seating_plan_y_axis=4))
    seats.append(Seat(number=36, seating_plan_x_axis=13, seating_plan_y_axis=4))
    seats.append(Seat(number=37, seating_plan_x_axis=15, seating_plan_y_axis=4))
    seats.append(Seat(number=38, seating_plan_x_axis=16, seating_plan_y_axis=4))
    seats.append(Seat(number=39, seating_plan_x_axis=17, seating_plan_y_axis=4))
    seats.append(Seat(number=40, seating_plan_x_axis=18, seating_plan_y_axis=4))
    seats.append(Seat(number=41, seating_plan_x_axis=19, seating_plan_y_axis=4))
    seats.append(Seat(number=42, seating_plan_x_axis=20, seating_plan_y_axis=4))

    # 3rd row
    seats.append(Seat(number=43, seating_plan_x_axis=1, seating_plan_y_axis=5))
    seats.append(Seat(number=44, seating_plan_x_axis=2, seating_plan_y_axis=5))
    seats.append(Seat(number=45, seating_plan_x_axis=3, seating_plan_y_axis=5))
    seats.append(Seat(number=46, seating_plan_x_axis=4, seating_plan_y_axis=5))
    seats.append(Seat(number=47, seating_plan_x_axis=5, seating_plan_y_axis=5))
    seats.append(Seat(number=48, seating_plan_x_axis=6, seating_plan_y_axis=5))
    seats.append(Seat(number=49, seating_plan_x_axis=8, seating_plan_y_axis=5))
    seats.append(Seat(number=50, seating_plan_x_axis=9, seating_plan_y_axis=5))
    seats.append(Seat(number=51, seating_plan_x_axis=10, seating_plan_y_axis=5))
    seats.append(Seat(number=52, seating_plan_x_axis=11, seating_plan_y_axis=5))
    seats.append(Seat(number=53, seating_plan_x_axis=12, seating_plan_y_axis=5))
    seats.append(Seat(number=54, seating_plan_x_axis=13, seating_plan_y_axis=5))
    seats.append(Seat(number=55, seating_plan_x_axis=15, seating_plan_y_axis=5))
    seats.append(Seat(number=56, seating_plan_x_axis=16, seating_plan_y_axis=5))
    seats.append(Seat(number=57, seating_plan_x_axis=17, seating_plan_y_axis=5))
    seats.append(Seat(number=58, seating_plan_x_axis=18, seating_plan_y_axis=5))
    seats.append(Seat(number=59, seating_plan_x_axis=19, seating_plan_y_axis=5))
    seats.append(Seat(number=60, seating_plan_x_axis=20, seating_plan_y_axis=5))

    # 4th row
    seats.append(Seat(number=61, seating_plan_x_axis=1, seating_plan_y_axis=6))
    seats.append(Seat(number=62, seating_plan_x_axis=2, seating_plan_y_axis=6))
    seats.append(Seat(number=63, seating_plan_x_axis=3, seating_plan_y_axis=6))
    seats.append(Seat(number=64, seating_plan_x_axis=4, seating_plan_y_axis=6))
    seats.append(Seat(number=65, seating_plan_x_axis=5, seating_plan_y_axis=6))
    seats.append(Seat(number=66, seating_plan_x_axis=6, seating_plan_y_axis=6))
    seats.append(Seat(number=67, seating_plan_x_axis=8, seating_plan_y_axis=6))
    seats.append(Seat(number=68, seating_plan_x_axis=9, seating_plan_y_axis=6))
    seats.append(Seat(number=69, seating_plan_x_axis=10, seating_plan_y_axis=6))
    seats.append(Seat(number=70, seating_plan_x_axis=11, seating_plan_y_axis=6))
    seats.append(Seat(number=71, seating_plan_x_axis=12, seating_plan_y_axis=6))
    seats.append(Seat(number=72, seating_plan_x_axis=13, seating_plan_y_axis=6))
    seats.append(Seat(number=73, seating_plan_x_axis=15, seating_plan_y_axis=6))
    seats.append(Seat(number=74, seating_plan_x_axis=16, seating_plan_y_axis=6))
    seats.append(Seat(number=75, seating_plan_x_axis=17, seating_plan_y_axis=6))
    seats.append(Seat(number=76, seating_plan_x_axis=18, seating_plan_y_axis=6))
    seats.append(Seat(number=77, seating_plan_x_axis=19, seating_plan_y_axis=6))
    seats.append(Seat(number=78, seating_plan_x_axis=20, seating_plan_y_axis=6))

    # 5th row
    seats.append(Seat(number=79, seating_plan_x_axis=1, seating_plan_y_axis=7))
    seats.append(Seat(number=80, seating_plan_x_axis=2, seating_plan_y_axis=7))
    seats.append(Seat(number=81, seating_plan_x_axis=3, seating_plan_y_axis=7))
    seats.append(Seat(number=82, seating_plan_x_axis=4, seating_plan_y_axis=7))
    seats.append(Seat(number=83, seating_plan_x_axis=5, seating_plan_y_axis=7))
    seats.append(Seat(number=84, seating_plan_x_axis=6, seating_plan_y_axis=7))
    seats.append(Seat(number=85, seating_plan_x_axis=8, seating_plan_y_axis=7))
    seats.append(Seat(number=86, seating_plan_x_axis=9, seating_plan_y_axis=7))
    seats.append(Seat(number=87, seating_plan_x_axis=10, seating_plan_y_axis=7))
    seats.append(Seat(number=88, seating_plan_x_axis=11, seating_plan_y_axis=7))
    seats.append(Seat(number=89, seating_plan_x_axis=12, seating_plan_y_axis=7))
    seats.append(Seat(number=90, seating_plan_x_axis=13, seating_plan_y_axis=7))
    seats.append(Seat(number=91, seating_plan_x_axis=15, seating_plan_y_axis=7))
    seats.append(Seat(number=92, seating_plan_x_axis=16, seating_plan_y_axis=7))
    seats.append(Seat(number=93, seating_plan_x_axis=17, seating_plan_y_axis=7))
    seats.append(Seat(number=94, seating_plan_x_axis=18, seating_plan_y_axis=7))
    seats.append(Seat(number=95, seating_plan_x_axis=19, seating_plan_y_axis=7))
    seats.append(Seat(number=96, seating_plan_x_axis=20, seating_plan_y_axis=7))

    # 6th row
    seats.append(Seat(number=97, seating_plan_x_axis=1, seating_plan_y_axis=8))
    seats.append(Seat(number=98, seating_plan_x_axis=2, seating_plan_y_axis=8))
    seats.append(Seat(number=99, seating_plan_x_axis=3, seating_plan_y_axis=8))
    seats.append(Seat(number=100, seating_plan_x_axis=4, seating_plan_y_axis=8))
    seats.append(Seat(number=101, seating_plan_x_axis=5, seating_plan_y_axis=8))
    seats.append(Seat(number=102, seating_plan_x_axis=6, seating_plan_y_axis=8))
    seats.append(Seat(number=103, seating_plan_x_axis=8, seating_plan_y_axis=8))
    seats.append(Seat(number=104, seating_plan_x_axis=9, seating_plan_y_axis=8))
    seats.append(Seat(number=105, seating_plan_x_axis=10, seating_plan_y_axis=8))
    seats.append(Seat(number=106, seating_plan_x_axis=11, seating_plan_y_axis=8))
    seats.append(Seat(number=107, seating_plan_x_axis=12, seating_plan_y_axis=8))
    seats.append(Seat(number=108, seating_plan_x_axis=13, seating_plan_y_axis=8))
    seats.append(Seat(number=109, seating_plan_x_axis=15, seating_plan_y_axis=8))
    seats.append(Seat(number=110, seating_plan_x_axis=16, seating_plan_y_axis=8))
    seats.append(Seat(number=111, seating_plan_x_axis=17, seating_plan_y_axis=8))
    seats.append(Seat(number=112, seating_plan_x_axis=18, seating_plan_y_axis=8))
    seats.append(Seat(number=113, seating_plan_x_axis=19, seating_plan_y_axis=8))
    seats.append(Seat(number=114, seating_plan_x_axis=20, seating_plan_y_axis=8))

    # Create seats
    Seat.objects.bulk_create(seats)
