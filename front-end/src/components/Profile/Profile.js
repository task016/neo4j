import React, { Component } from 'react';
import axios from 'axios';
import './Profile.css';
import { withRouter } from 'react-router';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Navbar from '../Navbar/Navbar';
import UserCard from '../Cards/UserCard/UserCard';
import { connect } from 'react-redux';
import GameCard from '../Cards/GameCard/GameCard';
//import GameCard from '../Cards/GameCard/GameCard';

class Profile extends Component {
  state = {
    isMe: true,
    username: '',
    name: '',
    search: '',
    searchArray: null,
    searchBool: false,
    followersArray: null,
    followersBool: false,
    followingArray: null,
    followingBool: false,
    likedGames: null,
    likedArray: null,
  };
  onReRender = () => {
    this.forceUpdate();
  };
  componentDidUpdate(prevProps, prevState) {
    // Typical usage (don't forget to compare props):
    if (this.state.username !== prevState.username) {
      axios
        .get('http://localhost:8000/games/liked', {
          headers: { 'Access-Control-Allow-Origin': '*' },
          params: {
            username: this.state.username,
          },
        })
        .then((res) => {
          console.log(res);
          if (Array.isArray(res.data)) {
            this.setState({ likedArray: res.data });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
  componentDidMount() {
    const username = this.props.match.params.username;
    console.log(this.props.match.params.username);
    this.setState({ username: username });
    if (this.props.user !== username) {
      this.setState({ isMe: false });
    }
    axios
      .get('http://localhost:8000/users/', {
        headers: { 'Access-Control-Allow-Origin': '*' },
        params: {
          username: username,
        },
      })
      .then((res) => {
        console.log(res);
        this.setState({ name: res.data.name });
      })
      .catch((err) => {
        console.log(err);
      });

    window.setTimeout(() => {
      axios
        .get('http://localhost:8000/games/liked/', {
          headers: { 'Access-Control-Allow-Origin': '*' },
          params: {
            username: username,
          },
        })
        .then((res) => {
          console.log(res);
          if (Array.isArray(res.data)) {
            this.setState({ likedArray: res.data });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }, 100);
  }
  onSearchHandler = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };
  onSearchClickHandler = () => {
    if (this.state.search !== '') {
      axios
        .get('http://localhost:8000/users/search', {
          params: {
            page: 1,
            searchTerm: this.state.search,
          },
          headers: {
            'Access-Controll-Allow-Origin': '*',
          },
        })
        .then((res) => {
          console.log(res);
          if (Array.isArray(res.data)) {
            this.setState({
              searchArray: res.data,
              searchBool: true,
              followersBool: false,
              followingBool: false,
            });
            console.log(this.state.searchArray);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  onFollowersClickHandler = () => {
    axios
      .get('http://localhost:8000/users/followers', {
        params: {
          username: this.state.username,
        },
        headers: {
          'Access-Controll-Allow-Origin': '*',
        },
      })
      .then((res) => {
        console.log(res);
        if (Array.isArray(res.data)) {
          this.setState({
            followersArray: res.data,
            followersBool: true,
            followingBool: false,
            searchBool: false,
          });
        }
        console.log(this.state.followersArray);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  onFollowingClickHandler = () => {
    axios
      .get('http://localhost:8000/users/following', {
        params: {
          username: this.state.username,
        },
        headers: {
          'Access-Controll-Allow-Origin': '*',
        },
      })
      .then((res) => {
        console.log(res);
        if (Array.isArray(res.data)) {
          this.setState({
            followingArray: res.data,
            followersBool: false,
            followingBool: true,
            searchBool: false,
          });
        }
        console.log(this.state.followersArray);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  render() {
    let isMePom = null;
    if (this.state.isMe) {
      isMePom = (
        <Col className='border border-dark border-left-0'>
          <h3 className='mb-5'>Search for users</h3>
          <Row>
            <Col>
              <Form.Control
                type='text'
                placeholder='Search...'
                name='search'
                onChange={this.onSearchHandler}
              />
            </Col>
            <Col>
              <Button
                variant='outline-dark'
                onClick={this.onSearchClickHandler}
              >
                {' '}
                Search
              </Button>
            </Col>
          </Row>
          <Row className='pt-2 pb-2'>
            <Col>
              <Button
                variant='outline-info'
                onClick={this.onFollowersClickHandler}
              >
                Followers
              </Button>
              <Button
                variant='outline-info'
                onClick={this.onFollowingClickHandler}
              >
                Following
              </Button>
            </Col>
          </Row>
        </Col>
      );
    } else {
      isMePom = <Col className='border border-dark border-left-0'></Col>;
    }
    let likedGamesPom = null;
    if (this.state.likedArray === null) {
      likedGamesPom = (
        <p className='font-weight-light font-italic'>
          Have no liked games yet!
        </p>
      );
    } else {
      likedGamesPom = (
        <div>
          {this.state.likedArray.map((el, index) => {
            return (
              <GameCard
                name={el.name}
                description={el.description}
                price={el.price}
                id={el.id}
                key={index}
              />
            );
          })}
        </div>
      );
    }
    let searchedUsersPom = null;
    if (this.state.searchBool) {
      searchedUsersPom = (
        <Row className='border border-dark border-top-0'>
          <Col>
            <h3
              onClick={() => {
                this.setState({ searchBool: false });
              }}
            >
              Searched Users:
            </h3>
            {this.state.searchArray.map((el, index) => {
              return (
                <UserCard
                  key={index}
                  username={el.username}
                  name={el.name}
                  user={this.state.username}
                  rerender={this.onReRender}
                />
              );
            })}
          </Col>
        </Row>
      );
    }
    let followersPom = null;
    if (this.state.followersBool) {
      followersPom = (
        <Row className='border border-dark border-top-0'>
          <Col>
            <h3
              onClick={() => {
                this.setState({ followersBool: false });
              }}
            >
              Followers:
            </h3>
            {this.state.followersArray.map((el, index) => {
              return (
                <UserCard
                  key={index}
                  username={el.username}
                  name={el.name}
                  user={this.state.username}
                  rerender={this.onReRender}
                />
              );
            })}
          </Col>
        </Row>
      );
    }
    let followingPom = null;
    if (this.state.followingBool) {
      followingPom = (
        <Row className='border border-dark border-top-0'>
          <Col>
            <h3
              onClick={() => {
                this.setState({ followingBool: false });
              }}
            >
              Following:
            </h3>
            {this.state.followingArray.map((el, index) => {
              return (
                <UserCard
                  key={index}
                  username={el.username}
                  name={el.name}
                  user={this.state.username}
                  rerender={this.onReRender}
                />
              );
            })}
          </Col>
        </Row>
      );
    }
    return (
      <div className='bc'>
        <Navbar></Navbar>
        <Container className='pt-5'>
          <Row>
            <Col className='border border-dark'>
              <h3 className='mb-5'>Profile:</h3>
              <p>name: {this.state.name}</p>
              <p>username: {this.state.username}</p>
            </Col>
            {isMePom}
          </Row>
          {searchedUsersPom}
          {followersPom}
          {followingPom}
          <Row className='border border-dark border-top-0 pt-4'>
            <Col>
              <h3 className='text-center pb-3'>Liked Games...</h3>
              {likedGamesPom}
            </Col>
          </Row>
        </Container>
        {/* <GameCard
          name='Game Name'
          description='asdasdasd'
          price='50'
        ></GameCard>
       */}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.username,
  };
};

export default withRouter(connect(mapStateToProps)(Profile));
