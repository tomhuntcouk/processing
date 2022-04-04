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
		this.latest = null;
		this.buttons = [];
	}

	init( name ) {
		this.name = name;

		this.button = createButton('Add Snapshot').parent('#snapshots').class('add-snapshot-btn');
		this.button.mousePressed( this.addSnapshot.bind(this) );
		this.snapshotsDiv = createDiv().parent('#snapshots');

		this.load();
		this.refreshSnapshotsUI();
	}

	save() {
		// console.log('saving;');
		localStorage.setItem(
			this.name,
			JSON.stringify( [this.latest, this.snapshots] )
		);
	}

	load() {
		const data = localStorage.getItem( this.name );
		if( data != null ) {
			const parsedData = JSON.parse(data)
			this.latest = parsedData[0];
			this.snapshots = parsedData[1];			
		} else {
			this.snapshots = [];
		}
	}

	addSnapshot( latest ) {
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


		this.save();

		if( latest ) {
			this.latest = snapshot;
		} else {
			this.snapshots.push( snapshot );	
			this.refreshSnapshotsUI();	
		}

	}

	applySnapshot( index ) {
		
		let snapshot;
		if( index === true ) {
			snapshot = this.latest;	
		} else {
			snapshot = this.snapshots[index];
		}		


		if( snapshot != null ) {
			for( let groupName in snapshot ) {
				const group = snapshot[groupName];
				for( let controlName in group ) {
					const v = group[controlName];
					Controls.setValue( groupName, controlName, v );
				}
			}
			redraw();
		} else {
			console.warn( 'Snapshot error' );
		}
	}

	deleteSnapshot( index ) {
		this.snapshots.splice( index, 1 );
	}


	refreshSnapshotsUI() {
		this.snapshotsDiv.html("");
		for( let i in this.snapshots ) {
			const snapshot = this.snapshots[i];
			let container = createDiv().class('snapshot-container').parent(this.snapshotsDiv);

			let buttonLoad = createButton(int(i)+1).parent(container).class('snapshots-button-load');
			let buttonDel = createButton('X').parent(container).class('snapshots-button-del');

			buttonLoad.mousePressed( this.onSnapshotButtonPress.bind( this, buttonLoad, buttonDel, i ) );
			buttonDel.mousePressed( this.onDeleteButtonPress.bind(this, buttonLoad, buttonDel, i) );
		}
	}

	onSnapshotButtonPress( buttonLoad, buttonDel, index ) {
		this.applySnapshot( index );

		selectAll( '.snapshots-button-load' ).forEach( e => e.show() );
		selectAll( '.snapshots-button-del' ).forEach( e => e.hide() );
		buttonLoad.hide();
		buttonDel.show();
	}

	onDeleteButtonPress( buttonLoad, buttonDel,index ) {		
		this.deleteSnapshot( index );

		buttonLoad.remove();
		buttonDel.remove();		
		this.save();
		this.refreshSnapshotsUI();
	}

	saveLatest() {
		this.addSnapshot( true );
	}

	applyLatest() {
		this.applySnapshot( true );
	}

}

const instance = new Snapshots();
export default instance;
