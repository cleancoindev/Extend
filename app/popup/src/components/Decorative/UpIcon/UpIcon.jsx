import React from 'react';
import PropTypes from 'prop-types';

const UpIcon = ({ size }) => (
  <svg fill="#000000" height={size} viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </svg>
);

UpIcon.propTypes = {
  size: PropTypes.string
};

UpIcon.defaultProps = {
  size: '18'
};

export default UpIcon;