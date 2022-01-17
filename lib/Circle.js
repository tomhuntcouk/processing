import Shape from './Shape.js';
import Controls from './Controls.js';
import * as TransMatrix from './Matrix.js'

class Circle extends Shape {
	constructor( controlsName ) {
		super();		
		this.radius = 0;
		this.center = new TransMatrix.Vector3();
		this.start = 0;
		this.end = 1;

		if( controlsName ) {
			const controlsGroup = Controls.addGroup( controlsName );
			this.controls = controlsGroup;

			controlsGroup.addControl( 'radius', 0, 300, 100, 1 );
			controlsGroup.addControl( 'resolution', 0, 100, 80, 1 );
			controlsGroup.addControl( 'start', 0, 1, 0, 0.01 );
			controlsGroup.addControl( 'end', 0, 1, 1, 0.01 );
			controlsGroup.addControl( 'rotate', 0, 360, 0, 0.1 );
		}

	}

	create( radius, resolution=100, center=this.center, start, end ) {
		this.clear();

		this.radius = radius;

		if( start != undefined ) this.start = start;
		if( start != undefined ) this.start = start;
		if( end != undefined ) this.end = end;

		const s = int(360 * this.start);
		const e = int(360 * this.end);
		const r = 360 / resolution;

		const startp = new TransMatrix.Vector3( 
			sin( radians(s) ) * this.radius,
			cos( radians(s) ) * this.radius
		);
		this.addVertex( startp );

		const closestToStart = Math.ceil( s / r ) * r;

		for( let i=closestToStart ; i <= e; i += r ) {			
			const t = radians( i );			
			const p = new TransMatrix.Vector3( 
				sin( t ) * this.radius,
				cos( t ) * this.radius 
			);
			this.addVertex( p );
		}

		const endp = new TransMatrix.Vector3( 
			sin( radians(e) ) * this.radius,
			cos( radians(e) ) * this.radius
		);	
		this.addVertex( endp );

	}

	close() {		
		if( this.start > 0 || this.end < 1 ) {
			// const center = Object.assign( {}, this.center );
			const center = this.center;
			this.vertices.splice( 0, 0, center );
			this.vertices.push( center );	
		}		
	}

	// scale( vector3 ) {
	// 	super.scale( vector3 );
	// 	this.radius *= vector3.magnitude;
	// }

	normalAtPoint( vector3 ) {
		let rx = ( vector3.x + this.center.x ) / (this.radius + 0.00001);
		let ry = ( vector3.y + this.center.y ) / (this.radius + 0.00001);

		let n;
		if( Math.pow( rx, 2 ) + Math.pow( ry, 2 ) >= 1 ) {
			n = new TransMatrix.Vector3();
		} else {
			n = new TransMatrix.Vector3( rx, ry, sqrt( 1 - rx * rx - ry * ry ) );
			n.normalize();
		}

		return n;
	}

	sphericalPositionAtPoint( vector3 ) {
		return this.normalAtPoint( vector3 ).scale( this.radius );
	}

	noise( amplitude=1, frequency=1, time=0 ) {
		for( let i in this.vertices ) {
			const vert = this.vertices[i];
			let n = noise( (vert.x + width + time) * frequency, (vert.y + height + time) * frequency, (vert.z + height + time) * frequency );
			n = (n - 0.5 ) * 4;

			let offset = TransMatrix.Vector3.lerp( this.center, vert, n * amplitude );
			vert.add( offset );
		}
	}

	noiseSpherical( amplitude=1, frequency=1, time=1, rotation=new TransMatrix.Vector3() ) {
		const rotationAmount = rotation.magnitude;
		const rotationAxis = rotation.normalize();

		for( let i in this.vertices ) {
			const vert = this.vertices[i];
			let sphericalVert = this.sphericalPositionAtPoint( vert );

			let m = new TransMatrix.Matrix4()
			m = m.rotate( rotationAmount, rotationAxis );
			sphericalVert = m.applyToPoint( sphericalVert );

			let n = noise( (sphericalVert.x + time) * frequency, (sphericalVert.y + time) * frequency, (sphericalVert.z + time) * frequency );
			n = (n - 0.5 ) * 4;

			let offset = TransMatrix.Vector3.lerp( this.center, vert, n * amplitude );
			vert.add( offset );
		}
	}


}

export default Circle;