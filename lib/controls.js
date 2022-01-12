
class Control {
	constructor( name, min, max, start, step ) {
		let slider = createSlider( min, max, start, step );

		let sliderGroup = createDiv().parent( '#controls' );
		let sliderLabel = createSpan(name).parent( sliderGroup ).class('slider-label');
		slider.parent( sliderGroup );	
		let sliderDisplay = createSpan( start ).parent( sliderGroup ).class('slider-display');

		slider.input( Control.onInput.bind(this) );
	 	slider.changed( Control.onInput.bind(this) );

		this.name = name;
		this.slider = slider;




	 	// let sliderControl = {
	 	// 	'slider' : slider,
	 	// 	'group' : sliderGroup,
	 	// 	'label' : sliderLabel,	 		
	 	// 	'display' : sliderDisplay
	 	// }

	 	// this.controls[name] = sliderControl;

	 	
	}

	getValue() {
		return this.slider.value();
	}

	static onInput( e ) {
		redraw();
	}
}

class ControlsGroup {
	constructor( name ) {
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
		this.controls = {}
	}

	addGroup( groupName ) {
		const controlsGroup = new ControlsGroup( groupName );
		this.controls[ groupName ] = controlsGroup;
		return controlsGroup;
	}


	// updateDisplay() {
	// 	for( const control in this.controls ) {
	// 		let v = this.controls[control].slider.value();
	// 		v = v.toFixed(2);
	// 		this.controls[control].display.html( v );
	// 	}
	// }

	// getValue( name ) {
	// 	return this.controls[name].slider.value();
	// }

	// setValue( name, newValue ) {
	// 	this.controls[name].slider.value( newValue );
	// }

}

const instance = new Controls();

export default instance;
