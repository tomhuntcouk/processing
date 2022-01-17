
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

	setValue( value ) {
		this.slider.value(value);
		this.updateDisplay();
		redraw();
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

	getValue( controlName ) {
		if( this.controls[controlName] != undefined ) {
			return this.controls[controlName].getValue();
		}
	}

	setValue( controlName, value ) {
		if( this.controls[controlName] != undefined ) {
			this.controls[controlName].setValue( value );	
		}		
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

	getValue( groupName, controlName ) {
		this.groups[groupName].getValue( controlName );
	}

	setValue( groupName, controlName, value ) {
		if( this.groups[groupName] != undefined ) {
			this.groups[groupName].setValue( controlName, value );	
		}		
	}

}

const instance = new Controls();

export default instance;
