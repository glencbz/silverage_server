#!/usr/bin/env python

""" Basic example of retrieving the zx_sensor data, via the I2C interface of
a Rasberry Pi. Tested with Pi2. When run, prints 'x' & 'z' to console
"""

import time
# project
from zx_sensor import ZxSensor


# Parameters for opened and closed door state
close = range(16,20,1)
#open =  range(170,180,1)
z_i = 154


# Initialise the ZxSensor device using the default address
zx_sensor = ZxSensor(0x10)
state=0
prevstate=0
time.sleep(2)
openstate=0
prevopenstate=0
zbuffer=[0,0,0,0,0,0,0,0]

while (True):
	if zx_sensor.position_available():
        # display raw values:
        # print('x {0} z {1}'.format(zx_sensor.read_x(), zx_sensor.read_z()))


        	z = zx_sensor.read_z()
	else:
		z=300

	zbuffer .insert(0,z)  	
	zbuffer.pop()
#	print (zbuffer) 
#	print (z)

	if (openstate): 
 	 # opened
	
 		if (all(a<240 for a in zbuffer[0:3])):
			state=1
		else:
			state=0
	
		if (state!=prevstate):
		#	print(z)
			if (state==1):
				print ("IN")
			else:
				print("OUT")
    
		if (all((a in close)for a in zbuffer)): 
			openstate=0  
   
   
	else:
	
 		 # closed
 		if (all((a ==300) for a in zbuffer)): 
      			openstate=1

	if (openstate!=prevopenstate):
		if (openstate): 
			print ("OPEN")
		else:
			print("CLOSE")


        time.sleep(.07)
	prevstate=state
	prevopenstate=openstate


 
