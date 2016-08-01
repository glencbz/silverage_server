import random
import sys
from time import sleep

WIDTH = 11
HEIGHT = 7

def full_reading(width, height):
    return [[0 for _ in xrange(width)] for _ in xrange(height)]

def rand_true():
    return random.random() < 0.5

def item_reading(weight, width, height):
    return [[weight for _ in xrange(width)] for _ in xrange(height)]

def noise_val(val):
    return val * random.uniform(.9, 1.1)

def noise_reading(reading):
    return [[noise_val(val) for val in r] for r in reading]

def combine_reading(reading, item, offset):
    o_i, o_j = offset
    new_reading = [r[:] for r in reading]
    for i in xrange(len(item)):
        for j in xrange(len(item[i])):
            new_reading[o_i + i][o_j + j] += item[i][j]
    return new_reading

def print_readings(timeout):
    items = [item_reading(100,2,3), item_reading(100,1,1)]
    times = [5, 25]

    reading_timeout = 10
    offsets = [(4,8), (5,0)]

    base_reading = full_reading(WIDTH,HEIGHT)
    count = 0

    while True:
        out_reading = base_reading
        count += 1
        for ind in xrange(len(times)):
            if count >= times[ind] and count <= times[ind] + reading_timeout:
                out_reading = combine_reading(out_reading, items[ind], offsets[ind])

        print out_reading
        sys.stdout.flush()
        sleep(timeout)
        count = count % 50

print_readings(.5)