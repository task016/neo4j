import React, { Component } from 'react';

import { Modal, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions/actionTypes';
import { withRouter } from 'react-router-dom';

class LoginModal extends Component {
  state = {
    username: '',
    password: '',
  };

  onChangeHandler = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  onSubmitHandler = (event) => {
    if (this.state.username !== '' && this.state.password !== '') {
      const userData = {
        username: this.state.username,
        password: this.state.password,
      };
      axios
        .post('http://localhost:8000/users/login', userData, {
          headers: { 'Access-Control-Allow-Origin': '*' },
        })
        .then((response) => {
          console.log(response);
          this.props.onSuccess(
            response.data.username,
            response.data.name,
            this.state.password
          );
          localStorage.setItem('username', response.data.username);
          localStorage.setItem('password', this.state.password);
          localStorage.setItem('name', response.data.name);
          localStorage.setItem('logged', true);
          this.props.onHide();
          this.props.history.push('/home');
        })
        .catch((error) => {
          console.log(error);
          this.props.onFail(error);
        });
    } else {
      console.log('unesi!');
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
          <Modal.Title id='contained-modal-title-vcenter-login'>
            Log in
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId='formGroupUsernameLogin'>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter username'
                name='username'
                onChange={this.onChangeHandler}
              />
            </Form.Group>
            <Form.Group controlId='formGroupPasswordLogin'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Password'
                name='password'
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
    onSuccess: (username, name, pass) => {
      dispatch({
        type: actionTypes.AUTH_SUCCESS,
        username: username,
        name: name,
        password: pass,
      });
    },
    onFail: (error) => {
      dispatch({
        type: actionTypes.AUTH_FAIL,
        error: error,
      });
    },
  };
};
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(LoginModal)
);
