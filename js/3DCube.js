function GLInit(canvas) {
    var vertexShaderText = [
        'precision mediump float;',
        '',
        'attribute vec3 vertPosition;',
        'attribute vec2 vertTexCoord;',
        'varying vec2 fragTexCoord;',
        'uniform mat4 mWorld;',
        'uniform mat4 mView;',
        'uniform mat4 mProj;',
        '',
        'void main()',
        '{',
        '    fragTexCoord = vertTexCoord;',
        '    gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);',
        '}'
    ].join('\n');
    var fragmentShaderText = [
        'precision mediump float;',
        '',
        'varying vec2 fragTexCoord;',
        'uniform sampler2D sampler;',
        '',
        'void main()',
        '{',
        '    gl_FragColor = texture2D(sampler, fragTexCoord);',
        '}'
    ].join('\n');
    
    var gl = canvas.getContext('webgl');
    
    if (!gl) {
        console.log('webgl not supported, falling back to experimental.');
        gl = canvas.getContext('experimental-webgl');
    }
    
    if (!gl) {
        alert('Your browser does not support webgl.');
    }
    
    gl.clearColor(0.75, 0.85, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_WIDTH_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    
    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fragmentShaderText);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error("ERROR: Can't compile vertex shader.", gl.getShaderInfoLog(vertexShader));
        return;
    }
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error("ERROR: Can't compile fragment shader.", gl.getShaderInfoLog(fragmentShader));
        return;
    }
    
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("ERROR: Can't link program.", gl.getProgramInfoLog(program));
        return;
    }
    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error("ERROR: Can't validate program.", gl.getProgramInfoLog(program));
        return;
    }
    
    var boxVertices = 
    [ // X, Y, Z           U, V
        // Top
        -1.0, 1.0, -1.0,   0.5, 0.5,
        -1.0, 1.0, 1.0,    0.5, 0.75,
        1.0, 1.0, 1.0,      0.75, 0.75,
        1.0, 1.0, -1.0,    0.75, 0.5,
    
        // Left
        -1.0, 1.0, 1.0,    0.5, 0.5,
        -1.0, -1.0, 1.0,   0.5, 0.75,
        -1.0, -1.0, -1.0,  0.25, 0.75,
        -1.0, 1.0, -1.0,   0.25, 0.5,
    
        // Right
        1.0, 1.0, 1.0,    0.75, 0.5,
        1.0, -1.0, 1.0,   0.75, 0.75,
        1.0, -1.0, -1.0,  1, 0.75,
        1.0, 1.0, -1.0,   1, 0.5,
    
        // Front
        1.0, 1.0, 1.0,    0.75, 0.75,
        1.0, -1.0, 1.0,    0.75, 1,
        -1.0, -1.0, 1.0,    0.5, 1,
        -1.0, 1.0, 1.0,    0.5, 0.75,
    
        // Back
        1.0, 1.0, -1.0,    0.5, 0.25,
        1.0, -1.0, -1.0,    0.5, 0.5,
        -1.0, -1.0, -1.0,    0.75, 0.5,
        -1.0, 1.0, -1.0,    0.75, 0.25,
    
        // Bottom
        -1.0, -1.0, -1.0,   0, 0.75,
        -1.0, -1.0, 1.0,    0, 0.5,
        1.0, -1.0, 1.0,     0.25, 0.5,
        1.0, -1.0, -1.0,    0.25, 0.75,
        
    ];
    
    var boxIndices =
    [
        // Top
        0, 1, 2,
        0, 2, 3,
    
        // Left
        5, 4, 6,
        6, 4, 7,
    
        // Right
        8, 9, 10,
        8, 10, 11,
    
        // Front
        13, 12, 14,
        15, 14, 12,
    
        // Back
        16, 17, 18,
        16, 18, 19,
    
        // Bottom
        21, 20, 22,
        22, 20, 23
    ];
    
    var arrowVertices = [
        // X, Y, Z     U, V
        //Top
        -0.5, 2.5, 0.0,     0.75, 0.5625,
        0.5, 2.5, 0.0,      0.75, 0.6875,
        0.5, 3.0, 0.0,      0.635, 0.6875,
        -0.5, 3.0, 0.0,     0.635, 0.5625,
        0.75, 3.0, 0.0,     0.635, 0.71875,
        -0.75, 3.0, 0.0,    0.635, 0.53125,
        0.0, 3.5, 0.0,      0.5, 0.625,
        
        -0.5, 2.5, 0.0,     0.25, 0.8125,
        0.5, 2.5, 0.0,      0.25, 0.9375,
        0.5, 3.0, 0.0,      0.365, 0.9375,
        -0.5, 3.0, 0.0,     0.365, 0.8125,
        0.75, 3.0, 0.0,     0.365, 0.96875,
        -0.75, 3.0, 0.0,    0.365, 0.78125,
        0.0, 3.5, 0.0,      0.5, 0.875,
        
        //Left
        -2.5, 0.0, -0.5,    0.5, 0.5625,
        -2.5, 0.0, 0.5,     0.5, 0.6875,
        -3.0, 0.0, 0.5,     0.385, 0.6875,
        -3.0, 0.0, -0.5,    0.385, 0.5625,
        -3.0, 0.0, 0.75,    0.385, 0.71875,
        -3.0, 0.0, -0.75,   0.385, 0.53125,
        -3.5, 0.0, 0.0,     0.25, 0.625,
        
        -2.5, 0.0, -0.5,    0, 0.3125,
        -2.5, 0.0, 0.5,     0, 0.4375,
        -3.0, 0.0, 0.5,     0.115, 0.4375,
        -3.0, 0.0, -0.5,    0.115, 0.3125,
        -3.0, 0.0, 0.75,    0.115, 0.46875,
        -3.0, 0.0, -0.75,   0.115, 0.28125,
        -3.5, 0.0, 0.0,     0.25, 0.375,
        
        //Right
        2.5, 0.0, -0.5,    1, 0.5625,
        2.5, 0.0, 0.5,     1, 0.6875,
        3.0, 0.0, 0.5,     0.885, 0.6875,
        3.0, 0.0, -0.5,    0.885, 0.5625,
        3.0, 0.0, 0.75,    0.885, 0.71875,
        3.0, 0.0, -0.75,   0.885, 0.53125,
        3.5, 0.0, 0.0,     0.75, 0.625,
        
        2.5, 0.0, -0.5,    0.75, 0.3125,
        2.5, 0.0, 0.5,     0.75, 0.4375,
        3.0, 0.0, 0.5,     0.865, 0.4375,
        3.0, 0.0, -0.5,    0.865, 0.3125,
        3.0, 0.0, 0.75,    0.865, 0.46875,
        3.0, 0.0, -0.75,   0.865, 0.28125,
        3.5, 0.0, 0.0,     1, 0.375,
        
        //Front
        -0.5, 0.0, 2.5,     0.75, 0.8125,
        0.5, 0.0, 2.5,      0.75, 0.9375,
        0.5, 0.0, 3.0,      0.635, 0.9375,
        -0.5, 0.0,3.0,      0.635, 0.8125,
        0.75, 0.0, 3.0,     0.635, 0.96875,
        -0.75, 0.0, 3.0,    0.635, 0.78125,
        0.0, 0.0, 3.5,      0.5, 0.875,
                            
        -0.5, 0.0, 2.5,     0.75, 0.8125,
        0.5, 0.0, 2.5,      0.75, 0.9375,
        0.5, 0.0, 3.0,      0.865, 0.9375,
        -0.5, 0.0,3.0,      0.865, 0.8125,
        0.75, 0.0, 3.0,     0.865, 0.96875,
        -0.75, 0.0, 3.0,    0.865, 0.78125,
        0.0, 0.0, 3.5,      1, 0.875,
        
        //Back
        -0.5, 0.0, -2.5,    0.25, 0.4375,
        0.5, 0.0, -2.5,     0.25, 0.3125,
        0.5, 0.0, -3.0,     0.365, 0.3125,
        -0.5, 0.0,-3.0,     0.365, 0.4375,
        0.75, 0.0, -3.0,    0.365, 0.28125,
        -0.75, 0.0, -3.0,   0.365, 0.46875,
        0.0, 0.0, -3.5,     0.5, 0.375,
        
        -0.5, 0.0, -2.5,    0.75, 0.4375,
        0.5, 0.0, -2.5,     0.75, 0.3125,
        0.5, 0.0, -3.0,     0.635, 0.3125,
        -0.5, 0.0,-3.0,     0.635, 0.4375,
        0.75, 0.0, -3.0,    0.635, 0.28125,
        -0.75, 0.0, -3.0,   0.635, 0.46875,
        0.0, 0.0, -3.5,     0.5, 0.375,
        
        //Bottom
        -0.5, -2.5, 0.0,    0.25, 0.5625,
        0.5, -2.5, 0.0,     0.25, 0.6875,
        0.5, -3.0, 0.0,     0.135, 0.6875,
        -0.5, -3.0, 0.0,    0.135, 0.5625,
        0.75, -3.0, 0.0,    0.135, 0.71875,
        -0.75, -3.0, 0.0,   0.135, 0.53125,
        0.0, -3.5, 0.0,     0.0, 0.625,
        
        -0.5, -2.5, 0.0,    0, 0.8125,
        0.5, -2.5, 0.0,     0, 0.9375,
        0.5, -3.0, 0.0,     0.115, 0.9375,
        -0.5, -3.0, 0.0,    0.115, 0.8125,
        0.75, -3.0, 0.0,    0.115, 0.96875,
        -0.75, -3.0, 0.0,   0.115, 0.78125,
        0.0, -3.5, 0.0,     0.25, 0.875,
        
    ];
    
    var baseArrowIndices = [
    
        2, 1, 0,
        3, 2, 0,
        4, 5, 6,
        7, 8, 9,
        7, 9, 10,
        13, 12, 11
    ];
    
    var arrowIndices = [];
    
    for (let i = 0; i < 6; i++)
        baseArrowIndices.forEach(function(index) {
            arrowIndices.push(index + 14 * i);
        });
    
    var boxVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
    
    var boxIndexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
    
    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    var texCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');
    gl.vertexAttribPointer(
        positionAttribLocation, //Attribute location
        3, //Number of elements per attribute
        gl.FLOAT, //Type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        0 // Offset from the beginning of a single vertex to this attribute
    );
    gl.vertexAttribPointer(
        texCoordAttribLocation, //Attribute location
        2, //Number of elements per attribute
        gl.FLOAT, //Type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        3 * Float32Array.BYTES_PER_ELEMENT// Offset from the beginning of a single vertex to this attribute
    );
    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(texCoordAttribLocation);
    
    var boxTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, boxTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(
        gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
        gl.UNSIGNED_BYTE,
        document.getElementById("testImage")
    );
    gl.bindTexture(gl.TEXTURE_2D, null);
    
    gl.useProgram(program);
    
    var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
    var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
    var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');
    
    var boxWorldMatrix = new Float32Array(16);
    var arrowWorldMatrix = new Float32Array(16);
    var viewMatrix = new Float32Array(16);
    var projMatrix = new Float32Array(16);
    glMatrix.mat4.identity(boxWorldMatrix);
    glMatrix.mat4.identity(arrowWorldMatrix);
    glMatrix.mat4.lookAt(viewMatrix, [0, 0, 9], [0, 0, 0], [0, 1, 0]);
    glMatrix.mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);
    
    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, boxWorldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);
    
    var xRotationMatrix = new Float32Array(16);
    var yRotationMatrix = new Float32Array(16);
    
    var identityMatrix = new Float32Array(16);
    glMatrix.mat4.identity(identityMatrix);
    var angle = 0;
    var loop = function () {
        angle = performance.now() / 1000 / 6 * 2 * Math.PI;
        glMatrix.mat4.rotate(yRotationMatrix, identityMatrix, angle, [0, 1, 0]);
        glMatrix.mat4.rotate(xRotationMatrix, identityMatrix, angle / 4, [1, 0, 0]);
        glMatrix.mat4.mul(boxWorldMatrix, yRotationMatrix, xRotationMatrix);
        
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, boxWorldMatrix);
        gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
        
        gl.clearColor(0.75, 0.85, 0.8, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_WIDTH_BIT);

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);
        gl.bindTexture(gl.TEXTURE_2D, boxTexture);
        gl.texImage2D(
            gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
            gl.UNSIGNED_BYTE,
            document.getElementById("testImage")
        );
        gl.activeTexture(gl.TEXTURE0);
        gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);
        
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, arrowWorldMatrix);
        
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrowVertices), gl.STATIC_DRAW);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(arrowIndices), gl.STATIC_DRAW);
        gl.texImage2D(
            gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
            gl.UNSIGNED_BYTE,
            document.getElementById("testImage2")
        );
        gl.drawElements(gl.TRIANGLES, arrowIndices.length, gl.UNSIGNED_SHORT, 0);
        
        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    
    gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);
    
    var drag = false;
    var dragStart;
    var dragEnd;
        canvas.addEventListener('mousedown', function(event) {
        dragStart = {
            x: event.pageX - canvas.offsetLeft,
            y: event.pageY - canvas.offsetTop
        }
    
        drag = true;
    })
    
    canvas.addEventListener('mouseup', function(event) {
        drag = false;
    })
    canvas.addEventListener('mouseleave', function(event) {
        drag = false;
    })
    var dragX;
    var dragY;
    var dist;
    canvas.addEventListener('mousemove', function(event) {
        if (drag) {
            dragEnd = {
                x: event.pageX - canvas.offsetLeft,
                y: event.pageY - canvas.offsetTop
            }
            dragX = dragEnd.x - dragStart.x;
            dragY = dragEnd.y - dragStart.y;
            dist = Math.sqrt(dragX * dragX + dragY * dragY);
            dragStart = dragEnd;
            rotateCamera(0.02, dist);
        }
    })
    
    canvas.addEventListener('wheel', function(event) {
        event.preventDefault();
        zoom(event.deltaY * 0.01)
    }, {passive: false})
    
    var resetButton = document.getElementById("reset");
    
    resetButton.addEventListener('click', function(event) {
        glMatrix.mat4.lookAt(viewMatrix, [0, 0, 9], [0, 0, 0], [0, 1, 0]);
    })
    
    function rotateCamera(sensitivity, magnitude) {
        var rotationAxis = new Float32Array(4);
        rotationAxis = glMatrix.vec4.fromValues(-dragY, -dragX, 0, 0);
        glMatrix.vec4.normalize(rotationAxis, rotationAxis);
        var inverseViewMatrix = new Float32Array(16);
        glMatrix.mat4.invert(inverseViewMatrix, viewMatrix);
        glMatrix.vec4.transformMat4(rotationAxis, rotationAxis, inverseViewMatrix);
        var newRotationAxis = [rotationAxis[0], rotationAxis[1], rotationAxis[2]];
        glMatrix.mat4.rotate(viewMatrix, viewMatrix, - sensitivity * magnitude, rotationAxis)
    }
    
    function zoom(distance) {
        var translationAxis = new Float32Array(4);
        translationAxis = glMatrix.vec4.fromValues(0, 0, -distance, 0);
        var inverseViewMatrix = new Float32Array(16);
        glMatrix.mat4.invert(inverseViewMatrix, viewMatrix);
        glMatrix.vec4.transformMat4(translationAxis, translationAxis, inverseViewMatrix);
        var newTranslationAxis = [translationAxis[0], translationAxis[1], translationAxis[2]];
        glMatrix.mat4.translate(viewMatrix, viewMatrix, newTranslationAxis)
    }
}

window.onload = function() {
    var canvasObject = document.getElementById('3DRendering');

    GLInit(canvasObject);
}