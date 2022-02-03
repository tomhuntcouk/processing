import Canvas from './Canvas.js';
import * as TransMatrix from './Matrix.js';

class PointList {
	constructor() {
		this.vertices = [];
		// this.resolution = this.vertices.length;
	}

	get resolution() {
		return this.vertices.length;
	}

	clear() {
		this.vertices = [];
	}

	create( ...verts ) {
		for( const vertex of verts ) {
			this.addVertex( vertex );
		}
	}

	addVertex( vertex ) {
		this.vertices.push( vertex );		
	}

	noise( amplitude, frequency=1, time=0 ) {
		for( let vert of this.vertices ) {
			let nx = noise( (vert.x+width+time) * frequency );
			let ny = noise( (vert.y+width+time) * frequency );
			let nz = noise( (vert.y+width+time) * frequency );
			nx = (nx - 0.5 ) * 2;
			ny = (ny - 0.5 ) * 2;
			nz = (nz - 0.5 ) * 2;
			vert.add( new TransMatrix.Vector3( nx * amplitude, ny * amplitude, nz * amplitude ) );
		}
	}

	translate( vector3 ) {
		let m = new TransMatrix.Matrix4();
		m = m.translate( vector3 );
		for( let vert in this.vertices ) {
			this.vertices[vert] = m.applyToPoint( this.vertices[vert] );			
		}
	}

	rotate( degrees, axis, center ) {
		if( axis == undefined ) axis = new TransMatrix.Vector3( 0, 0, 1 );
		if( axis == 'X' ) axis = new TransMatrix.Vector3( 1, 0, 0 );
		if( axis == 'Y' ) axis = new TransMatrix.Vector3( 0, 1, 0 );
		if( axis == 'Z' ) axis = new TransMatrix.Vector3( 0, 0, 1 );

		if( center == undefined ) center = new TransMatrix.Vector3();
		
		let m = new TransMatrix.Matrix4();
		m = m.translate( center );
		m = m.rotate( degrees, axis );
		
		for( let vert in this.vertices ) {
			this.vertices[vert] = m.applyToPoint( this.vertices[vert] );			
		}
	}

	scale( vector3 ) {
		let m = new TransMatrix.Matrix4();
		m = m.scale( vector3 );
		for( let vert in this.vertices ) {
			this.vertices[vert] = m.applyToPoint( this.vertices[vert] );			
		}
	}
}


export default PointList;