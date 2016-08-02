#!/usr/bin/env python

""" Basic example of retrieving the zx_sensor data, via the I2C interface of
a Rasberry Pi. Tested with Pi2. When run, prints 'x' & 'z' to console
"""

import time
# project
from zx_sensor import ZxSensor

# Initialise the ZxSensor device using the default address
zx_sensor = ZxSensor(0x10)
init=0
z_i=0
x_i=0
state=0
prevstate=0
time.sleep(2)

while (True):
	if zx_sensor.position_available():
        # display raw values:
        # print('x {0} z {1}'.format(zx_sensor.read_x(), zx_sensor.read_z()))


        	z = zx_sensor.read_z()
		x = zx_sensor.read_x()
#	else:
#		z = 240;
#		x = 240;
#	print (z)	
	if (init==0):
		if (z not in range(43,47,1)):
			z_i=z
			x_i=x
			init=1
#		print (z_i, x_i)
	else:
	
		if (abs(z-z_i)>20):
			state=1
		else:
			state=0
	
		if (state!=prevstate):
			if (state==1):
				print ("IN")
			else:
				print("OUT")

        time.sleep(.07)
	prevstate=state

