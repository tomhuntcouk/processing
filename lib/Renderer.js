


class Renderer {
	constructor() {

	}


	init() {

		this.imageButton = createButton('Save Image').parent('#renderer').class('renderer-btn');
		this.imageButton.mousePressed( this.saveImage.bind(this) );


		this.videoButton = createButton('Save Video').parent('#renderer').class('renderer-btn');
		


		// this.button.mousePressed( this.addSnapshot.bind(this) );
		// this.snapshotsDiv = createDiv().parent('#snapshots');

	}

	saveImage() {
		saveCanvas( 'myCanvas', 'png' );
	}


}

const instance = new Renderer();
export default instance;