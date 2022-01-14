// const Matrix = window.TransformationMatrix;

import * as TransMatrix from './Matrix.js';


class Canvas {
	constructor() {
		this.matrix = new TransMatrix.Matrix4();
		this.matrixStore = [];
		this.context;
		
		this.size = {
			'width' : 0,
			'height' : 0
		}
		this.scale = 1;
		this.scaledSize = {
			'width' : 0,
			'height' : 0
		}

	}

	create( width, height, scale, loop ) {

		this.size.width = width;
		this.size.height = height;
		this.scale = scale;
		this.scaledSize = {
			'width' : this.size.width * this.scale,
			'height' : this.size.width * this.scale
		};
		
		let canvas = createCanvas( this.scaledSize.width, this.scaledSize.height, WEBGL );
		this.context = canvas.drawingContext;

		if( !loop ) {
			console.log('not looping');
			noLoop();
		}

	}

	pushMatrix() {
		this.matrixStore.push( this.matrix );
	}

	popMatrix() {
		this.matrix = this.matrixStore.pop();
	}

	translate( x, y ) {
		// this.matrix = Matrix.transform(
		// 	this.matrix,
		// 	Matrix.translate(x,y)
		// );
		console.log( this.matrix.raw.toString() );
		this.matrix = this.matrix.translate( new TransMatrix.Vector3( x, y ) );
		console.log( this.matrix.raw.toString() );
	}

	applyMatrix( point ) {
		return Matrix.applyToPoint( this.matrix, point );
	}


}


const instance = new Canvas();
// Object.freeze( instance );

export default instance;