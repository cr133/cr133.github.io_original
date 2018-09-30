import React from 'react';
import Canvas from './gl/gl_main';

class App extends React.Component {
    notification() {
        window.onload = function() {
            window.setTimeout(() => {
                // Work this
                const notitext = document.createElement('h3');
                notitext.style.color = "white";
                notitext.style.position = "absolute";
                notitext.style.left = "40%";
                notitext.style.top = "60%";
                notitext.innerHTML = "Click the middle circle to find more";
                document.body.appendChild(notitext);
            }, 2000);
        }
    }

    render() {
        {this.notification()}
        return (
            <div id="app">
                <h1 id="target">React + WebGL</h1>
                <Canvas />
            </div>
        )
    }
}

export default App;