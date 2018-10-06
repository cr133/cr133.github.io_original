import React from 'react';
import { Route, Switch, NavLink } from 'react-router-dom';
import Intro from './route_components/Intro';

export default class About extends React.Component {
    constructor(props) {
        super(props);
    }

    show() {

    }

    render() {
        return (
            <div id="about-container">
                {/* Nav Bar */}
                
                <Switch>
                    <Route path='/' component={Intro}/>
                    {/* <Route path='/react' component={Rct}/> */}
                    {/* <Route path='/jquery' component={JQuery}/> */}
                    {/* <Route path='/es6' component={ES6}/> */}
                    {/* <Route path='/opengl' component={OpenGL}/> */}
                    {/* <Route path='/node' component={Nde}/> */}
                    {/* <Route path='/mongo' component={Mongo}/> */}
                    {/* <Route path='/projects' component={Project}/> */}
                    {/* <Route component={NoMatch}/> */}
                </Switch>
            </div>
        )
    }
}