// @author Iremnur Ugur

class CurveDrawer {
	constructor()
	{
		this.prog   = InitShaderProgram( curvesVS, curvesFS );
		
		this.mvp = gl.getUniformLocation( this.prog, 'mvp' );
		this.controlPoint0 = gl.getUniformLocation( this.prog, 'p0' );
		this.controlPoint1 = gl.getUniformLocation( this.prog, 'p1' );
		this.controlPoint2 = gl.getUniformLocation( this.prog, 'p2' );
		this.controlPoint3 = gl.getUniformLocation( this.prog, 'p3' );
		
		this.t = gl.getAttribLocation( this.prog, 't' );
		
		// Initialize the attribute buffer
		this.steps = 500;
		var tv = [];
		for ( let i=0; i<this.steps; ++i ) {
			tv.push( i / (this.steps-1) );
		}
		
		this.buffer = gl.createBuffer();
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tv), gl.STATIC_DRAW);
	}
	setViewport( width, height )
	{
		const trans = [ 2/width,0,0,0,  0,-2/height,0,0, 0,0,1,0, -1,1,0,1 ];
		gl.useProgram( this.prog );
		gl.uniformMatrix4fv( this.mvp, false, trans );
	}
	updatePoints( pt )
	{
		gl.useProgram( this.prog );
		gl.uniform2f(this.controlPoint0 , pt[0].getAttribute("cx"), pt[0].getAttribute("cy"));
		gl.uniform2f(this.controlPoint1 , pt[1].getAttribute("cx"), pt[1].getAttribute("cy"));
		gl.uniform2f(this.controlPoint2 , pt[2].getAttribute("cx"), pt[2].getAttribute("cy"));
		gl.uniform2f(this.controlPoint3 , pt[3].getAttribute("cx"), pt[3].getAttribute("cy"));
		
	}
	draw()
	{
		// Draw the line segments
		gl.useProgram( this.prog );
		gl.bindBuffer( gl.ARRAY_BUFFER, this.buffer );
		gl.vertexAttribPointer( this.t, 1, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( this.t );
		gl.drawArrays( gl.POINTS, 0, this.steps );
	}
}

// Vertex Shader
var curvesVS = `
	attribute float t;
	uniform mat4 mvp;
	uniform vec2 p0;
	uniform vec2 p1;
	uniform vec2 p2;
	uniform vec2 p3;
	
	vec2 lerp(vec2 a, vec2 b, float t) 
	{
		return a*(1.0-t) + b*t;
	}
	void main()
	{
		
		vec2 cp1 = lerp(p0, p1, t);
		vec2 cp2 = lerp(p1, p2, t);
		vec2 cp3 = lerp(p2, p3, t);
		vec2 cp4 = lerp(cp1, cp2, t);
		vec2 cp5 = lerp(cp2, cp3, t);
		vec2 vertexPos = lerp(cp4, cp5, t);
		
		gl_Position = mvp * vec4(vertexPos,0,1);
		gl_PointSize = 5.0; 
	}
`;

// Fragment Shader
var curvesFS = `
	precision mediump float;
	void main()
	{
		gl_FragColor = vec4(0,1,0,1);
	}
`;