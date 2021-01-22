import React from 'react';

import { Navbar, Nav } from 'react-bootstrap';

import Logo from '../../assets/images/logo.jpg';

import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions/actionTypes';
import { withRouter } from 'react-router-dom';

const navbar = (props) => {
  let pom = null;
  if (props.logged === false) {
    pom = (
      <Nav className='ml-auto mr-1'>
        <Nav.Link onClick={props.onLoginHandler}>Login</Nav.Link>
        <Nav.Link onClick={props.onSigninHandler}>Signup</Nav.Link>
      </Nav>
    );
  } else {
    const profileLink = `/profile/${props.username}`;
    pom = (
      <Nav className='ml-auto mr-1'>
        <Nav.Link href={profileLink}>Profile</Nav.Link>
        <Nav.Link onClick={props.onLogout}>Logout</Nav.Link>
      </Nav>
    );
  }
  return (
    <Navbar sticky='top' collapseOnSelect expand='lg' bg='dark' variant='dark'>
      <Navbar.Brand href='/home'>
        <img
          alt=''
          src={Logo}
          width='30'
          height='30'
          className='d-inline-block align-top'
        />{' '}
      </Navbar.Brand>
      <Navbar.Toggle aria-controls='responsive-navbar-nav' />
      <Navbar.Collapse id='responsive-navbar-nav'>{pom}</Navbar.Collapse>
    </Navbar>
  );
};

const mapStateToProps = (state) => {
  return {
    logged: state.logged,
    username: state.username,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onLogout: () => {
      dispatch({
        type: actionTypes.AUTH_LOGOUT,
      });
    },
  };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(navbar));
