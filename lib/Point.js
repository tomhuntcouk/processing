
class Point {
	constructor( x, y, z ) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	static from( obj ) {
		if( obj.constructor.name == 'Point' ) {
			return obj;
		} else {
			return new Point( obj.x, obj.y, obj.z );
		}		
	}

	literal() {
		return {
			'x' : this.x,
			'y' : this.y,
			'z' : this.z
		};
	}




}




export default Point;