// const MatrixModule = window.glMatrix;


// const Matrix = MatrixModule.mat4;
// const Vector = MatrixModule.vec4;

// export { Matrix, Vector };
const glMatrix = window.glMatrix;

class Matrix4 {
	constructor() {
		this.value = glMatrix.mat4.create();
	}

	set raw( array ) {
		this.value = array;
	}

	get raw() {
		return this.value;
	}

	translate( vector3 ) {
		glMatrix.mat4.translate( this.raw, this.raw, vector3.raw );
		return this;
	}
}

class Vector3 {
	constructor( x=0, y=0, z=0 ) {
		this.value = glMatrix.vec3.fromValues( x, y, z );
	}

	set raw( array ) {
		this.value = array;
	}

	get raw() {
		return this.value;
	}

	set x( value ) {
		this.value[0] = value;
	}

	get x() {
		return this.value[0];
	}

	set y( value ) {
		this.value[1] = value;
	}

	get y() {
		return this.value[1];
	}

	set z( value ) {
		this.value[2] = value;
	}

	get z() {
		return this.value[2];
	}

	static lerp( start, end, t  ) {
		let out = new Vector3();
		out.raw = glMatrix.vec3.lerp( out.raw, start.raw, end.raw, t );
		return out;
	}

}

class Vector4 {
	constructor( x=0, y=0, z=0, w=0 ) {
		return glMatrix.mat4.fromValues( x, y, z, w );
	}

	static fromVector3( vector3, w=0 ) {
		return new Vector4( vector3.x, vector3.y, vector3.z, w );
	}
}





export { Matrix4, Vector3, Vector4 };