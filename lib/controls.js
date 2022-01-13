
class Control {
	constructor( name, min, max, start, step ) {
		let slider = createSlider( min, max, start, step );

		let sliderGroup = createDiv().parent( '#controls' );
		let sliderLabel = createSpan(name).parent( sliderGroup ).class('slider-label');
		slider.parent( sliderGroup );	
		let sliderDisplay = createSpan( start ).parent( sliderGroup ).class('slider-display');

		slider.input( this.onInput.bind(this) );
	 	slider.changed( this.onInput.bind(this) );

		this.name = name;
		this.slider = slider;
		this.display = sliderDisplay;

	}

	updateDisplay() {
		let v = this.slider.value();
		v = v.toFixed(2);
		this.display.html( v );
	}

	getValue() {
		return this.slider.value();
	}

	onInput( e ) {
		this.updateDisplay();
		redraw();
	}
}

class ControlsGroup {
	constructor( name ) {
		this.name = name;
		this.controls = {};
	}

	addControl( name, min, max, start, step ) {
		const control = new Control( name, min, max, start, step );
		this.controls[name] =  control;
		return control;
	}

	getValue( name ) {
		return this.controls[name].getValue();
	}
}


class Controls {
	constructor(  ) {
		this.groups = {}
	}

	addGroup( groupName ) {
		const controlsGroup = new ControlsGroup( groupName );
		this.groups[ groupName ] = controlsGroup;
		return controlsGroup;
	}

}

const instance = new Controls();

export default instance;
