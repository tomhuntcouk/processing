import Time from '../lib/Time.js';


class Control {
	constructor( type, name, min, max, start, step, parent='#controls' ) {
		let controlGroup = createDiv().parent( parent ).class('control-container');
		let controlLabel = createSpan(name).parent( controlGroup ).class('control-label');

		let control, valuefield, playspeedField;
		switch(type) {
			case 'slider' :
				control = createSlider( min, max, start, step ).parent( controlGroup ).class('control-control');		
				valuefield = createInput( start ).parent( controlGroup ).class('control-display');
				playspeedField = createSlider( 0, 3, 0, 1 ).parent( controlGroup ).class('control-playspeed');
				break;
			case 'checkbox' :
				control = createCheckbox(start).parent(controlGroup).class('control-control');
				control.value = control.checked;
				valuefield = createInput( start ).parent( controlGroup ).class('control-display');
				playspeedField = createDiv().parent( controlGroup ).class('control-playspeed');
				break;
			case 'input' :
				control = createInput(start).parent(controlGroup).class('control-control');
				// playspeed = createDiv().parent( controlGroup ).class('control-playspeed');
				break;
		}
		control.input( this.onControlInput.bind(this) );
		
		if( valuefield ) {
			valuefield.input( this.onTextfieldInput.bind(this) );	
		}

		if( playspeedField ) {
			playspeedField.input( this.onPlayspeedInput.bind(this) );		
		}

		this.name = name;
		this.control = control;
		this.valuefield = valuefield;
		this.playspeedField = playspeedField;
		

		this.playspeed = 0;		
		this.value = start;
		this.step = step;
		this.min = min;
		this.max = max;

	}

	tick() {
		if( Time.playing ) {
			this.value += this.step * this.playspeed;	
		}		
	}

	getValue() {
		if( this.playspeed > 0 ) {
			return this.value;	
		} else {
			if( this.control.value ) {
				return this.control.value();	
			}
		}
	}

	setValue( value ) {
		if( this.control.value ) {			
			this.control.value( value );	
		}
		if( this.valuefield ) {
			this.valuefield.value( value );	
		}		
	}

	onControlInput( e ) {
		let v = this.getValue();
		this.valuefield.value( v );
		redraw();
	}

	onTextfieldInput( e ) {
		let v = this.valuefield.value();
		this.setValue(v);
		redraw();
	}

	onPlayspeedInput( e ) {
		this.playspeed = this.playspeedField.value();
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

	tick() {
		for( const groupName in this.groups ) {
			for( const controlName in this.groups[groupName].controls ) {
				this.groups[groupName].controls[controlName].tick();
			}
		}
	}

}

const instance = new Controls();

export default instance;
