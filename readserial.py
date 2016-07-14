import serial
import time


#ser=serial.Serial('COM7',115200)
ser=serial.Serial('/dev/ttyACM0',115200,timeout=0.5)
Rows=5
Cols=7

sensorVal=[[0]*Cols for _ in xrange(Rows)]
i=0

failCount = 0

initial=0;
time.sleep(5)
ser.flush()

while True:

	
	a=(ser.readline())

	
	try:
	
		valList = a.split()
		vals= [[int(val) for val in valList[i:i+Cols]] for i in xrange(0,len(valList), Cols)]	
		if not vals:
			failCount += 1
		print (vals)
		

	except Exception as e:
		failCount += 1

#		print(e)
		

	time.sleep(0.1)
	if failCount >= 10:
		break		
	
	
	

