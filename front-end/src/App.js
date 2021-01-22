import React, { Component } from 'react';
import './App.css';
import HomePage from './components/HomePage/HomePage';
import Profile from './components/Profile/Profile';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

class App extends Component {
  render() {
    let pom = null;

    if (this.props.logged) {
      pom = (
        <Switch>
          <Route path='/home' exact component={HomePage} />
          <Route path='/profile/:username' component={Profile} />
          <Redirect to='/home' />
        </Switch>
      );
    } else {
      pom = (
        <Switch>
          <Route path='/home' exact component={HomePage} />
          <Redirect to='/home' />
        </Switch>
      );
    }

    return <BrowserRouter>{pom}</BrowserRouter>;
  }
}

const mapStateToProps = (state) => {
  return {
    logged: state.logged,
  };
};

export default connect(mapStateToProps)(App);
