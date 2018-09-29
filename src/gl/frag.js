const frag = `
    precision mediump float;

    uniform vec4 uColor;
    
    void main() {
        gl_FragColor = uColor;
    }
`;

export default frag;