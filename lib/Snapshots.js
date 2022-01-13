import Controls from './Controls.js';

class Snapshot {
	constructor( ) {
		this
	}
}


class Snapshots {
	constructor() {
		this.snapshotKeyPrefix = 'SNAPSHOT_';
		this.latestKey = 'LATEST';

		this.controls = Controls;

		this.name = "DEFAULT";
		this.snapshots = [];
		this.buttons = [];
	}

	init( name ) {
		this.name = name;

		this.button = createButton('Add Snapshot').parent('#snapshots').class('add-snapshot-btn');
		this.button.mousePressed( this.addSnapshot.bind(this) );
		this.snapshotsDiv = createDiv().parent('#snapshots');

		this.loadSnapshots();
		this.refreshSnapshots();
	}

	save() {
		console.log('saving;');
		localStorage.setItem(
			this.name,
			JSON.stringify( this.snapshots )
		);
	}

	addSnapshot() {
		let snapshot = {};
		for( let groupName in Controls.groups ) {
			const group = Controls.groups[groupName];
			let groupSnapshot = {}			
			for( let controlName in group.controls ) {
				const control = group.controls[controlName];
				groupSnapshot[ control.name ] = control.getValue();
			}
			snapshot[ group.name ] = groupSnapshot;
		}

		this.snapshots.push( snapshot );

		this.save();
		// let snapshot = {};
		// for( let control in this.controls.controls ) {
		// 	snapshot[control] = this.controls.getValue(control);
		// } 
		// let timestamp = this.snapshotKeyPrefix + Date.now().toString();
		// localStorage.setItem( timestamp, JSON.stringify(snapshot) );
		// this.refreshSnapshots();
	}


	loadSnapshots() {
		const snapshots = localStorage.getItem( this.name );
		if( snapshots != null ) {
			this.snapshots = JSON.parse(snapshots);			
		} else {
			this.snapshots = [];
		}
	}


	refreshSnapshots() {
		this.snapshotsDiv.html("");
		for( let i in this.snapshots ) {
			const snapshot = this.snapshots[i];
			let container = createDiv().class('snapshot-container').parent(this.snapshotsDiv);

			let buttonLoad = createButton(i).parent(container).class('snapshots-button-load');
			let buttonDel = createButton('X').parent(container).class('snapshots-button-del');

			buttonLoad.mousePressed( this.onSnapshotButtonPress.bind( this, buttonLoad, buttonDel, i ) );
			// buttonDel.mousePressed( this.removeSnapshot.bind(this, key) );
		}
	}

	onSnapshotButtonPress( buttonLoad, buttonDel,index ) {
		// console.log(index);
		selectAll( '.snapshots-button-load' ).hide();
		selectAll( '.snapshots-button-del' ).hide();

		buttonLoad.hide();
		buttonDel.show();
	}

	// loadSnapshot( key ) {
	// 	if( !key.startsWith( this.snapshotKeyPrefix ) ) {
	// 		key = this.snapshotKeyPrefix + key;
	// 	}
	// 	let snapshot = localStorage.getItem( key );
	// 	if( snapshot != undefined ) {
	// 		snapshot = JSON.parse(snapshot);
	// 		for( const name in snapshot ) {
	// 			this.controls.setValue( name, snapshot[name] );
	// 		}
	// 	}
	// 	redraw();
	// }

	// removeSnapshot( key ) {
	// 	if( !key.startsWith( this.snapshotKeyPrefix ) ) {
	// 		key = this.snapshotKeyPrefix + key;
	// 	}
	// 	localStorage.removeItem(key);
	// 	this.refreshSnapshots();
	// }

	// storeLatest() {
	// 	let snapshot = {};
	// 	for( let control in this.controls.controls ) {
	// 		snapshot[control] = this.controls.getValue(control);
	// 	} 
	// 	localStorage.setItem( this.latestKey, JSON.stringify(snapshot) );
	// }

	// getLatest() {
	// 	let snapshot = localStorage.getItem( this.latestKey );
	// 	if( snapshot != undefined ) {
	// 		snapshot = JSON.parse(snapshot);
	// 		for( const name in snapshot ) {
	// 			this.controls.setValue( name, snapshot[name] );
	// 		}
	// 	}
	// }
}

const instance = new Snapshots();
export default instance;
