
var canvas;
var gl;

var points = [];

var theta = 0.0;
var thetaLoc;
var pi = 0.0;
var piLoc;

var NumTimesToSubdivide = 0;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
        
    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three points.
    
/*     var vertices = [
        vec2( -.5, -.5 ),
        vec2(  0,  .5 ),
        vec2(  .5, -.5 )
    ]; */
	
/* 	var vertices = [
	    vec2( -0.86, -0.5 ),
        vec2(  0,  1 ),
        vec2(  0.86, -0.5 )
	]

    divideTriangle( vertices[0], vertices[1], vertices[2],
                    NumTimesToSubdivide); */

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU
    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	
	thetaLoc = gl.getUniformLocation( program, "theta" );
	theta = document.getElementById( "thetaId" ).value;
	piLoc = gl.getUniformLocation( program, "PI" );

	document.getElementById("thetaId").onchange = function() {
		theta = event.srcElement.value;
		render();
	};
	
	document.getElementById("subId").onchange = function() {
		NumTimesToSubdivide = event.srcElement.value;
		render();
	};
	render();
};

function triangle( a, b, c )
{
    points.push( a, b, c );
}

function divideTriangle( a, b, c, count )
{

    // check for end of recursion
    
    if ( count === 0 ) {
        triangle( a, b, c );
    }
    else {
    
        //bisect the sides
        
        var ab = mix( a, b, 0.5 );
        var ac = mix( a, c, 0.5 );
        var bc = mix( b, c, 0.5 );

        --count;

        // four new triangles
        
        divideTriangle( a, ab, ac, count );
        divideTriangle( c, ac, bc, count );
        divideTriangle( b, bc, ab, count );
		divideTriangle( ac, bc, ab, count );
    }
}

function render()
{
    	
	var vertices = [
	    vec2( -0.86, -0.5 ),
        vec2(  0,  1 ),
        vec2(  0.86, -0.5 )
	]
	points = [];
    divideTriangle( vertices[0], vertices[1], vertices[2],
                    NumTimesToSubdivide);
	gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );				
	gl.clear( gl.COLOR_BUFFER_BIT );
	pi = Math.PI;
	gl.uniform1f( piLoc, pi );
	gl.uniform1f( thetaLoc, theta );	
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
	points = [];
}