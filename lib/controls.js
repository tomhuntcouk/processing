class Controls {
	constructor(  ) {
		this.controls = {}
	}

	addSlider( name, min, max, start, step ) {
		let slider = createSlider( min, max, start, step );

		let sliderGroup = createDiv().parent( '#controls' );
		let sliderLabel = createSpan(name).parent( sliderGroup ).class('slider-label');
		slider.parent( sliderGroup );	
		let sliderDisplay = createSpan( start ).parent( sliderGroup ).class('slider-display');

	 	let sliderControl = {
	 		'slider' : slider,
	 		'group' : sliderGroup,
	 		'label' : sliderLabel,	 		
	 		'display' : sliderDisplay
	 	}

	 	this.controls[name] = sliderControl;

	 	slider.input( this.onInput.bind(this) );
	 	slider.changed( this.onInput.bind(this) );

	}

	onInput( e ) {
		redraw();
	}

	updateDisplay() {
		for( const control in this.controls ) {
			let v = this.controls[control].slider.value();
			v = v.toFixed(2);
			this.controls[control].display.html( v );
		}
	}

	getValue( name ) {
		return this.controls[name].slider.value();
	}

	setValue( name, newValue ) {
		this.controls[name].slider.value( newValue );
	}

}


class Snapshots {
	constructor( controls ) {
		this.snapshotKeyPrefix = 'SNAPSHOT_';
		this.latestKey = 'LATEST';

		this.controls = controls;		
		this.button = createButton('Add Snapshot').parent('#snapshots');
		this.button.mousePressed( this.addSnapshot.bind(this) );
		this.snapshotsDiv = createDiv().parent('#snapshots');

		this.refreshSnapshots();
	}

	addSnapshot() {
		let snapshot = {};
		for( let control in this.controls.controls ) {
			snapshot[control] = this.controls.getValue(control);
		} 
		let timestamp = this.snapshotKeyPrefix + Date.now().toString();
		localStorage.setItem( timestamp, JSON.stringify(snapshot) );
		this.refreshSnapshots();
	}


	refreshSnapshots() {
		this.snapshotsDiv.html("");
		let keys = Object.keys(localStorage);
		for( const key of keys ) {
			if( key.startsWith( this.snapshotKeyPrefix ) ) {
				let container = createDiv().class('snapshot-container').parent(this.snapshotsDiv);

				let buttonLoad = createButton(key).parent(container).class('snapshots-button-load');
				buttonLoad.mousePressed( this.loadSnapshot.bind(this, key) );
				let buttonDel = createButton('X').parent(container).class('snapshots-button-del');
				buttonDel.mousePressed( this.removeSnapshot.bind(this, key) );
			}	
		}
	}

	loadSnapshot( key ) {
		if( !key.startsWith( this.snapshotKeyPrefix ) ) {
			key = this.snapshotKeyPrefix + key;
		}
		let snapshot = localStorage.getItem( key );
		if( snapshot != undefined ) {
			snapshot = JSON.parse(snapshot);
			for( const name in snapshot ) {
				this.controls.setValue( name, snapshot[name] );
			}
		}
		redraw();
	}

	removeSnapshot( key ) {
		if( !key.startsWith( this.snapshotKeyPrefix ) ) {
			key = this.snapshotKeyPrefix + key;
		}
		localStorage.removeItem(key);
		this.refreshSnapshots();
	}

	storeLatest() {
		let snapshot = {};
		for( let control in this.controls.controls ) {
			snapshot[control] = this.controls.getValue(control);
		} 
		localStorage.setItem( this.latestKey, JSON.stringify(snapshot) );
	}

	getLatest() {
		let snapshot = localStorage.getItem( this.latestKey );
		if( snapshot != undefined ) {
			snapshot = JSON.parse(snapshot);
			for( const name in snapshot ) {
				this.controls.setValue( name, snapshot[name] );
			}
		}
	}

}