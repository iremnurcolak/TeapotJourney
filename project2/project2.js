//@author: Iremnur Ugur
// Returns a 3x3 transformation matrix as an array of 9 values in column-major order.
// The transformation first applies scale, then rotation, and finally translation.
// The given rotation value is in degrees.
function GetTransform( positionX, positionY, rotation, scale )
{
	//convert rotation degree to rads
	const rad = rotation * Math.PI / 180;
	
	const c = Math.cos(rad);
	const s = Math.sin(rad);

	//prepare scale matrix
	const scaleM = [
		scale, 0,     0,
		0,     scale, 0,
		0,     0,     1
	];
	
	//prepare rotation matrix
	const rotateM = [
		c,  s,  0,
		-s, c,  0,
		0,  0,  1
	];
	
	//prepare translation matrix 
	const translateM = [
		1, 0, 0,
		0, 1, 0,
		positionX,positionY, 1
	];
		
	//apply transform in order scale → rotate → translate
	return ApplyTransform( ApplyTransform(scaleM, rotateM), translateM );
}

// Returns a 3x3 transformation matrix as an array of 9 values in column-major order.
// The arguments are transformation matrices in the same format.
// The returned transformation first applies trans1 and then trans2.
function ApplyTransform( trans1, trans2 )
{
	const result = new Array(9);

	result[0] = trans2[0]*trans1[0] + trans2[3]*trans1[1] + trans2[6]*trans1[2];
	result[1] = trans2[1]*trans1[0] + trans2[4]*trans1[1] + trans2[7]*trans1[2];
	result[2] = trans2[2]*trans1[0] + trans2[5]*trans1[1] + trans2[8]*trans1[2];

	result[3] = trans2[0]*trans1[3] + trans2[3]*trans1[4] + trans2[6]*trans1[5];
	result[4] = trans2[1]*trans1[3] + trans2[4]*trans1[4] + trans2[7]*trans1[5];
	result[5] = trans2[2]*trans1[3] + trans2[5]*trans1[4] + trans2[8]*trans1[5];

	result[6] = trans2[0]*trans1[6] + trans2[3]*trans1[7] + trans2[6]*trans1[8];
	result[7] = trans2[1]*trans1[6] + trans2[4]*trans1[7] + trans2[7]*trans1[8];
	result[8] = trans2[2]*trans1[6] + trans2[5]*trans1[7] + trans2[8]*trans1[8];

	return result;
}
