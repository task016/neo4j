import React, { Component } from 'react';
import { Col, Row, Nav } from 'react-bootstrap';
import axios from 'axios';

class UserCard extends Component {
  state = {
    array: null,
    pratiMe: false,
  };
  componentDidMount() {
    axios
      .get('http://localhost:8000/users/followers', {
        params: {
          username: this.props.username,
        },
        headers: {
          'Access-Controll-Allow-Origin': '*',
        },
      })
      .then((res) => {
        console.log(res);
        if (Array.isArray(res.data)) {
          res.data.map((el, index) => {
            if (el.username === this.props.user) {
              this.setState({ pratiMe: true });
              this.props.rerender();
            }
            return index;
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  onFollowHandler = () => {
    axios
      .post(
        'http://localhost:8000/users/follow',
        {
          username: this.props.user,
          follow: this.props.username,
        },
        {
          headers: {
            'Access-Controll-Allow-Origin': '*',
          },
        }
      )
      .then((res) => {
        console.log(res);
        this.setState({ pratiMe: true });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  onUnfollowHandler = () => {
    axios
      .post(
        'http://localhost:8000/users/unfollow',
        {
          username: this.props.user,
          unfollow: this.props.username,
        },
        {
          headers: {
            'Access-Controll-Allow-Origin': '*',
          },
        }
      )
      .then((res) => {
        console.log(res);
        this.setState({ pratiMe: false });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  render() {
    let pratiDugme = null;
    if (this.state.pratiMe) {
      pratiDugme = (
        <Nav.Link onClick={this.onUnfollowHandler}>Unfollow</Nav.Link>
      );
    } else {
      pratiDugme = <Nav.Link onClick={this.onFollowHandler}>follow</Nav.Link>;
    }
    const viewProfile = `/profile/${this.props.username}`;
    return (
      <div className='border border-dark bg-light'>
        <h4 className='text-center'>{this.props.name}</h4>
        <p className='text-center'> {this.props.username}</p>
        <Row className='pb-1 justify-content-center'>
          <Col md='auto'>
            <Nav.Link href={viewProfile}>View Profile</Nav.Link>
          </Col>
          <Col md='auto'>{pratiDugme}</Col>
        </Row>
      </div>
    );
  }
}

export default UserCard;
