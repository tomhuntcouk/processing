

class Time {
	constructor( rate=30 ) {
		this.rate = rate;
		this.frame = 0;
		this.lastTime = 0;
		this.time = Date.now();
		this.fixedTime = 0;
		this.deltaTime = 0;

		this.playing = false;
	}

	tick() {
		if( this.playing ) {
			this.lastTime = this.time;
			this.time = Date.now();
			this.deltaTime = this.time - this.lastTime;
			this.fixedTime += this.deltaTime / this.frameRate;
		}		
	}

	get frameRate() {
		return 1000 / this.deltaTime;
	}

	play() {
		this.playing = true;
	}

	stop() {
		this.playing = false;
	}

	toggle() {
		this.playing = !this.playing;
	}

}


const instance = new Time();
export default instance;