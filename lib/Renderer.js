import Canvas from './Canvas.js';
const HME = window.HME;


class Renderer {
	constructor() {

		this.encoder = undefined;
		this.isRecording = false;
		this.drawingContext = undefined;

		HME.createH264MP4Encoder().then( function x(enc) {
            console.log( 'RECORDER STARTING' );
            this.encoder = enc;
            // this.encoder.outputFilename = 'test';
            // this.encoder.width = width;
            // this.encoder.height = height;
            // this.encoder.frameRate = framerate;
            this.encoder.kbps = 50000; // video quality
            this.encoder.groupOfPictures = 10; // lower if you have fast actions.
            // this.encoder.initialize();

            console.log( 'RECORDER READY' );
        }.bind(this) );

	}


	init( context ) {

		this.drawingContext = context;

		this.imageButton = createButton('Save Image').parent('#renderer').class('renderer-btn');
		this.imageButton.mousePressed( this.saveImage.bind(this) );


		this.videoStartButton = createButton('Start Video').parent('#renderer').class('renderer-btn');
		this.videoStopButton = createButton('Stop Video').parent('#renderer').class('renderer-btn');
		// this.videoSaveButton = createButton('Save Video').parent('#renderer').class('renderer-btn');
		


		this.videoStartButton.mousePressed( this.startRecordVideo.bind( this, Canvas.scaledWidth, Canvas.scaledHeight, 30 ) );
		this.videoStopButton.mousePressed( this.stopRecordVideo.bind( this ) );
		// this.snapshotsDiv = createDiv().parent('#snapshots');

	}

	saveImage() {
		saveCanvas( Canvas.name + '_' + Date.now(), 'png' );
	}

	startRecordVideo( width, height, framerate ) {
		console.log(this, this.encoder, width, height, framerate);
		this.encoder.width = width;
		this.encoder.height = height;
		this.encoder.frameRate = framerate;
		this.encoder.initialize();

		console.log( 'STARTING RECORDING' );
		this.isRecording = true;		
	}

	stopRecordVideo(  ) {
		console.log( 'STOPPING RECORDING' );
		this.isRecording = false;

		this.encoder.finalize();

        const uint8Array = this.encoder.FS.readFile( this.encoder.outputFilename );
        const anchor = document.createElement('a');
        anchor.href = URL.createObjectURL(new Blob([uint8Array], { type: 'video/mp4' }));
        anchor.download = this.encoder.outputFilename;
        anchor.click();
        
        this.encoder.delete();
	}

	recordFrame( ) {
		if( this.isRecording ) {
			this.encoder.addFrameRgba(
				this.drawingContext.getImageData(
					0, 0, Canvas.scaledWidth, Canvas.scaledHeight
				).data
			);
		}
	}


}

const instance = new Renderer();
export default instance;
// export default Renderer;