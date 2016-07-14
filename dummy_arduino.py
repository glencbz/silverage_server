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
    item1 = item_reading(10,2,2)
    reading = full_reading(10,10)

    count = 0
    item_time = 5
    while True:
        count += 1
        print reading
        if count == item_time:
            reading = combine_reading(reading, item1, (2,2))

        sys.stdout.flush()
        sleep(timeout)

print_readings(2)