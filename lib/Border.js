
class Border {
	constructor( controls ) {
		this.controls = controls;
		this.outlineThickness = 0;
		this.borderThickness = {x:0, y:0};

		this.controls.addSlider('outline', 		0, 10, 0, 1 );
		this.controls.addSlider('border', 		1, 30, 1, 1 );

	}

	init() {
		this.outlineThickness = (controls.getValue( 'outline' ) );
		this.borderThickness.x = ( 1 / controls.getValue( 'border' ) );
		this.borderThickness.y = ( 1 / controls.getValue( 'border' ) );
	}

	render() {
		strokeWeight( this.outlineThickness );

		const o = this.outlineThickness / 2;
		const bx = this.borderThickness.x * width;
		const by = this.borderThickness.y * height;

		beginShape();
		vertex( 0 - o, 0 - o );
		vertex( width + o, 0 - o );
		vertex( width + o, height + o );
		vertex( 0 - o, height + o );

		beginContour()
		vertex( bx, height - by );
		vertex( width - bx, height - by );
		vertex( width - bx, by );
		vertex( bx, by );
		endContour();

		endShape(CLOSE);
	}
}