import React from 'react';
import Canvas from './gl/gl_main';

class App extends React.Component {
    render() {
        return (
            <div id="app">
                <h1>React + WebGL</h1>
                <Canvas />
            </div>
        )
    }
}

export default App;