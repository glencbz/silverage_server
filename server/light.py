# just need to fill in these two function here
import time

from neopixel import* 


# LED strip configuration:
LED_COUNT   = 16      # Number of LED pixels.
LED_PIN     = 18      # GPIO pin connected to the pixels (must support PWM!).
LED_FREQ_HZ = 800000  # LED signal frequency in hertz (usually 800khz)
LED_DMA     = 5       # DMA channel to use for generating signal (try 5)
LED_INVERT  = False   # True to invert the signal (when using NPN transistor level shift)

strip = Adafruit_NeoPixel(LED_COUNT, LED_PIN, LED_FREQ_HZ,LED_DMA, LED_INVERT)
strip.begin()


def light_on():
	"Turn on the LED strip."
	strip.begin()
	for i in range(strip.numPixels()):
		strip.setPixelColor(i,Color(255,255,255))
	strip.show()
	print 'ON'

def light_off():
	"Turn off the LED strip."
	strip.begin()
	for i in range(strip.numPixels()):
		strip.setPixelColor(i,Color(0,0,0))
	strip.show()
	print 'OFF'

while True:
  signal = raw_input()
  if signal == 'ON':
    light_on()
  else:
    light_off()

