
class Control {
	constructor( type, name, min, max, start, step, parent='#controls' ) {
		let controlGroup = createDiv().parent( parent ).class('control-container');
		let controlLabel = createSpan(name).parent( controlGroup ).class('control-label');

		let control, textfield;
		switch(type) {
			case 'slider' :
				control = createSlider( min, max, start, step ).parent( controlGroup ).class('control-control');		
				textfield = createInput( start ).parent( controlGroup ).class('control-display');
				break;
			case 'checkbox' :
				control = createCheckbox(start).parent(controlGroup).class('control-control');
				control.value = control.checked;
				textfield = createInput( start ).parent( controlGroup ).class('control-display');
				break;
			case 'input' :
				control = createInput(start).parent(controlGroup).class('control-control');
				break;
		}
		control.input( this.onControlInput.bind(this) );
		
		if( textfield ) {
			textfield.input( this.onTextfieldInput.bind(this) );	
		}
		

		this.name = name;
		this.control = control;
		this.textfield = textfield;

	}

	getValue() {
		if( this.control.value ) {
			return this.control.value();	
		}
	}

	setValue( value ) {
		if( this.control.value ) {			
			this.control.value( value );	
		}
		if( this.textfield ) {
			this.textfield.value( value );	
		}		
	}

	onControlInput( e ) {
		let v = this.getValue();
		this.textfield.value( v );
		redraw();
	}

	onTextfieldInput( e ) {
		let v = this.textfield.value();
		this.setValue(v);
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

	addSlider( name, min, max, start, step ) {
		const control = new Control( 'slider', name, min, max, start, step, this.controlsGroup );
		this.controls[name] =  control;
		return control;
	}

	addCheckbox( name, start ) {
		const control = new Control( 'checkbox', name, null, null, start, null, this.controlsGroup );
		this.controls[name] =  control;
		return control;	
	}

	addInput( name, start ) {
		const control = new Control( 'input', name, null, null, start, null, this.controlsGroup );
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
