import Shape from './Shape.js';
import Controls from './Controls.js';

class Circle extends Shape {
	constructor( controlsName ) {
		super();		
		this.radius = 0;
		this.center = new p5.Vector(0,0);
		this.start = 0;
		this.end = 1;

		if( controlsName ) {
			const controlsGroup = Controls.addGroup( controlsName );
			this.controls = controlsGroup;

			controlsGroup.addControl( 'radius', 0, 300, 100, 1 );
			controlsGroup.addControl( 'resolution', 0, 100, 20, 1 );
			controlsGroup.addControl( 'start', 0, 1, 0, 0.01 );
			controlsGroup.addControl( 'end', 0, 1, 1, 0.01 );
			controlsGroup.addControl( 'rotate', 0, 360, 0, 1 );
		}

	}

	create( radius, center, resolution, start, end ) {
		this.clear();

		this.radius = radius;
		this.center = center;

		if( start != undefined ) this.start = start;
		if( end != undefined ) this.end = end;

		const s = int(360 * this.start);
		const e = int(360 * this.end);
		const r = 360 / resolution;

		const startp = new p5.Vector( 
			sin( radians(s) ) * this.radius,
			cos( radians(s) ) * this.radius
		);
		this.addVertex( startp );

		const closestToStart = Math.ceil( s / r ) * r;

		for( let i=closestToStart ; i <= e; i += r ) {
			
			const t = radians( i );

			const p = new p5.Vector( 
				sin( t ) * this.radius,
				cos( t ) * this.radius
			);
			this.addVertex( p );
		}

		const endp = new p5.Vector( 
			sin( radians(e) ) * this.radius,
			cos( radians(e) ) * this.radius
		);
		this.addVertex( endp );
	}

}

export default Circle;