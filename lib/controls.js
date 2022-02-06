
class Control {
	constructor( name, min, max, start, step, parent='#controls' ) {
		let sliderGroup = createDiv().parent( parent );
		let sliderLabel = createSpan(name).parent( sliderGroup ).class('slider-label');

		let slider = createSlider( min, max, start, step ).parent( sliderGroup );
		let textfield = createInput( start ).parent( sliderGroup ).class('slider-display');

		slider.input( this.onSliderInput.bind(this) );
	 	slider.changed( this.onSliderInput.bind(this) );

	 	textfield.input( this.onTextfieldInput.bind(this) );

		this.name = name;
		this.slider = slider;
		this.textfield = textfield;

	}

	updateDisplay() {
		// let v = this.slider.value();
		// v = v.toFixed(2);
		// this.display.html( v );
	}

	getValue() {
		return this.slider.value();
	}

	setValue( value ) {
		this.slider.value(value);
		this.textfield.value( value );		
	}

	onSliderInput( e ) {
		let v = this.slider.value();
		this.textfield.value( v );
		redraw();
	}

	onTextfieldInput( e ) {
		let v = this.textfield.value();
		this.slider.value(v);
		redraw();
	}
}

class ControlsGroup {
	constructor( name ) {
		this.name = name;
		this.controls = {};

		this.controlsGroup = createDiv().parent( '#controls' ).class('controls-group');
		this.title = createDiv(this.name).parent(this.controlsGroup).class('controls-group-title');
	}

	addControl( name, min, max, start, step ) {
		const control = new Control( name, min, max, start, step, this.controlsGroup );
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
