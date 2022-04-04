// const MatrixModule = window.glMatrix;


// const Matrix = MatrixModule.mat4;
// const Vector = MatrixModule.vec4;

// export { Matrix, Vector };
const glMatrix = window.glMatrix;

// console.log( glMatrix );
// console.log( new glMatrix.vec3() );

class Matrix4 extends Array {
	constructor() {
		super( ...glMatrix.mat4.create() );
	}

	translate( vector3 ) {
		let out = new Matrix4();
		glMatrix.mat4.translate( out, this, vector3 );
		return out;
		// return this;
	}

	rotate( degrees, axis ) {
		let out = new Matrix4();
		glMatrix.mat4.rotate( out, this, radians(degrees), axis );
		return out;
		// return this;
	}

	scale( vector3 ) {
		let out = new Matrix4();
		glMatrix.mat4.scale( out, this, vector3 );
		return out;
		// return this;
	}

	applyToPoint( vector3 ) {
		let out = new Vector3();
		glMatrix.vec3.transformMat4( out, vector3, this );	
		return out;
	}
}

class Vector extends Array {
	constructor( x=0, y=0, z=0 ) {
		super( x, y, z );
	}

	set x( value ) {
		this[0] = value;
	}

	get x() {
		return this[0];
	}

	set y( value ) {
		this[1] = value;
	}

	get y() {
		return this[1];
	}

	set z( value ) {
		this[2] = value;
	}

	get z() {
		return this[2];
	}

	copyFrom( vector ) {
		for( let i in vector ){
			this[i] = vector[i];
		}
		return this;
	}

	static lerp( start, end, t, lerpFunc  ) {
		let out = new Vector3();
		out = lerpFunc( out, start, end, t );
		return out;
	}

	lerp( end, t, lerpFunc  ) {
		lerpFunc( this, this, end, t );
	}

}

class Vector3 extends Vector {
	static lerp( start, end, t ) {
		return super.lerp( start, end, t, glMatrix.vec3.lerp );
	}

	static add( vec1, vec2 ) {
		let out = new Vector3();
		return glMatrix.vec3.add( out, vec1, vec2 );
	}

	static subtract( vec1, vec2 ) {
		let out = new Vector3();
		return glMatrix.vec3.subtract( out, vec1, vec2 );
	}

	static distance( vec1, vec2 ) {
		// let out = new Vector3();
		return glMatrix.vec3.distance( vec1, vec2 );
	}

	static dot( vec1, vec2 ) {
		// let out = new Vector3();
		return glMatrix.vec3.dot( vec1, vec2 );
	}

	get magnitude() {
		return glMatrix.vec3.length( this );
	}

	clone() {
		let out = new Vector3();
		out.copyFrom( this );
		return out;
	}

	lerp( end, t ) {
		return super.lerp( end, t, glMatrix.vec3.lerp );
	}

	add( vector3 ) {
		return glMatrix.vec3.add( this, this, vector3 );
	}

	normalize() {
		return glMatrix.vec3.normalize( this, this );
	}

	scale( scalar ) {
		return glMatrix.vec3.scale( this, this, scalar );	
	}

	rotate( degrees, center=[0,0,0] ) {
		return glMatrix.vec3.rotateZ( this, this, center, radians(degrees) );
	}
}

class Vector4 extends Vector {
	constructor( x=0, y=0, z=0, w=0 ) {
		super( x, y, z, w );
	}

	set w( value ) {
		this[3] = value;
	}

	get w() {
		return this[3];
	}

	static fromVector3( vector3, w=0 ) {
		return new Vector4( vector3.x, vector3.y, vector3.z, w );
	}

	static lerp( start, end, t ) {
		return super.lerp( start, end, t, glMatrix.vec4.lerp );
	}

	lerp( end, t  ) {
		return super.lerp( end, t, glMatrix.vec4.lerp );
	}
}








export { Matrix4, Vector3, Vector4 };