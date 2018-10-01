import React from 'react';
import Canvas, { circle, getFilledCirclePixels } from './gl/gl_main';

class App extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            rend: 0
        };
        this.updateValue = this.updateValue.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.rend !== nextState.rend)
            return true;
        return false;
    }
    updateValue(e) {
        if (this.state.rend === 0 && getFilledCirclePixels(circle.x, circle.y, e.clientX, e.clientY, circle.r)) {
            this.setState(() => ({
                rend: 1
            }))
        } else {
            this.setState(() => ({
                rend: 0
            }))
        }
    }

    render() {
        if (this.state.rend === 0) {
            return (
                <div id="app" onClick={this.updateValue}>
                    {/* TODO: Replace h1 with a component */}
                    <h1>Main page</h1>
                    <Canvas />
                </div>
            )
        } else {
            return (
                <div id="app" onDoubleClick={this.updateValue}>
                    {/* TODO: Replace h1 with a component */}
                    <h1>Next page</h1>
                    <Canvas />
                </div>
            )
        }
    }
}

export default App;