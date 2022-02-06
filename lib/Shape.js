import Canvas from './Canvas.js';
import PointList from './PointList.js';
import * as TransMatrix from './Matrix.js';

const BREAK = 'BREAK';

class Shape extends PointList {
	constructor() {
		super();
	}

	addBreak( position ) {
		this.addVertex( BREAK, position );
	}

	pointIsBreak( position ) {
		return this.vertices[position] == BREAK;
	}

	render() {		

		beginShape();

		for( const i in this.vertices ) {
			const vert = this.vertices[i];
			if( this.pointIsBreak( i ) ) {
				endShape();
				beginShape();
			} else {
				const canvasVert = Canvas.applyMatrix( vert );			
				vertex( canvasVert.x, canvasVert.y );
			}			
		}

		endShape();
	}

	renderPoints() {
		for( const i in this.vertices ) {
			const vert = this.vertices[i];
			if( this.pointIsBreak( i ) ) continue;
			const canvasVert = Canvas.applyMatrix( vert );
			circle(
				canvasVert.x,
				canvasVert.y,
				5
			);

		}
	}

}

export default Shape;