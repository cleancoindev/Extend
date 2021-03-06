import * as userActions from '../actions/userActions';

const userActionsHandler = (web3, engine, contracts, getState, dispatch, funcName, payload, sender) => {
  switch (funcName) {
    case 'acceptPrivacyNotice':
      return userActions[funcName](dispatch);

    case 'openAuthWindow':
      return userActions[funcName](payload, dispatch);

    case 'createOldUser':
      return userActions[funcName](web3, contracts, dispatch, getState);

    case 'checkRefundForSentTips':
      return userActions[funcName](web3, contracts.func, getState, dispatch);

    case 'setTab':
      return userActions[funcName](dispatch, payload);

    case 'addTabId':
      return userActions[funcName](dispatch, getState, sender.tab.id);

    default:
      throw Error('Function in handler not defined', funcName);
  }
};

export default userActionsHandler;
