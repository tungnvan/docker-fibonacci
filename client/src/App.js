import React from 'react';
import {Switch, Route, Redirect, Link} from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Calculator from './calculator';
import Other from './other';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <div className="navigator" style={{marginBottom: '1rem'}}>
                    <Link to="/">Calculator</Link>&nbsp;
                    <Link to="/other">Other</Link>
                </div>
                <Switch>
                    <Route exact path="/calculator" component={Calculator} />
                    <Route exact path="/other" component={Other} />
                    <Redirect to="/calculator" />
                </Switch>
            </header>
        </div>
    );
}

export default App;
