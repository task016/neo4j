import React, { Component } from 'react';
import './HomePage.css';

import { Col, Container, Row, Form, Button, Nav } from 'react-bootstrap';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import LoginModal from '../LoginModal/LoginModal';
import SigninModal from '../SigninModal/SigninModal';
import axios from 'axios';

import Like from '../../assets/images/like.png';
import AddFriend from '../../assets/images/add-friend.jpg';
import Search from '../../assets/images/search.png';
import { connect } from 'react-redux';
import GameCard from '../Cards/GameCard/GameCard';

class HomePage extends Component {
  state = {
    loginModal: false,
    signinModal: false,
    username: '',
    search: '',
    page: 1,
    recommendedArray: null,
    searchArray: null,
    searchBool: false,
    disabled: false,
  };
  componentDidMount() {
    this.setState({ username: this.props.username });
    axios
      .get('http://localhost:8000/games/recommended', {
        headers: { 'Access-Control-Allow-Origin': '*' },
        params: {
          username: this.props.username,
          free: 'false',
        },
      })
      .then((res) => {
        console.log(res);
        console.log(this.props.username);
        if (Array.isArray(res.data)) {
          this.setState({ recommendedArray: res.data });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  onSearchHandler = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };
  onSearchClickHandler = () => {
    if (this.state.search === '') {
      console.log('unesi nesto');
    } else {
      this.setState({ searchBool: true });
      axios
        .get('http://localhost:8000/games/search', {
          headers: { 'Access-Control-Allow-Origin': '*' },
          params: {
            page: 1,
            searchTerm: this.state.search,
          },
        })
        .then((res) => {
          console.log(res);
          console.log(this.props.username);
          if (Array.isArray(res.data)) {
            this.setState({ searchArray: res.data });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  onLoginHandler = () => {
    this.setState({ loginModal: true });
  };
  onLoginFalseHandler = () => {
    this.setState({ loginModal: false });
  };
  onSigninHandler = () => {
    this.setState({ signinModal: true });
  };
  onSigninFalseHandler = () => {
    this.setState({ signinModal: false });
  };
  onNextHandler = () => {
    const pagePom = this.state.page + 1;
    axios
      .get('http://localhost:8000/games/search', {
        headers: { 'Access-Control-Allow-Origin': '*' },
        params: {
          page: pagePom,
          searchTerm: this.state.search,
        },
      })
      .then((res) => {
        console.log(res);
        if (Array.isArray(res.data)) {
          this.setState({
            searchArray: res.data,
            page: pagePom,
            searchBool: true,
          });
          console.log(pagePom);
        } else if (res.data === 'No more games') {
          this.setState({ disabled: true });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  onPrevHandler = () => {
    const p = this.state.page - 1;
    axios
      .get('http://localhost:8000/games/search', {
        headers: { 'Access-Control-Allow-Origin': '*' },
        params: {
          page: p,
          searchTerm: this.state.search,
        },
      })
      .then((res) => {
        console.log(res);
        console.log(this.props.username);
        if (Array.isArray(res.data)) {
          this.setState({ searchArray: res.data, page: p });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  render() {
    let recommanded = null;
    if (this.state.recommendedArray === null) {
      recommanded = (
        <p className='pt-3 font-weight-light font-italic text-center'>
          User have no recommended games yet!
        </p>
      );
    } else {
      recommanded = (
        <div className='pt-3'>
          {this.state.recommendedArray.map((el, index) => {
            return (
              <GameCard
                name={el.name}
                description={el.description}
                id={el.id}
                price={el.price}
                key={index}
              />
            );
          })}
        </div>
      );
    }
    let searched = null;
    let pages = null;
    if (this.state.searchArray === null && this.state.searchBool) {
      searched = (
        <p className='pt-3 font-weight-light font-italic text-center'>
          No results found.
        </p>
      );
    } else if (this.state.searchArray !== null && this.state.searchBool) {
      let disabledPom = null;
      let pagePom = null;

      if (this.state.page > 1) {
        pagePom = (
          <Nav.Link onClick={this.onPrevHandler}>previous page</Nav.Link>
        );
      } else {
        pagePom = (
          <Nav.Link onClick={this.onPrevHandler} disabled>
            previous page
          </Nav.Link>
        );
      }
      if (this.state.disabled) {
        disabledPom = (
          <Nav.Link onClick={this.onNextHandler} disabled>
            next page
          </Nav.Link>
        );
      } else {
        disabledPom = (
          <Nav.Link onClick={this.onNextHandler}>next page</Nav.Link>
        );
      }
      pages = (
        <Container>
          <Row>
            <Col className='d-flex justify-content-start'>{pagePom}</Col>
            <Col className='d-flex justify-content-end'>{disabledPom}</Col>
          </Row>
        </Container>
      );
      searched = (
        <div>
          {this.state.searchArray.map((el, index) => {
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
    } else {
      searched = null;
    }
    let pom = null;
    if (!this.props.logged) {
      pom = (
        <div className='bgcol'>
          <section className='section-about-us'>
            <Container>
              <h2 className='text-center'>About us</h2>
              <Row>
                <Col>
                  <p className='pt-4 pl-5 pr-5'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Proin ex risus, hendrerit ut nibh eu, porta faucibus dui.
                    Proin vel urna egestas, auctor odio nec, accumsan quam. Sed
                    quis nulla hendrerit, fermentum magna et, vestibulum risus.
                    Vestibulum tincidunt purus metus. Sed ornare purus sit amet
                    dolor convallis, ac lobortis dolor placerat. Nunc quis sem
                    tellus. Suspendisse libero tortor, blandit finibus arcu
                    quis, interdum interdum urna. Ut ultrices orci elit. Nulla
                    in diam quis nibh imperdiet placerat.
                  </p>
                </Col>
              </Row>
            </Container>
          </section>
          <section className='section-what-we-offer'>
            <Container>
              <h2 className='text-center mb-5'>What we offer?</h2>
              <Row className='pt-3'>
                <Col className='text-center'>
                  <img
                    src={Like}
                    width='50'
                    height='50'
                    className='rounded d-inline-block align-top mb-5'
                    alt='like'
                  />
                  <p>Like and dislike games!</p>
                </Col>
                <Col className='text-center'>
                  <img
                    src={AddFriend}
                    width='50'
                    height='50'
                    className='rounded d-inline-block align-top mb-5'
                    alt='add'
                  />
                  <p>Follow your friends to see the games they reacted to!</p>
                </Col>
                <Col className='text-center'>
                  <img
                    src={Search}
                    width='50'
                    height='50'
                    className='rounded d-inline-block align-top mb-5'
                    alt='search'
                  />
                  <p>Search for games!</p>
                </Col>
              </Row>
            </Container>
          </section>
          <Footer />
          <LoginModal
            show={this.state.loginModal}
            onHide={this.onLoginFalseHandler}
          />
          <SigninModal
            show={this.state.signinModal}
            onHide={this.onSigninFalseHandler}
          />
        </div>
      );
    } else {
      pom = (
        <div className='bgcol'>
          <section className='recommanded-games'>
            <Container>
              <h2 className='text-center'>Recommanded Games...</h2>
              <Row>
                <Col>{recommanded}</Col>
              </Row>
            </Container>
          </section>
          <section id='search'>
            <Container>
              <h3 className='text-center pb-3'>Search for games!</h3>
              <Row>
                <Col className='d-flex'>
                  <Form.Control
                    type='text'
                    placeholder='Search...'
                    name='search'
                    onChange={this.onSearchHandler}
                  />
                  <Button
                    variant='outline-dark'
                    onClick={this.onSearchClickHandler}
                    className='pl-2'
                  >
                    {' '}
                    Search
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col>
                  {searched} {pages}
                </Col>
              </Row>
            </Container>
          </section>
        </div>
      );
    }
    return (
      <div>
        <header>
          <Navbar
            onLoginHandler={this.onLoginHandler}
            onSigninHandler={this.onSigninHandler}
          ></Navbar>
        </header>
        {pom}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    logged: state.logged,
    username: state.username,
  };
};

export default connect(mapStateToProps)(HomePage);
