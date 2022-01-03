

class Sphere2D :
    def __init__( self, radius, pivot ) :
        self.radius = radius
        self.pivot = pivot
        self.lightDir = PVector( 0,0,1 )
        self.lightIntensity = 1.0
    
    def setLight( self, angle, *args ) :
        self.lightDir = PVector( cos(angle), 0, sin(angle) ).normalize()
        try :
            self.lightIntensity = args[0]
        except :
            pass    
    
    def drawGuide( self, resolution ) :
        resolution = float(resolution)
        for i in range( int(resolution) ) :
            sa = (i / resolution) * 360.0
            ea = ((i + 1) / resolution) * 360.0
            
            s = PVector( sin(radians(sa)), cos(radians(sa)) ) * self.radius
            e = PVector( sin(radians(ea)), cos(radians(ea)) ) * self.radius
            
            # s -= self.pivot
            # e -= self.pivot
            
            stroke(255)
            line( s.x, s.y, e.x, e.y )
    
    def coordYfromX( self, x ) :
        a = acos((float(x))/ self.radius)
        return ( sin(a) * self.radius, -sin(a) * self.radius) 
    
    def coordXfromY( self, y ) :
        a = asin(float(y) / self.radius)
        return cos(a) * self.radius
        
                                        
    def normalVector( self, coord ) :
        rx = (( coord.x + self.pivot.x - self.radius ) / self.radius)
        ry = (( coord.y + self.pivot.y - self.radius ) / self.radius)
        
        if( pow( rx, 2 ) + pow( ry, 2 ) > 1 ) :
            n = PVector(0,0,0)
        else :        
            n = PVector( rx, ry, sqrt(1 - rx * rx - ry * ry ) ).normalize()
        return n
    
    def normalColor( self, coord ) :
        n = self.normalVector(coord)
        return color( n.x * 255.0, n.y * 255.0, n.z * 255.0 )
    
    def lambertColor( self, coord ) :
        N = self.normalVector(coord)
        L = self.lightDir
        v = max( PVector.dot( N, L ), 0.0 ) * self.lightIntensity
        return color( v * 255 )
    
        
        
    
