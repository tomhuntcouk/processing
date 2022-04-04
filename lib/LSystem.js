import Shape from './Shape.js';
import * as TransMatrix from './Matrix.js';

class LSystem extends Shape {
	constructor() {
		super();
		this.axiom = '';
		this.rules = {};
	}

	addRule( key, rule ) {
		this.rules[key] = rule;
	}

	setAxiom( axiom ) {
		this.axiom = axiom;
	}

	initMooreCurve() {
		this.setAxiom( 'LFL+F+LFL' );
		this.addRule( 'L', '-RF+LFL+FR-' );
		this.addRule( 'R', '+LF-RFR-FL+' );
	}

	create( cycles=2, scale=100, max=100000 ) {
		let string = this.axiom;
		for( let i = 1; i <= cycles; i++ ) {
			string = this.produce(string);
		}

		this.addVertex( new TransMatrix.Vector3() );
		let direction = new TransMatrix.Vector3( 1, 0, 0 );
		
		let s = (cycles * cycles) + ( 2 * cycles )
		// let distance = scale / s;
		let distance = scale / cycles ** 2;
		// let distance = scale / ((14.4 * cycles) - 19.4)

		let count = 1;
		for( let character of string ){			
			if( count > max ) {
				break
			}
			switch( character ) {				
				case 'F' :
					// forward
					// console.log('moving forward');
					const lastVertex = this.vertices.slice(-1)[0];
					let newVertex = direction.clone();
					newVertex.scale( distance );
					const point = TransMatrix.Vector3.add( lastVertex, newVertex );
					this.addVertex( point );	
					count++;
					break;		
				case '+' :
					// right 90
					direction.rotate( 90 );
					// console.log('rotating right');
					break;
				case '-' :
					// left 90
					direction.rotate( -90 );
					// console.log('rotating left');
					break;
			}						
		}

		this.translate( new TransMatrix.Vector3(
			0,
			-distance/2
		) );

		curve.updateBounds();
		curve.center( true, false );
		let sx = scale / this.bounds.width;
		let sy = scale / this.bounds.height;
		this.scale( new TransMatrix.Vector3( sx, sy ) );
	}

	produce( string ) {
		let output = '';
		// console.log(string);
		// console.log(Object.keys(this.rules));
		for( let character of string ) {
			if( Object.keys( this.rules ).includes( character ) ) {
				output += this.rules[character];
			} else {
				output += character;
			}
		}
		return output;
	}

}

export default LSystem;