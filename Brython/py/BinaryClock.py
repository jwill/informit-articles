import datetime
import baseconv
import html

canvas = html.CANVAS()
canvas.height = 480
canvas.width = 640
ctx = canvas.getContext('2d')
doc['gameboard'] <= canvas

class BinaryClock:
  def __init__(self):
    self.lines = []
    print(len(self.lines))
    self.drawLines()
    self.setTime()
    
  def setTime(self):
    time = datetime.datetime.now()
    hrs = lpad(str(time.hour),2)
    mins = lpad(str(time.minute),2)
    secs = lpad(str(time.second),2)
    
    self.lines[0].set_value(hrs[0])
    self.lines[1].set_value(hrs[1])
        
    self.lines[2].set_value(mins[0])
    self.lines[3].set_value(mins[1])
        
    self.lines[4].set_value(secs[0])
    self.lines[5].set_value(secs[1])
    
    canvas.height = canvas.height
    for i in range(0,6):
      line = self.lines[i]
      line.drawSquares()

  def drawLines(self):
    for i in range(0,6):
      line = ClockLine()
      self.lines.append(line)
    
    self.lines[0].set_max_value(3)
    self.lines[2].set_max_value(3)        
    self.lines[4].set_max_value(3)
    # Alignment
    self.lines[0].y = 40
    self.lines[2].y = 40
    self.lines[4].y = 40
    
    for i in range(0,6):
      line = self.lines[i]
      line.x = (i*25)
      line.drawSquares()
      
  def animate(self):
    clock.setTime()
    requestAnimationFrame(animate)
    
class ClockLine:
  def __init__(self):
      self.sideLength = 30
      self.components = []
      self.set_max_value(4)
      self.x = 0
      self.y = 0
      
  def createNewRect(self):
    return {'x':0, 'y':0, 'fill':'red'}
    
  def drawSquares(self):
    i = 0
    ctx.save()
    ctx.translate(self.x,self.y)
    for obj in self.components:  
      ctx.fillStyle = obj['fill']
      ctx.fillRect(self.x, i*(self.sideLength+10), self.sideLength, self.sideLength)
      i += 1    
    ctx.restore()
    
  def set_max_value(self,value):
    self.components = []
    self.max_value = value
    for i in range(0,value):
      r = self.createNewRect()
      r['y'] = i * (self.sideLength+10)
      self.components.append(r)
    

  def set_value(self, value):
    binaryText = base2.encode(value)
    binaryText = lpad(binaryText, self.max_value)
    for i in range(len(binaryText)):
      v = binaryText[i]
      if v == "0":
        self.components[i]['fill'] = "red"
      else:
        self.components[i]['fill'] = "green"  
      
 
def lpad(s, length):
    while (len(s) < length):
        s = "0" + s
    return s   