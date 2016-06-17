import random
import sys
from time import sleep

def rand_true():
    return random.random() < 0.5

def rand_cells(num_cell):
    return [1 if rand_true() else 0 for _ in xrange(num_cell)]

def cont_print(timeout):
    while True:
        print rand_cells(56)
        sys.stdout.flush()
        sleep(timeout)

cont_print(1)