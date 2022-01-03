

class WeightedLine :
    def __init__( self, x1, y1, x2, y2, resolution ) :
        self.shape = createShape()
        self.start = PVector( x1, y1 )
        self.end = PVector( x2, y2 )
        self.resolution = resolution
        self.originalVertices = []
        self.thickness = 1
    
    def setThickness( self, thickness ) :
        self.thickness = thickness
        
    def drawVertices( self ) :
        for i in range( self.shape.getVertexCount() ) :
            v = self.shape.getVertex(i)
            circle( v.x, v.y, 4 )
                
    def create( self ) :
        self.shape.beginShape()
        for i in range(self.resolution + 1) :
            v = PVector.lerp( self.start, self.end, (1.0/self.resolution) * i )
            self.shape.vertex( v.x, v.y )
            self.originalVertices.append( v )
        self.shape.endShape()
        self.shape.setStroke( 255 )
    
    def render( self ) :
        shape(self.shape)
    
    def thicknessFromCoords( self, callback ) :
        for i in range( self.shape.getVertexCount() ) :
            ov = self.originalVertices[i]
            c = callback( PVector( ov.x, ov.y ) )
            c = (red( c ) / 255.0) * float(self.thickness)
            v = PVector( ov.x + c, ov.y, ov.z )
            
            self.shape.setVertex(i, v)
                
    def wiggle( self, frequency, amplitude, speed ) :
        for i in range( self.shape.getVertexCount() ) :
            v = self.shape.getVertex(i)
            ov = self.originalVertices[i]
            
            sx = radians( ((v.y / width) * frequency.x) * 360 ) 
            sy = radians( ((v.x / height) * frequency.y) * 360 )
            
            v.x = ov.x + sin(sx + (frameCount/frameRate) * speed.x) * amplitude.x
            v.y = ov.y + sin(sy + (frameCount/frameRate) * speed.y) * amplitude.y
            
            self.shape.setVertex(i, v)
