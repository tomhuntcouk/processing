import Canvas from './Canvas.js';
import PointList from './PointList.js';
import * as TransMatrix from './Matrix.js';
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

	addRandomBreak( position, chance, offset=new TransMatrix.Vector3() ) {
		const r = noise( this.vertices[position].x + Canvas.scaledWidth + offset.x, this.vertices[position].y + Canvas.scaledHeight + offset.y );
		if( r < chance ) {
			this.vertices[position] = BREAK;
		}
	}

	addRandomBreaks( chance ) {
		for( let i in this.vertices ) {
			this.addRandomBreak( i, chance );
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

	renderPoints( radius=5 ) {
		for( const i in this.vertices ) {
			const vert = this.vertices[i];
			if( this.pointIsBreak( i ) ) continue;
			const canvasVert = Canvas.applyMatrix( vert );
			circle(
				canvasVert.x,
				canvasVert.y,
				radius
			);

		}
	}

}

export default Shape;