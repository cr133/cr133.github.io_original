const vert = `
    attribute vec4 vPosition;

    uniform mat4 uModelViewMatrix;
    
    void main() {
        gl_Position = uModelViewMatrix * vPosition;
    }
`;

export default vert;