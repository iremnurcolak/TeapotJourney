//@author Iremnur Ugur

// This function takes the projection matrix, the translation, and two rotation angles (in radians) as input arguments.
// The two rotations are applied around x and y axes.
// It returns the combined 4x4 transformation matrix as an array in column-major order.
// The given projection matrix is also a 4x4 matrix stored as an array in column-major order.
// You can use the MatrixMult function defined in project4.html to multiply two 4x4 matrices in the same format.
function GetModelViewProjection( projectionMatrix, translationX, translationY, translationZ, rotationX, rotationY )
{
	// [TO-DO] Modify the code below to form the transformation matrix.
	var rotateX = [
		1, 0, 0, 0,
		0, Math.cos(rotationX), Math.sin(rotationX),0,
		0, -Math.sin(rotationX), Math.cos(rotationX), 0,
		0, 0, 0, 1
	];
	var rotateY = [
		Math.cos(rotationY), 0, -Math.sin(rotationY), 0,
		0, 1, 0, 0,
		Math.sin(rotationY), 0, Math.cos(rotationY), 0,
		0, 0, 0, 1
	];
	var rotate = MatrixMult( rotateX, rotateY );
	
	var trans = [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		translationX, translationY, translationZ, 1
	];

	var mvp = MatrixMult( projectionMatrix, MatrixMult(trans ,rotate) );
	return mvp;
}

class MeshDrawer
{
	// The constructor is a good place for taking care of the necessary initializations.
	constructor()
	{
		this.prog = InitShaderProgram( meshVS, meshFS );
		
		// Get the ids of the uniform variables in the shaders
		this.mvp = gl.getUniformLocation( this.prog, 'mvp' );
		this.useTex = gl.getUniformLocation( this.prog, 'useTexture' );
		this.swap = gl.getUniformLocation( this.prog, 'swap' );
		
		gl.useProgram( this.prog );
		gl.uniform1i(this.swap, false);
		gl.uniform1i(this.useTex, true);

		
		// Get the ids of the vertex attributes in the shaders
		this.vertPos = gl.getAttribLocation( this.prog, 'pos' );
		this.texCoord = gl.getAttribLocation( this.prog, 'txc' );
		
		// Create the buffer objects
		
		this.vertbuffer = gl.createBuffer();
		this.texbuffer = gl.createBuffer();
	
	}
	
	// This method is called every time the user opens an OBJ file.
	// The arguments of this function is an array of 3D vertex positions
	// and an array of 2D texture coordinates.
	// Every item in these arrays is a floating point value, representing one
	// coordinate of the vertex position or texture coordinate.
	// Every three consecutive elements in the vertPos array forms one vertex
	// position and every three consecutive vertex positions form a triangle.
	// Similarly, every two consecutive elements in the texCoords array
	// form the texture coordinate of a vertex.
	// Note that this method can be called multiple times.
	setMesh( vertPos, texCoords )
	{
		this.numTriangles = vertPos.length / 3;

		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertbuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertPos), gl.STATIC_DRAW);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.texbuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
	}
	
	// This method is called when the user changes the state of the
	// "Swap Y-Z Axes" checkbox. 
	// The argument is a boolean that indicates if the checkbox is checked.
	swapYZ( swap )
	{
		gl.useProgram( this.prog );
		if(swap)
		{
			gl.uniform1i(this.swap, true);
		}
		else 
		{
			gl.uniform1i(this.swap, false);
		}
	
	}
	
	// This method is called to draw the triangular mesh.
	// The argument is the transformation matrix, the same matrix returned
	// by the GetModelViewProjection function above.
	draw( trans )
	{
		gl.useProgram( this.prog );
		gl.uniformMatrix4fv( this.mvp, false, trans );

		gl.bindBuffer( gl.ARRAY_BUFFER, this.vertbuffer );
		gl.vertexAttribPointer( this.vertPos, 3, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( this.vertPos );
		
		gl.bindBuffer( gl.ARRAY_BUFFER, this.texbuffer );
		gl.vertexAttribPointer( this.texCoord, 2, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( this.texCoord );
	
		gl.drawArrays( gl.TRIANGLES, 0, this.numTriangles );
	}
	
	// This method is called to set the texture of the mesh.
	// The argument is an HTML IMG element containing the texture data.
	setTexture(img)
	{
		gl.useProgram(this.prog);

		// Texture unit == 1
		gl.activeTexture(gl.TEXTURE0);

		const myTex = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, myTex);

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);


		gl.texImage2D(
			gl.TEXTURE_2D, 0, gl.RGB,
			gl.RGB, gl.UNSIGNED_BYTE,
			img
		);

		const sampler = gl.getUniformLocation(this.prog, "tex");
		gl.uniform1i(sampler, 0);
	}
	
	// This method is called when the user changes the state of the
	// "Show Texture" checkbox. 
	// The argument is a boolean that indicates if the checkbox is checked.
	showTexture( show )
	{
		gl.useProgram( this.prog );
		if(show)
		{
			gl.uniform1i(this.useTex, true);
		}
		else 
		{
			gl.uniform1i(this.useTex, false);
		}
	}
}

// Vertex shader source code
var meshVS = `
	attribute vec3 pos;
	attribute vec2 txc;
	uniform mat4 mvp;
	uniform bool swap;
	varying vec2 texCoord;
	
	void main()
	{
		if(swap)
		{
			gl_Position = mvp * vec4(pos.x, pos.z, pos.y, 1);
		}
		else 
		{
			gl_Position = mvp * vec4(pos, 1);
		}
		texCoord = txc;
	}
`;
// Fragment shader source code
var meshFS = `
	precision mediump float;
	uniform sampler2D tex;
	uniform bool useTexture;
	varying vec2 texCoord;
	void main()
	{
		if(useTexture)
		{
			gl_FragColor = texture2D(tex, texCoord);
		}
		else
		{
			gl_FragColor = vec4(1,gl_FragCoord.z*gl_FragCoord.z,0,1);
		}
	}
`;