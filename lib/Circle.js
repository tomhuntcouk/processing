import Shape from './Shape.js';
import Controls from './Controls.js';
import Matrix from './Matrix.js'

class Circle extends Shape {
	constructor( controlsName ) {
		super();		
		this.radius = 0;
		this.center = Matrix.vec4.create();
		this.start = 0;
		this.end = 1;

		if( controlsName ) {
			const controlsGroup = Controls.addGroup( controlsName );
			this.controls = controlsGroup;

			controlsGroup.addControl( 'radius', 0, 300, 100, 1 );
			controlsGroup.addControl( 'resolution', 0, 100, 80, 1 );
			controlsGroup.addControl( 'start', 0, 1, 0, 0.01 );
			controlsGroup.addControl( 'end', 0, 1, 1, 0.01 );
			controlsGroup.addControl( 'rotate', 0, 360, 0, 1 );
		}

	}

	create( radius, center, resolution, start, end, radialNoise ) {
		this.clear();

		this.radius = radius;
		this.center = center;

		if( start != undefined ) this.start = start;
		if( end != undefined ) this.end = end;

		const s = int(360 * this.start);
		const e = int(360 * this.end);
		const r = 360 / resolution;

		// const startp = new p5.Vector( 
		// 	sin( radians(s) ) * this.radius,
		// 	cos( radians(s) ) * this.radius
		// );
		const startp = Matrix.vec4.fromValues( 
			sin( radians(s) ) * this.radius,
			cos( radians(s) ) * this.radius,
			0, 1
		);
		this.addVertex( startp );

		const closestToStart = Math.ceil( s / r ) * r;

		for( let i=closestToStart ; i <= e; i += r ) {
			
			const t = radians( i );
			
			// const p = new p5.Vector( 
			// 	sin( t ) * this.radius,
			// 	cos( t ) * this.radius 
			// );
			const p = Matrix.vec4.fromValues( 
				sin( t ) * this.radius,
				cos( t ) * this.radius 
			);
			this.addVertex( p );
		}

		// const endp = new p5.Vector( 
		// 	sin( radians(e) ) * this.radius,
		// 	cos( radians(e) ) * this.radius
		// );
		const endp = Matrix.vec4.fromValues( 
			sin( radians(e) ) * this.radius,
			cos( radians(e) ) * this.radius,
			0, 1
		);
		this.addVertex( endp );
	}

	noise( amplitude, frequency, time ) {
		if( frequency == undefined ) frequency = 1;
		if( time == undefined ) time = 0;
		for( let vert of this.vertices ) {
			let n = noise( (vert.x + width) * frequency, (vert.y + height) * frequency, time );
			n = (n - 0.5 ) * 2;

			// let offset = p5.Vector.lerp( this.center, vert, n * amplitude );
			// vert.add( offset );

			let offset = Matrix.vec4.lerp( this.center, vert, n * amplitude );
			Matrix.vec4.add( vert, vert, offset );
		}
	}

}

export default Circle;