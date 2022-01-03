from Lines import *
from Circles import *
from Grid import *


WIDTH = HEIGHT = 400
RESOLUTIONX = 40
RESOLUTIONY = 20


lines = []
sphere2D = None
grid = Grid( RESOLUTIONX, RESOLUTIONX, WIDTH, HEIGHT )

def colorByXY( coord ) :
    c = color( (coord.x / width)*255, (coord.y / height)*255, 0 )
    return c

def setup() :
    global lines
    global sphere2D
    
    
    size( WIDTH, HEIGHT, P2D )
    pixelDensity( displayDensity() )
    smooth(0)
    frameRate(60)
    background(0)
    noFill()
    # noStroke()
    stroke(255)
    # noLoop() 
    # translate(100, 100)
    sphere2D = Sphere2D( width/2, PVector(width/2,height/2,0) )

    
    for i in range( RESOLUTIONX ) :
        x = (( float(width) / RESOLUTIONX ) * i) - (width/2)
        # x = (( float(width) / RESOLUTION ) * i)
        y = sphere2D.coordYfromX( x )
        # y = ( -(height/2), height )        
        l = WeightedLine( x, y[0], x, y[1], RESOLUTIONY )
        l.create()
        l.setThickness(10)
        lines.append(l)
    
    grid.create( )

prevTime = 0
T = 0
def draw() :
    global prevTime
    global T
    clear()
    
    time = millis()
    delta = time - prevTime
    prevTime = time
    
    T += delta
    
    # print(T)
    
    pushMatrix()
    translate(width/2, height/2)
    sphere2D.setLight( T * 0.001 )
    
    # grid.colorFromCoords( colorByXY )
    grid.colorFromCoords( sphere2D.lambertColor )
    grid.render()
    
    
    circle( 0,0,10 )
    
    # sphere2D.drawGuide( 50 )
    
    # popMatrix()
    # print( mouseX, mouseY )
    
    for l in lines :
        l.thicknessFromCoords( sphere2D.lambertColor )
        # l.wiggle( PVector(2, 0), PVector( 5, 0 ), PVector( 10, 0 ) )    
        
        # l.render()
        # l.drawVertices()

        
    
    popMatrix() 
