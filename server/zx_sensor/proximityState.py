#!/usr/bin/env python

""" Basic example of retrieving the zx_sensor data, via the I2C interface of
a Rasberry Pi. Tested with Pi2. When run, prints 'x' & 'z' to console
"""

import time
# project
from zx_sensor import ZxSensor


# Parameters for opened and closed door state
close = range(12,20,1)
xclose= range(118,151,1)
#open =  range(170,180,1)



# Initialise the ZxSensor device using the default address
zx_sensor = ZxSensor(0x10)
state=0
prevstate=0
time.sleep(2)
openstate=0
prevopenstate=0
zbuffer=[0,0,0,0,0,0,0,0]
xbuffer=[0,0,0,0,0,0,0,0]

while (True):
	if zx_sensor.position_available():
        # display raw values:
        # print('x {0} z {1}'.format(zx_sensor.read_x(), zx_sensor.read_z()))


        	z = zx_sensor.read_z()
		x = zx_sensor.read_x()	
	else:
		z=300
		x=150

	zbuffer .insert(0,z)  	
	zbuffer.pop()
	xbuffer.insert(0,x)
	xbuffer.pop()
#	print (zbuffer) 
#	print (z)
#	print (x)
#	print xbuffer

	if (openstate): 
 	 # opened
	
 		if (all((a>160) for a in zbuffer[:2])):
			state=0
		elif (all((a<160) for a in zbuffer[:2])):
			state=1
	
		if (state!=prevstate):
		#	print(z)
			if (state==1):
				print ("IN")
			else:
				print("OUT")
    
		if ((all((a in close)for a in zbuffer)) and (all((b in xclose)for b in xbuffer))): 
			openstate=0  
   
   
	else:
	
 		 # closed
 		if (all((a >160) for a in zbuffer)): 
      			openstate=1

	if (openstate!=prevopenstate):
		if (openstate): 
			print ("OPEN")
		else:
			print("CLOSE")


        time.sleep(.05)
	prevstate=state
	prevopenstate=openstate


 
