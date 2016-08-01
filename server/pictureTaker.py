import time
import picamera

with picamera.PiCamera() as camera:
  while True:
    print 'waiting for prompt'
    filename = raw_input()
    print 'taking picture to: ', filename
    camera.resolution = (1024, 768)
    camera.capture(filename);
    print 'picture taken'
