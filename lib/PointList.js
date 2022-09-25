import Canvas from './Canvas.js';
import * as TransMatrix from './Matrix.js';


const BREAK = 'BREAK';


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
		this.clear()
		this.append( ...verts );
	}

	createFrom( pointlist ) {
		this.vertices = [...pointlist.vertices];
	}

	append( ...verts ) {
		for( const vertex of verts ) {
			this.addVertex( vertex );
		}
	}

	addVertex( vertex, position=this.vertices.length ) {
		// this.vertices.push( vertex );		
		this.vertices.splice( position, 0, vertex );
	}

	removeVertex( position ) {
		this.vertices.splice( position, 1 );
	}

	addBreak( position ) {
		this.addVertex( BREAK, position );
	}

	pointIsBreak( position ) {
		return this.vertices[position] == BREAK;
	}

	addRandomBreak( position, chance, offset=new TransMatrix.Vector3() ) {
		const r = noise( 
			this.vertices[position].x + Canvas.scaledWidth + offset.x,
			this.vertices[position].y + Canvas.scaledHeight + offset.y,
			this.vertices[position].z + Canvas.scaledHeight + offset.z
		);
		if( r < chance ) {
			this.vertices[position] = BREAK;
		}
	}

	addRandomBreaks( chance ) {
		for( let i in this.vertices ) {
			this.addRandomBreak( i, chance );
		}
	}

	noise( amplitude, frequency=1, time=0 ) {
		for( let vert of this.vertices ) {

			if( vert == BREAK ) continue;

			let nx = noise( (vert.x+width+time) * frequency, 0, 0 );
			let ny = noise( 0, (vert.y+width+time) * frequency, 0 );
			let nz = noise( 0, 0, (vert.z+width+time) * frequency );
			nx = (nx - 0.5 ) * 2;
			ny = (ny - 0.5 ) * 2;
			nz = (nz - 0.5 ) * 2;
			vert.add( new TransMatrix.Vector3( nx * amplitude, ny * amplitude, nz * amplitude ) );
		}
	}

	cull( value ) {
		for( let vert in this.vertices ) {
			if( this.vertices[vert].z > value ) {
				this.vertices[vert] = BREAK;
			}
		}
	}

	translate( vector3 ) {
		let m = new TransMatrix.Matrix4();
		m = m.translate( vector3 );
		for( let vert in this.vertices ) {
			if( this.vertices[vert] == BREAK ) continue;
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
			if( typeof(this.vertices[vert] ) == 'string' ) {
				continue;
			}
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

	renderPoints( radius=5 ) {
		for( const i in this.vertices ) {
			const vert = this.vertices[i];
			const canvasVert = Canvas.applyMatrix( vert );
			circle(
				canvasVert.x,
				canvasVert.y,
				radius
			);

		}
	}
}


export default PointList;