import React from 'react';
import vert from './vert';
import frag from './frag';
import { resizeCanvas } from './util';
import * as glm from './lib/gl-matrix';

let rotate_value = 0.0;

export function Main(gl) {
    mouse(gl);
    // Create a shader
    const shaderProgram = loadProgram(gl, vert, frag);

    const programInfo = {
        program: shaderProgram,
        aLocation: {
            vPosition: gl.getAttribLocation(shaderProgram, 'vPosition'),
            vColor: gl.getAttribLocation(shaderProgram, 'avColor'),
        },
        uLocation: {
            modelView: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
        }
    };

    gl.useProgram(programInfo.program);

    // Set vertices and colors

    let vertices = [];
    let colors = [];

    for (let i = 0; i < 360; i++) {
        vertices.push(Math.cos((i * Math.PI / 180.0)));
        vertices.push(Math.sin((i * Math.PI / 180.0)));

        colors.push(0.92941);
        colors.push(0.94902);
        colors.push(0.76078);
        colors.push(1.0);
    }

    // Send to GPU
    const vBuffers = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffers);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(vertices),
        gl.STATIC_DRAW
    );
    gl.vertexAttribPointer(programInfo.aLocation.vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.aLocation.vPosition);

    const fBuffers = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, fBuffers);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(colors),
        gl.STATIC_DRAW
    );
    gl.vertexAttribPointer(programInfo.aLocation.vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.aLocation.vColor);

    let then = 0.0;

    function render(now) {
        now *= 0.001;
        const deltaTime = now - then;
        then = now;

        drawScene(gl, programInfo, deltaTime);

        requestAnimationFrame(render);
    } 
    requestAnimationFrame(render);
}

const drawScene = (gl, programInfo, deltaTime) => {
    // Clear background
    resizeCanvas(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0.1647, 0.1647, 0.1647, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT, gl.DEPTH_BUFFER_BIT);

    // Draw biggest circle
    let modelViewMatrix = glm.mat4.create();
    let translate = glm.vec3.create();
    let rotate = glm.vec3.create();
    let scale = glm.vec3.create();

    glm.vec3.set(scale, 0.16, 0.16, 1.0);
    
    glm.mat4.scale(modelViewMatrix, modelViewMatrix, scale);

    gl.uniformMatrix4fv(programInfo.uLocation.modelView, false, modelViewMatrix);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 360);

    // Draw bigger circle
    modelViewMatrix = glm.mat4.create();
    glm.vec3.set(translate, 0.6, 0.0, 0.0);
    glm.vec3.set(rotate, 0.0, 0.0, 1.0);
    glm.vec3.set(scale, 0.08, 0.08, 1.0);

    glm.mat4.rotate(modelViewMatrix, modelViewMatrix, rotate_value, rotate);
    glm.mat4.translate(modelViewMatrix, modelViewMatrix, translate);
    glm.mat4.rotate(modelViewMatrix, modelViewMatrix, 2 * rotate_value, rotate);
    glm.mat4.scale(modelViewMatrix, modelViewMatrix, scale);

    gl.uniformMatrix4fv(programInfo.uLocation.modelView, false, modelViewMatrix);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 360);

    // Draw smaller circle
    modelViewMatrix = glm.mat4.create();
    glm.vec3.set(scale, 0.04, 0.04, 1.0);
    
    glm.mat4.rotate(modelViewMatrix, modelViewMatrix, rotate_value, rotate);
    glm.mat4.translate(modelViewMatrix, modelViewMatrix, translate);
    glm.mat4.rotate(modelViewMatrix,modelViewMatrix, -4 * rotate_value, rotate);
    glm.vec3.set(translate, 0.2, 0.0, 0.0);
    glm.mat4.translate(modelViewMatrix, modelViewMatrix, translate);
    glm.mat4.rotate(modelViewMatrix, modelViewMatrix, rotate_value, rotate);
    glm.mat4.scale(modelViewMatrix, modelViewMatrix, scale);

    gl.uniformMatrix4fv(programInfo.uLocation.modelView, false, modelViewMatrix);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 360);

    // rotate animation
    rotate_value += deltaTime;
}

////////////////////////////////
const mouse = (gl) => {
    const circle = {
        x: Math.floor(window.innerWidth / 2),
        y: Math.floor(window.innerHeight / 2),
        r: Math.floor(gl.canvas.clientWidth / 2 * 0.16)
    };
    
    gl.canvas.onmousemove = function(e) {
        if (getFilledCirclePixels(circle.x, circle.y, e.clientX, e.clientY, circle.r)) {
            console.log(e.clientX, e.clientY);
        }
    }
}

const getFilledCirclePixels = (x, y, ex, ey, radius) => {
    let xoff = 0;
    let yoff = radius;
    let bal = -radius;

    while (xoff <= yoff) {
        let p0 = x - xoff;
        let p1 = x - yoff;

        let w0 = xoff * 2;
        let w1 = yoff * 2;

        if(line(p0, y + yoff, ex, ey, w0))
            return true;
        if(line(p0, y - yoff, ex, ey, w0))
            return true;
        if(line(p1, y + xoff, ex, ey, w1))
            return true;
        if(line(p1, y - xoff, ex, ey, w1))
            return true;

        if ((bal += xoff++ + xoff) >= 0)
            bal -= --yoff + yoff;
    }
    return false;
}

const line = (x, y, ex, ey, w) => {
    for (let i = 0; i < w; i++) {
        if (x + i === ex && y === ey)
            return true;
    }
    return false;
}


//////////////////////////////////

const loadProgram = (gl, vert, frag) => {
    const vsrc = loadShader(gl, gl.VERTEX_SHADER, vert);
    const fsrc = loadShader(gl, gl.FRAGMENT_SHADER, frag);

    const program = gl.createProgram();
    gl.attachShader(program, vsrc);
    gl.attachShader(program, fsrc);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(`Cannot load a program ${gl.getProgramInfoLog(program)}`);
        gl.deleteProgram(program);
        return null;
    }
    return program;
}

const loadShader = (gl, type, src) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(`Cannot load a shader ${gl.getShaderInfoLog(shader)}`);
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

/////////////////////////////////////////////////////////////////////
//// WebGL End
/////////////////////////////////////////////////////////////////////

class Canvas extends React.Component {
    componentDidMount() {
        this.updateCanvas();
    }
    updateCanvas() {
        const gl = this.refs.canvas.getContext('webgl');
        if (!gl) {
            alert('Your browser does not support WebGL');
        }
        Main(gl);
    }
    render() {
        return (
            <div id="canvas-con">
                <canvas ref="canvas"></canvas>
            </div>
        )
    }
}

export default Canvas;