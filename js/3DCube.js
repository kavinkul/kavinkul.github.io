async function GLInit(canvas) {
    
    //Shaders
    
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
    var icosphereVertexShaderText = [
        'precision mediump float;',
        '',
        'attribute vec3 vertPosition;',
        'attribute vec3 vertColor;',
        'varying vec3 fragColor;',
        'uniform mat4 mWorld;',
        'uniform mat4 mView;',
        'uniform mat4 mProj;',
        '',
        'void main()',
        '{',
        '    fragColor = vertColor;',
        '    gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);',
        '}'
    ].join('\n');
    var icosphereFragmentShaderText = [
        'precision mediump float;',
        '',
        'varying vec3 fragColor;',
        '',
        'void main()',
        '{',
        '    gl_FragColor = vec4(fragColor, 1.0);',
        '}'
    ].join('\n');
    
    //Program Setup
    
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
    
    //Shaders using textures
    
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    
    //Shaders for icosphere
    
    var icosphereVertexShader = gl.createShader(gl.VERTEX_SHADER);
    var icosphereFragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    
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
    
    gl.shaderSource(icosphereVertexShader, icosphereVertexShaderText);
    gl.shaderSource(icosphereFragmentShader, icosphereFragmentShaderText);
    gl.compileShader(icosphereVertexShader);
    if (!gl.getShaderParameter(icosphereVertexShader, gl.COMPILE_STATUS)) {
        console.error("ERROR: Can't compile icosphere vertex shader.", gl.getShaderInfoLog(icosphereVertexShader));
        return;
    }
    gl.compileShader(icosphereFragmentShader);
    if (!gl.getShaderParameter(icosphereFragmentShader, gl.COMPILE_STATUS)) {
        console.error("ERROR: Can't compile icosphere fragment shader.", gl.getShaderInfoLog(icosphereFragmentShader));
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
    
    var icosphereProgram = gl.createProgram();
    gl.attachShader(icosphereProgram, icosphereVertexShader);
    gl.attachShader(icosphereProgram, icosphereFragmentShader);
    gl.linkProgram(icosphereProgram);
    if (!gl.getProgramParameter(icosphereProgram, gl.LINK_STATUS)) {
        console.error("ERROR: Can't link icosphereProgram.", gl.getProgramInfoLog(icosphereProgram));
        return;
    }
    gl.validateProgram(icosphereProgram);
    if (!gl.getProgramParameter(icosphereProgram, gl.VALIDATE_STATUS)) {
        console.error("ERROR: Can't validate icosphereProgram.", gl.getProgramInfoLog(icosphereProgram));
        return;
    }
    
    //Models
    
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
    
    var icosphereVertices = [];
    var icosphereIndices = [];
    
    //Retrieve data from object file
    
    var res = await fetch("js/Icosphere.obj")
        .then(response => response.text())
        .then(data => {
            let allLines = data.split('\n');
            let re1 = /v (-?\d+\.\d+) (-?\d+\.\d+) (-?\d+\.\d+)/;
            let re2 = /f (\d+)\/\d*\/\d+ (\d+)\/\d*\/\d+ (\d+)\/\d*\/\d+/;
            allLines.forEach(line => {
                let matches1 = re1.exec(line);
                let matches2 = re2.exec(line);
                if (matches1 != null) {
                    icosphereVertices.push(parseFloat(matches1[1]));
                    icosphereVertices.push(parseFloat(matches1[2]));
                    icosphereVertices.push(parseFloat(matches1[3]));
                    icosphereVertices.push(0.0);
                    icosphereVertices.push(0.0);
                    icosphereVertices.push(1);
                }
                else if (matches2 != null)
                {
                    icosphereIndices.push(parseInt(matches2[1]) - 1);
                    icosphereIndices.push(parseInt(matches2[2]) - 1);
                    icosphereIndices.push(parseInt(matches2[3]) - 1);
                }
            });
        })
        .catch(error => console.log(error));
    
    //Shader with texture
    
    var vertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
    
    var indexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferObject);
    
    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    var texCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');
    
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
    glMatrix.mat4.lookAt(viewMatrix, [0, 0, 10], [0, 0, 0], [0, 1, 0]);
    glMatrix.mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);
    
    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, boxWorldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);
    
    var xRotationMatrix = new Float32Array(16);
    var yRotationMatrix = new Float32Array(16);
    
    var identityMatrix = new Float32Array(16);
    glMatrix.mat4.identity(identityMatrix);
    
    //Shader for icosphere
    
    var icospherePositionAttribLocation = gl.getAttribLocation(icosphereProgram, 'vertPosition');
    var icosphereVertColorAttribLocation = gl.getAttribLocation(icosphereProgram, 'vertColor');
    gl.enableVertexAttribArray(icospherePositionAttribLocation);
    gl.enableVertexAttribArray(icosphereVertColorAttribLocation);
    
    gl.useProgram(icosphereProgram);
    
    var icosphereMatWorldUniformLocation = gl.getUniformLocation(icosphereProgram, 'mWorld');
    var icosphereMatViewUniformLocation = gl.getUniformLocation(icosphereProgram, 'mView');
    var icosphereMatProjUniformLocation = gl.getUniformLocation(icosphereProgram, 'mProj');
    
    var icosphereWorldMatrix = new Float32Array(16);
    glMatrix.mat4.identity(icosphereWorldMatrix);
    
    glMatrix.mat4.scale(icosphereWorldMatrix, icosphereWorldMatrix, [0.5, 0.5, 0.5])
    glMatrix.mat4.translate(icosphereWorldMatrix, icosphereWorldMatrix, [0, 0, 10]);
    
    gl.uniformMatrix4fv(icosphereMatWorldUniformLocation, gl.FALSE, icosphereWorldMatrix);
    gl.uniformMatrix4fv(icosphereMatViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(icosphereMatProjUniformLocation, gl.FALSE, projMatrix);
    
    //Render functions
    
    var t1 = 0;
    var t2 = performance.now()
    var isBoxRotation = false;
    var isClockwise = false;
    var isRelativeToEye = false;
    var angle = 0;
    var totalAngle = 0; 
    var startingWorldMatrix = new Float32Array(16);
    var topCounterClockwiseMat = glMatrix.mat4.fromValues(0, 0, -1, 0,
                                                          0, 1, 0, 0,
                                                          1, 0, 0, 0,
                                                          0, 0, 0, 1);
    var topClockwiseMat = glMatrix.mat4.fromValues(0, 0, 1, 0,
                                                   0, 1, 0, 0,
                                                  -1, 0, 0, 0,
                                                   0, 0, 0, 1);
    var frontCounterClockwiseMat = glMatrix.mat4.fromValues(0, 1, 0, 0,
                                                           -1, 0, 0, 0,
                                                            0, 0, 1, 0,
                                                            0, 0, 0, 1);
    var frontClockwiseMat = glMatrix.mat4.fromValues(0, -1, 0, 0,
                                                     1, 0, 0, 0,
                                                     0, 0, 1, 0,
                                                     0, 0, 0, 1);

    function renderBoxAndArrow() {
        gl.useProgram(program);
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
        
        t1 = t2;
        t2 = performance.now();
        
        if (isBoxRotation) {
            if (!isRelativeToEye) {
                if (!isClockwise) {
                    angle = (t2 - t1) / 1000 * 2 * Math.PI;
                    totalAngle += angle;
                    
                    if (totalAngle < Math.PI / 2) {
                        let inverseWorld = new Float32Array(16);
                        glMatrix.mat4.invert(inverseWorld, boxWorldMatrix);
                        let rotationAxis = new Float32Array(3);
                        glMatrix.vec3.transformMat4(rotationAxis, [0, 1, 0], inverseWorld);
                        glMatrix.mat4.rotate(boxWorldMatrix, boxWorldMatrix, angle, rotationAxis);
                    }
                    else {
                        isBoxRotation = false;
                        totalAngle = 0;
                        
                        glMatrix.mat4.copy(boxWorldMatrix, startingWorldMatrix);
                        
                        glMatrix.mat4.mul(boxWorldMatrix, topCounterClockwiseMat, boxWorldMatrix);
                    }
                }
                else {
                    angle = (t1 - t2) / 1000 * 2 * Math.PI;
                    totalAngle += angle;
                    
                    if (totalAngle > -Math.PI / 2) {
                        let inverseWorld = new Float32Array(16);
                        glMatrix.mat4.invert(inverseWorld, boxWorldMatrix);
                        let rotationAxis = new Float32Array(3);
                        glMatrix.vec3.transformMat4(rotationAxis, [0, 1, 0], inverseWorld);
                        glMatrix.mat4.rotate(boxWorldMatrix, boxWorldMatrix, angle, rotationAxis);
                    }
                    else {
                        isBoxRotation = false;
                        totalAngle = 0;
                        
                        glMatrix.mat4.copy(boxWorldMatrix, startingWorldMatrix);

                        glMatrix.mat4.mul(boxWorldMatrix, topClockwiseMat, boxWorldMatrix);
                    }
                }
            }
            else {
                if (!isClockwise) {
                    angle = (t2 - t1) / 1000 * 2 * Math.PI;
                    totalAngle += angle;
                    
                    let axis = new Float32Array(3);
                    
                    glMatrix.mat4.getTranslation(axis, icosphereWorldMatrix);
                    let length = glMatrix.vec3.len(axis);
                    
                    glMatrix.vec3.scale(axis, axis, 1 / length);
                    
                    if (totalAngle < Math.PI / 2) {
                        let inverseWorld = new Float32Array(16);
                        glMatrix.mat4.invert(inverseWorld, boxWorldMatrix);
                        let rotationAxis = new Float32Array(3);
                        glMatrix.vec3.transformMat4(rotationAxis, axis, inverseWorld);
                        glMatrix.mat4.rotate(boxWorldMatrix, boxWorldMatrix, angle, rotationAxis);
                    }
                    else {
                        isBoxRotation = false;
                        totalAngle = 0;
                        
                        glMatrix.mat4.copy(boxWorldMatrix, startingWorldMatrix);
                         
                        let originalAxis = glMatrix.vec3.clone(axis);
                        while (!glMatrix.vec3.equals(axis, [0, 0, 1])) {
                            glMatrix.vec3.transformMat4(axis, axis, topCounterClockwiseMat);
                            glMatrix.mat4.mul(boxWorldMatrix, topCounterClockwiseMat, boxWorldMatrix);
                        }
                        
                        glMatrix.mat4.mul(boxWorldMatrix, frontCounterClockwiseMat, boxWorldMatrix);
                        
                        while (!glMatrix.vec3.equals(axis, originalAxis)) {
                             glMatrix.vec3.transformMat4(axis, axis, topClockwiseMat);
                             glMatrix.mat4.mul(boxWorldMatrix, topClockwiseMat, boxWorldMatrix);
                        }
                    }
                }
                else {
                    angle = (t1 - t2) / 1000 * 2 * Math.PI;
                    totalAngle += angle;
                    
                    let axis = new Float32Array(3);
                    
                    glMatrix.mat4.getTranslation(axis, icosphereWorldMatrix);
                    let length = glMatrix.vec3.len(axis);
                    
                    glMatrix.vec3.scale(axis, axis, 1 / length);
                    
                    if (totalAngle > - Math.PI / 2) {
                        let inverseWorld = new Float32Array(16);
                        glMatrix.mat4.invert(inverseWorld, boxWorldMatrix);
                        let rotationAxis = new Float32Array(3);
                        glMatrix.vec3.transformMat4(rotationAxis, axis, inverseWorld);
                        glMatrix.mat4.rotate(boxWorldMatrix, boxWorldMatrix, angle, rotationAxis);
                    }
                    else {
                        isBoxRotation = false;
                        totalAngle = 0;
                        
                        glMatrix.mat4.copy(boxWorldMatrix, startingWorldMatrix);
                         
                        let originalAxis = glMatrix.vec3.clone(axis);
                        while (!glMatrix.vec3.equals(axis, [0, 0, 1])) {
                            glMatrix.vec3.transformMat4(axis, axis, topCounterClockwiseMat);
                            glMatrix.mat4.mul(boxWorldMatrix, topCounterClockwiseMat, boxWorldMatrix);
                        }
                        
                        glMatrix.mat4.mul(boxWorldMatrix, frontClockwiseMat, boxWorldMatrix);
                        
                        while (!glMatrix.vec3.equals(axis, originalAxis)) {
                             glMatrix.vec3.transformMat4(axis, axis, topClockwiseMat);
                             glMatrix.mat4.mul(boxWorldMatrix, topClockwiseMat, boxWorldMatrix);
                        }
                    }
                }
            }
        }
        
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, boxWorldMatrix);
        gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
        
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
    }
    
    var tIcs1 = 0;
    var tIcs2 = performance.now()
    var isIcosphereRotation = false;
    var isEyeClockwise = false;
    const constantIcosphereDistance = 5;
    
    function renderIcosphere() {
        gl.useProgram(icosphereProgram);
        gl.vertexAttribPointer(
            icospherePositionAttribLocation, //Attribute location
            3, //Number of elements per attribute
            gl.FLOAT, //Type of elements
            gl.FALSE,
            6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            0 // Offset from the beginning of a single vertex to this attribute
        );
        gl.vertexAttribPointer(
            icosphereVertColorAttribLocation, //Attribute location
            3, //Number of elements per attribute
            gl.FLOAT, //Type of elements
            gl.FALSE,
            6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            3 * Float32Array.BYTES_PER_ELEMENT// Offset from the beginning of a single vertex to this attribute
        );
        
        tIcs1 = tIcs2;
        tIcs2 = performance.now();
        
        if (isIcosphereRotation) {
            if (!isEyeClockwise) {
                
                angle = (tIcs2 - tIcs1) / 1000 * 2 * Math.PI;
                totalAngle += angle;
                
                if (totalAngle < Math.PI) {
                    
                    let translationAxis = new Float32Array(3);
                    
                    glMatrix.mat4.getTranslation(translationAxis, icosphereWorldMatrix);
                    
                    let newTranslationAxis = new Float32Array(3);
                    glMatrix.vec3.rotateY(newTranslationAxis, translationAxis, [0, 0, 0], angle);
                    glMatrix.vec3.normalize(newTranslationAxis, newTranslationAxis);
                    glMatrix.vec3.scale(newTranslationAxis, newTranslationAxis, constantIcosphereDistance);
                    glMatrix.vec3.negate(translationAxis, translationAxis);
                    glMatrix.mat4.translate(icosphereWorldMatrix, icosphereWorldMatrix, translationAxis);
                    glMatrix.mat4.translate(icosphereWorldMatrix, icosphereWorldMatrix, newTranslationAxis);
                }
                else {
                    isIcosphereRotation = false;
                    totalAngle = 0;
                    
                    glMatrix.mat4.copy(icosphereWorldMatrix, startingWorldMatrix);
                    
                    let translationAxis = new Float32Array(3);
                    glMatrix.mat4.getTranslation(translationAxis, icosphereWorldMatrix);
                    
                    let newTranslationAxis = new Float32Array(3);
                    glMatrix.vec3.transformMat4(newTranslationAxis, translationAxis, topCounterClockwiseMat)
                    glMatrix.vec3.negate(translationAxis, translationAxis);
                    glMatrix.mat4.scale(icosphereWorldMatrix, icosphereWorldMatrix, [2, 2, 2]);
                    glMatrix.mat4.translate(icosphereWorldMatrix, icosphereWorldMatrix, translationAxis);
                    glMatrix.mat4.translate(icosphereWorldMatrix, icosphereWorldMatrix, newTranslationAxis);
                    glMatrix.mat4.scale(icosphereWorldMatrix, icosphereWorldMatrix, [0.5, 0.5, 0.5]);
                }
            }
            else {
                angle = (tIcs1 - tIcs2) / 1000 * 2 * Math.PI;
                totalAngle += angle;
                
                if (totalAngle > -Math.PI) {
                    
                    let translationAxis = new Float32Array(3);
                    
                    glMatrix.mat4.getTranslation(translationAxis, icosphereWorldMatrix);
                    
                    let newTranslationAxis = new Float32Array(3);
                    glMatrix.vec3.rotateY(newTranslationAxis, translationAxis, [0, 0, 0], angle);
                    glMatrix.vec3.normalize(newTranslationAxis, newTranslationAxis);
                    glMatrix.vec3.scale(newTranslationAxis, newTranslationAxis, constantIcosphereDistance);
                    glMatrix.vec3.negate(translationAxis, translationAxis);
                    glMatrix.mat4.translate(icosphereWorldMatrix, icosphereWorldMatrix, translationAxis);
                    glMatrix.mat4.translate(icosphereWorldMatrix, icosphereWorldMatrix, newTranslationAxis);
                }
                else {
                    isIcosphereRotation = false;
                    totalAngle = 0;
                    
                    glMatrix.mat4.copy(icosphereWorldMatrix, startingWorldMatrix);
                    
                    let translationAxis = new Float32Array(3);
                    glMatrix.mat4.getTranslation(translationAxis, icosphereWorldMatrix);
                    
                    let newTranslationAxis = new Float32Array(3);
                    glMatrix.vec3.transformMat4(newTranslationAxis, translationAxis, topClockwiseMat)
                    glMatrix.vec3.negate(translationAxis, translationAxis);
                    glMatrix.mat4.scale(icosphereWorldMatrix, icosphereWorldMatrix, [2, 2, 2]);
                    glMatrix.mat4.translate(icosphereWorldMatrix, icosphereWorldMatrix, translationAxis);
                    glMatrix.mat4.translate(icosphereWorldMatrix, icosphereWorldMatrix, newTranslationAxis);
                    glMatrix.mat4.scale(icosphereWorldMatrix, icosphereWorldMatrix, [0.5, 0.5, 0.5]);
                }
            }
        }
        
        gl.uniformMatrix4fv(icosphereMatWorldUniformLocation, gl.FALSE, icosphereWorldMatrix);
        gl.uniformMatrix4fv(icosphereMatViewUniformLocation, gl.FALSE, viewMatrix);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(icosphereVertices), gl.STATIC_DRAW);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(icosphereIndices), gl.STATIC_DRAW);
        gl.drawElements(gl.TRIANGLES, icosphereIndices.length, gl.UNSIGNED_SHORT, 0);
    }
    
    //Main Rendering Loop
    
    var loop = function () {
        
        gl.clearColor(0.75, 0.85, 0.8, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_WIDTH_BIT);
        renderBoxAndArrow();
        renderIcosphere();
        
        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    
    //Box Events
    
    var boxTopCWButton = document.getElementById("boxTopClockwise");
    
    boxTopCWButton.addEventListener('click', function(event) {
        if (isIcosphereRotation || isBoxRotation)
            return;
        isBoxRotation = true;
        isRelativeToEye = false;
        isClockwise = true;
        glMatrix.mat4.copy(startingWorldMatrix, boxWorldMatrix);
    });
    
    var boxTopCCWButton = document.getElementById("boxTopCounterClockwise");
    
    boxTopCCWButton.addEventListener('click', function(event) {
        if (isIcosphereRotation || isBoxRotation)
            return;
        isBoxRotation = true;
        isRelativeToEye = false;
        isClockwise = false;
        glMatrix.mat4.copy(startingWorldMatrix, boxWorldMatrix);
    });
    
    var eyeRelativeCWButton = document.getElementById("eyeRelativeClockwise");
    
    eyeRelativeCWButton.addEventListener('click', function(event) {
        if (isIcosphereRotation || isBoxRotation)
            return;
        isBoxRotation = true;
        isRelativeToEye = true;
        isClockwise = true;
        glMatrix.mat4.copy(startingWorldMatrix, boxWorldMatrix);
    });
    
    var eyeRelativeCCWButton = document.getElementById("eyeRelativeCounterClockwise");
    
    eyeRelativeCCWButton.addEventListener('click', function(event) {
        if (isIcosphereRotation || isBoxRotation)
            return;
        isBoxRotation = true;
        isRelativeToEye = true;
        isClockwise = false;
        glMatrix.mat4.copy(startingWorldMatrix, boxWorldMatrix);
    });
    
    //Eye Events
    
    var eyeCWButton = document.getElementById("eyeClockwise");
    
    eyeCWButton.addEventListener('click', function(event) {
        if (isIcosphereRotation || isBoxRotation)
            return;
        isIcosphereRotation = true;
        isEyeClockwise = true;
        glMatrix.mat4.copy(startingWorldMatrix, icosphereWorldMatrix);
    })
    
    var eyeCWButton = document.getElementById("eyeCounterClockwise");
    
    eyeCWButton.addEventListener('click', function(event) {
        if (isIcosphereRotation || isBoxRotation)
            return;
        isIcosphereRotation = true;
        isEyeClockwise = false;
        glMatrix.mat4.copy(startingWorldMatrix, icosphereWorldMatrix);
    })
    
    
    //Mouse Events
    
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
    
    //Camera Functions
    
    function rotateCamera(sensitivity, magnitude) {
        let rotationAxis = new Float32Array(4);
        rotationAxis = glMatrix.vec4.fromValues(-dragY, -dragX, 0, 0);
        glMatrix.vec4.normalize(rotationAxis, rotationAxis);
        let inverseViewMatrix = new Float32Array(16);
        glMatrix.mat4.invert(inverseViewMatrix, viewMatrix);
        glMatrix.vec4.transformMat4(rotationAxis, rotationAxis, inverseViewMatrix);
        let newRotationAxis = [rotationAxis[0], rotationAxis[1], rotationAxis[2]];
        glMatrix.mat4.rotate(viewMatrix, viewMatrix, - sensitivity * magnitude, rotationAxis);
    }
    
    function zoom(distance) {
        let translationAxis = new Float32Array(4);
        translationAxis = glMatrix.vec4.fromValues(0, 0, -distance, 0);
        let inverseViewMatrix = new Float32Array(16);
        glMatrix.mat4.invert(inverseViewMatrix, viewMatrix);
        glMatrix.vec4.transformMat4(translationAxis, translationAxis, inverseViewMatrix);
        let newTranslationAxis = [translationAxis[0], translationAxis[1], translationAxis[2]];
        glMatrix.mat4.translate(viewMatrix, viewMatrix, newTranslationAxis);
    }
}

window.onload = function() {
    var canvasObject = document.getElementById('3DRendering');

    GLInit(canvasObject);
}