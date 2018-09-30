const vert = `
    attribute vec4 vPosition;
    attribute vec4 avColor;

    uniform mat4 uModelViewMatrix;

    varying mediump vec4 vColor;
    
    void main() {
        gl_Position = uModelViewMatrix * vPosition;
        vColor = avColor;
    }
`;

export default vert;