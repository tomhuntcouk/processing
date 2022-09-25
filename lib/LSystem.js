import Canvas from './Canvas.js';
import Shape from './Shape.js';
import * as TransMatrix from './Matrix.js';

class LSystem extends Shape {
	constructor() {
		super();
		this.axiom = '';
		this.rules = {};
		this.angle = 90;
	}

	addRule( key, rule ) {
		this.rules[key] = rule;
	}

	setAxiom( axiom ) {
		this.axiom = axiom;
	}

	setAngle( angle ) {
		this.angle = angle;
	}

	initMooreCurve() {
		this.setAxiom( 'LFL+F+LFL' );
		this.addRule( 'L', '-RF+LFL+FR-' );
		this.addRule( 'R', '+LF-RFR-FL+' );
		this.setAngle( 90 );
	}

	initPenroseTile() {
		this.setAxiom( '[N]++[N]++[N]++[N]++[N]' );
		this.addRule( 'M',	'OF++PF----NF[-OF----MF]++' );
		this.addRule( 'N',	'+OF--PF[---MF--NF]+' );
		this.addRule( 'O',	'-MF++NF[+++OF++PF]-' );
		this.addRule( 'P',	'--OF++++MF[+PF++++NF]--NF' );
		this.addRule( 'F', '' );
		this.setAngle( 36 );
	}

	create( cycles=2, scale=100, max=100000 ) {
		let string = this.axiom;
		for( let i = 1; i <= cycles; i++ ) {
			string = this.produce(string);
		}

		// console.log( string.match( /[F\+\-]+/g ).join('') );

		let position = new TransMatrix.Vector3();
		let direction = new TransMatrix.Vector3( 1, 0, 0 );


		// let s = (cycles * cycles) + ( 2 * cycles )
		let distance = scale;
		// let distance = scale / cycles ** 2;
		// let distance = scale / ((14.4 * cycles) - 19.4)


		let stack = [];

		
		let count = 1;
		this.addVertex( position );


		for( let character of string ){			
			if( count > max ) {
				break
			}
			switch( character ) {				
				case 'F' :
					// forward
					let newVertex = direction.clone();
					newVertex.scale( distance );
					position = TransMatrix.Vector3.add( position, newVertex );
					this.addVertex( position );
					count++;
					// console.log( 'forward' );
					break;		
				case '+' :
					// right 90
					direction.rotate( this.angle );
					// console.log( direction );
					break;
				case '-' :
					// left 90
					direction.rotate( -this.angle );
					// console.log( direction );
					break;
				case '[' :
					stack.push(
						[ position.clone(), direction.clone() ]
					);
					// console.log( stack.length, position );
					break;
				case ']' :
					const p = stack.pop();
					position = p[0];
					direction = p[1];
					// console.log( stack.length + 1, position );
					
					this.addBreak();
					this.addVertex(position);

					break;
			}						
		}

		// this.translate( new TransMatrix.Vector3(
		// 	0,
		// 	-distance/2
		// ) );

		this.updateBounds();
		// this.center( true, true );
		// let sx = scale / this.bounds.width;
		// let sy = scale / this.bounds.height;
		// this.scale( new TransMatrix.Vector3( sx, sy ) );
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