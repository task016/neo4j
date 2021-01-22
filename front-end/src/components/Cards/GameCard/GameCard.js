import React, { Component } from 'react';
import { Button, Col, Row, Container } from 'react-bootstrap';
import { connect } from 'react-redux';
import axios from 'axios';

class GameCard extends Component {
  onLikeHandler = () => {
    console.log(this.props.id);
    console.log(this.props.user);
    axios
      .post(
        'http://localhost:8000/games/like',
        {
          gameId: this.props.id,
          username: this.props.user,
        },
        {
          headers: { 'Access-Control-Allow-Origin': '*' },
        }
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  onDislikeHandler = () => {
    console.log(this.props.id);
    console.log(this.props.user);
    axios
      .post(
        'http://localhost:8000/games/dislike',
        {
          gameId: this.props.id,
          username: this.props.user,
        },
        {
          headers: { 'Access-Control-Allow-Origin': '*' },
        }
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  render() {
    return (
      <Container className='border border-dark bg-light'>
        <h4 className='text-center'>{this.props.name}</h4>
        <p className='text-center pt-2 pb-2'>{this.props.description}</p>
        <Row>
          <Col>
            <p className='pl-2 pb-1'>Price: {this.props.price}$</p>
          </Col>
          <Col className='d-flex justify-content-end pb-1'>
            <Button className='mr-1' onClick={this.onLikeHandler}>
              Like
            </Button>
            <Button variant='danger' onClick={this.onDislikeHandler}>
              Dislike
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.username,
  };
};

export default connect(mapStateToProps)(GameCard);
