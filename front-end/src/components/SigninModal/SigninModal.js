import React, { Component } from 'react';

import { Modal, Form, Button } from 'react-bootstrap';

import axios from 'axios';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions/actionTypes';
import { withRouter } from 'react-router-dom';

class SigninModal extends Component {
  state = {
    username: '',
    password: '',
    confirmPassword: ' ',
    firstName: '',
    lastName: '',
    error: false,
    errorText: '',
  };

  onChangeHandler = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  onSubmitHandler = (event) => {
    //this.onValidation();
    if (
      this.state.password !== this.state.confirmPassword ||
      this.state.firstName === '' ||
      this.state.lastName === '' ||
      this.state.username === ''
    ) {
      console.log('ponovo unesi!');
      console.log(this.state);
    } else {
      const userData = {
        name: this.state.firstName + ' ' + this.state.lastName,
        username: this.state.username,
        password: this.state.password,
      };
      axios
        .post('http://localhost:8000/users/createAccount', userData, {
          headers: { 'Access-Control-Allow-Origin': '*' },
        })
        .then((response) => {
          console.log(response);
          this.props.onSuccess(
            response.data.username,
            response.data.name,
            response.data.pass
          );
          localStorage.setItem('username', response.data.username);
          localStorage.setItem('password', response.data.pass);
          localStorage.setItem('name', response.data.name);
          localStorage.setItem('logged', true);
          this.props.onHide();
          this.props.history.push('/home');
        })
        .catch((error) => {
          console.log(error);
          this.props.onFail(error);
        });
    }
  };
  onValidation = () => {
    if (this.state.password !== this.state.confirmPassword) {
      this.setState({ error: true, errorText: 'Paswordi se ne poklapaju!' });
    } else if (
      this.state.firstName.length < 3 ||
      this.state.lastName.length ||
      this.state.username.length
    ) {
      this.setState({
        error: true,
        errorText: 'Ime prezime i username moraju biti minimalne duzine 3!',
      });
    }
  };
  render() {
    return (
      <Modal
        {...this.props}
        size='lg'
        aria-labelledby='contained-modal-title-vcenter'
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-vcenter-signin'>
            Sign in
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId='formGroupFirstNameSignin'>
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter First Name'
                name='firstName'
                onChange={this.onChangeHandler}
              />
            </Form.Group>
            <Form.Group controlId='formGroupLastNameSignin'>
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter Last Name'
                name='lastName'
                onChange={this.onChangeHandler}
              />
            </Form.Group>
            <Form.Group controlId='formGroupUsernameSignin'>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter username'
                name='username'
                onChange={this.onChangeHandler}
              />
            </Form.Group>
            <Form.Group controlId='formGroupPasswordSignin'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Password'
                name='password'
                onChange={this.onChangeHandler}
              />
            </Form.Group>
            <Form.Group controlId='formGroupconfirmPasswordSignin'>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Confirm Password'
                name='confirmPassword'
                onChange={this.onChangeHandler}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.onSubmitHandler}>Submit</Button>
          <Button variant='danger' onClick={this.props.onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    logged: state.logged,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onSuccess: (username, name, pass) =>
      dispatch({
        type: actionTypes.AUTH_SUCCESS,
        username: username,
        name: name,
        password: pass,
      }),
    onFail: (error) => {
      dispatch({
        type: actionTypes.AUTH_FAIL,
        error: error,
      });
    },
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SigninModal)
);
