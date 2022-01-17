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

	get width() {
		return this.size.width;
	}

	get height() {
		return this.size.height;	
	}

	get scaleVector() {
		return new TransMatrix.Vector3(
			this.scale,
			this.scale,
			this.scale
		);
	}

	create( width, height, scale, loop ) {

		this.size.width = width;
		this.size.height = height;
		this.scale = scale;
		this.scaledSize = {
			'width' : this.size.width * this.scale,
			'height' : this.size.width * this.scale
		};
		
		let canvas = createCanvas( this.scaledSize.width, this.scaledSize.height );
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
		this.matrix = this.matrix.translate( new TransMatrix.Vector3( x, y ) );
	}

	applyMatrix( point ) {		

		return this.matrix.scale( this.scaleVector ).applyToPoint( point );
	}


}


const instance = new Canvas();

export default instance;