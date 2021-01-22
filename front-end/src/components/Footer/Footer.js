import React from 'react';
import './Footer.css';

const footer = () => {
  return (
    <footer className='mt-4'>
      <div className='footer-top'>
        <div className='container'>
          <div className='row'>
            <div className='md-mb-30 sm-mb-30 col-md-4 col-sm-6 col-xs-12 segment-one'>
              <h2 className='naslov naslov2'>gCommunity</h2>
              <p className='paragraf'>Web app for gamers</p>
            </div>
            <div className='md-mb-30 sm-mb-30 col-md-4 col-sm-6 col-xs-12 segment-two'>
              <h2 className='naslov naslov2'>Links</h2>
              <ul>
                <li>
                  <a href='/'>Technical support</a>
                </li>
                <li>
                  <a href='/'>Contact</a>
                </li>
                <li>
                  <a href='/'>Review</a>
                </li>
              </ul>
            </div>
            <div className='md-mb-30 sm-mb-30 col-md-4 col-sm-6 col-xs-12 segment-three'>
              <h2 className='naslov naslov2'>Follow us</h2>
              <p className='paragraf'>Links to social media</p>
              <a href='www.facebook.com'>
                <i className='fa fa-facebook'></i>
              </a>
              <a href='/'>
                <i className='fa fa-twitter'></i>
              </a>
              <a href='/'>
                <i className='fa fa-linkedin'></i>
              </a>
              <a href='/'>
                <i className='fa fa-pinterest'></i>
              </a>
            </div>
          </div>
        </div>
      </div>
      <p className='footer-bottom-text paragraf'>
        All Rights reserved by &copy;gCommunity
      </p>
    </footer>
  );
};

export default footer;
