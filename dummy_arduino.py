import random
import sys
from time import sleep

WIDTH = 7
HEIGHT = 5

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
    for i in xrange(len(item)):
        for j in xrange(len(item[i])):
            reading[o_i + i][o_j + j] += item[i][j]
    return reading

def print_readings(timeout):
    items = [item_reading(10,2,2), item_reading(100,2,2)]
    times = [5, 15]

    invert_items = [[[-val for val in row] for row in i] for i in items]
    time_outs = [t + 15 for t in times]
    offsets = [(2,2), (0,0)]

    reading = full_reading(WIDTH,HEIGHT)
    count = 0

    while True:
        count += 1
        print reading
        if count in times:
            ind = times.index(count)
            reading = combine_reading(reading, items[ind], offsets[ind])
        if count in time_outs:
            ind = time_outs.index(count)
            reading = combine_reading(reading, invert_items[ind], offsets[ind])

        sys.stdout.flush()
        sleep(timeout)

print_readings(.5)