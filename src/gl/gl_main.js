import vert from './vert';
import frag from './frag';
import loadProgram from './loadShader';
import { resizeCanvas } from './util';
import * as glm from './lib/gl-matrix';

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
export const gl = canvas.getContext('webgl');

if (!gl) {
    alert('Your browser does not support WebGL');
}

let rotate_value = 0.0;

function Main() {
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

        drawScene(programInfo, deltaTime);

        requestAnimationFrame(render);
    } 
    requestAnimationFrame(render);
}

function drawScene(programInfo, deltaTime) {
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

export default Main;