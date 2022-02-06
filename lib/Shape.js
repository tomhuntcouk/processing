import Canvas from './Canvas.js';
import PointList from './PointList.js';
// import * as TransMatrix from './Matrix.js';
// import Random from './Random.js';

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

	addRandomBreaks( chance ) {
		for( let i in this.vertices ) {
			// const r = random();
			const r = noise( this.vertices[i].x + Canvas.scaledWidth, this.vertices[i].y + Canvas.scaledHeight );
			if( r < chance ) {
				// this.addBreak( i );
				this.vertices[i] = BREAK;
			}
		}
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