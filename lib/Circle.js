class Circle {
	constructor( controls ) {
		this.controls = controls;
		this.radius = 0;
		this.position = {x:0, y:0};
		this.strokeWeight = 0;

		controls.addSlider('radius', 		0, 2, 0.25, 0.01 );
		controls.addSlider('circleX', 		0, 1, 0.5, 0.01 );
		controls.addSlider('circleY', 		0, 1, 0.5, 0.01 );
		controls.addSlider('circleStrk', 	0, 10, 0, 1 );
	}

	init() {
		this.radius = controls.getValue('radius');
		this.position = {
			x : controls.getValue('circleX'),
			y : controls.getValue('circleY')
		};
		this.strokeWeight = controls.getValue('circleStrk');
	}

	render() {
		strokeWeight( this.strokeWeight );
		circle( this.position.x * width, this.position.y * height, this.radius * width * 2 );
	}
}