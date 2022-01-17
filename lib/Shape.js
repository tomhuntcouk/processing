import Canvas from './Canvas.js';
import PointList from './PointList.js';
import * as TransMatrix from './Matrix.js';

class Shape extends PointList {
	constructor() {
		super();
	}

	render() {		

		beginShape();

		for( const vert of this.vertices ) {
			const canvasVert = Canvas.applyMatrix( vert );			
			vertex( canvasVert.x, canvasVert.y );
		}

		endShape();
	}

}

export default Shape;