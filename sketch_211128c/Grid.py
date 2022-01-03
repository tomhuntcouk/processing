

class Grid :
    def __init__( self, resX, resY, width, height ) :
        self.resolution = PVector( resX, resY )
        self.grid = [ [ None ] * resX for i in range( resY ) ]
        self.size = PVector( width, height )
        
    def create( self ) :
        w = self.size.x / self.resolution.x
        h = self.size.y / self.resolution.y
        for y in range( len( self.grid ) ) :
            for x in range( len( self.grid[y] ) ) :                
                xo = x - (self.resolution.x / 2)
                yo = y - (self.resolution.y / 2)                
                s = createShape( RECT, xo * w, yo * h, w, h )                
                self.grid[y][x] = s
                
    def render( self ) :
        for row in self.grid :
            for cell in row :
                shape( cell )
                
    def colorFromCoords( self, callback ) :
        for y in range( len( self.grid ) ) :
            for x in range( len( self.grid[y] ) ) :
                s = self.grid[y][x]
                w = (self.size.x / self.resolution.x) * x
                h = (self.size.y / self.resolution.y) * y
                c = callback( PVector( w, h ) )
                s.setFill( c )
