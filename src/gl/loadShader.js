//

const loadShader = (gl, type, src) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (!gl.getShaderParamter(shader, gl.COMPILE_STATUS)) {
        console.error(`Cannot load a shader ${gl.getShaderInfoLog(shader)}`);
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

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

export default loadProgram;