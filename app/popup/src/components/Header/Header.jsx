import React from 'react';
import PropTypes from 'prop-types';
import NetworkSelect from '../NetworkSelect/NetworkSelect';
import { clearPasswordMessage } from '../../../../messages/accountActionMessages';

import './header.scss';

const Header = ({ password, generatedVault, copiedSeed }) => (
  <div styleName="header-wrapper">
    <NetworkSelect />

    {
      generatedVault &&
      copiedSeed &&
      password &&
      <button
        styleName="lock-account-button"
        onClick={clearPasswordMessage}
      >
        Lock account
      </button>
    }
  </div>
);

Header.propTypes = {
  password: PropTypes.string.isRequired,
  generatedVault: PropTypes.bool.isRequired,
  copiedSeed: PropTypes.bool.isRequired
};

export default Header;