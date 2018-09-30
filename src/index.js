import React from 'react';
import ReactDOM from 'react-dom';
import Main from './gl/gl_main';
import './index.scss';

Main();

ReactDOM.render(
    <h1>WebGL in React</h1>,
    document.getElementById('root')
)