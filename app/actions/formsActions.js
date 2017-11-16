import {
  ADD_FORM, UPDATE_FIELD_META, UPDATE_FIELD_ERROR, SET_TX_COST, REFUND_UNAVAILABLE, REFUND_AVAILABLE
} from '../constants/actionTypes';
import { getValOfEthInUsd } from '../actions/utils';
import { estimateGasForTx, getOraclizePrice, estimateGas, _checkIfRefundAvailable } from '../modules/ethereumService';

export const addForm = async (dispatch, payload) => {
  dispatch({ type: ADD_FORM, payload });
};

export const updateFieldMeta = (dispatch, payload) => {
  dispatch({ type: UPDATE_FIELD_META, payload });
};

export const updateFieldError = (dispatch, payload) => {
  dispatch({ type: UPDATE_FIELD_ERROR, payload });
};

const setTxValues = (web3, dispatch, value, gas, gasPrice, usdPerEth, balance) => {
  const txCostEth = web3.fromWei((gas * gasPrice) + parseFloat(value));
  const insufficientBalance = (parseFloat(balance) - parseFloat(txCostEth)) < 0;

  dispatch({
    type: SET_TX_COST,
    payload: {
      currentFormTxCost: {
        eth: txCostEth,
        usd: (txCostEth * usdPerEth).toFixed(2),
      },
      insufficientBalance
    }
  });
};

export const setRegisterFormTxPrice = async (web3, contract, dispatch, getState) => {
  const state = getState();
  const balance = state.account.balance;
  const oreclizeTransactionCost = await getOraclizePrice(contract);
  const value = oreclizeTransactionCost.toString();
  const contractMethod = contract.createUser;
  const usdPerEth = await getValOfEthInUsd();

  // mockup data here to give rough estimate of tx fee
  const params = [
    web3.toHex('J0EVFGVE2PCVAS3'),
    'BDk8K1PX/vOHQD1LqY+hMeEvDN0qIkv3N1UM6ly3TsltWus4jWj9CrNr1YRwIQuyV85kJhpqrtXRuuJQ7766DzggzthKyqEu5P/cM9xWkPycmoqROpwMgByolfYeE4eqWtY4vlGE/twjJ/' // eslint-disable-line
  ];

  const gas = await estimateGasForTx(web3, contractMethod, params, value);
  const gasPrice = parseFloat(web3.toWei(state.forms.registerForm.gasPrice.value, 'gwei'));

  setTxValues(web3, dispatch, value, gas, gasPrice, usdPerEth, balance);
};

export const setSendFormTxPrice = async (web3, contract, dispatch, getState) => {
  const state = getState();
  const form = state.forms.sendForm;
  const balance = state.account.balance;
  const value = web3.toWei(form.amount.value);
  const to = form.amount.to;
  const usdPerEth = await getValOfEthInUsd();

  const gas = await estimateGas(web3, { to, value });
  const gasPrice = parseFloat(web3.toWei(form.gasPrice.value, 'gwei'));

  setTxValues(web3, dispatch, value, gas, gasPrice, usdPerEth, balance);
};

export const setRefundFormTxPrice = async (web3, contract, dispatch, getState) => {
  const state = getState();
  const form = state.forms.refundForm;
  const balance = state.account.balance;
  const value = 0;
  const contractMethod = contract.refundMoneyForUser;
  const usdPerEth = await getValOfEthInUsd();
  const username = state.user.refundTipUsername;

  const isAvailable = await _checkIfRefundAvailable(web3, contract, username);

  if (!isAvailable) {
    dispatch({ type: REFUND_UNAVAILABLE });
    return;
  }

  dispatch({ type: REFUND_AVAILABLE });

  // mock data here in order to show gas
  const params = [web3.toHex(username)];
  const gasPrice = parseFloat(web3.toWei(form.gasPrice.value, 'gwei'));

  const gas = await estimateGasForTx(web3, contractMethod, params, value);

  setTxValues(web3, dispatch, value, gas, gasPrice, usdPerEth, balance);
};

export const setTipFormTxPrice = async (web3, contract, dispatch, getState) => {
  const state = getState();
  const balance = state.account.balance;
  const form = state.forms.tipForm;
  const value = web3.toWei(form.amount.value);
  const contractMethod = contract.tipUser;
  const author = state.modals.modalProps.author;
  const usdPerEth = await getValOfEthInUsd();

  const gas = await estimateGasForTx(web3, contractMethod, [web3.toHex(author)], value);
  const gasPrice = parseFloat(web3.toWei(form.gasPrice.value, 'gwei'));

  setTxValues(web3, dispatch, value, gas, gasPrice, usdPerEth, balance);
};

export const setBuyGoldFormTxPrice = async (web3, contract, dispatch, getState) => {
  const state = getState();
  const balance = state.account.balance;
  const form = state.forms.buyGoldForm;
  const months = form.months.value.toString();
  const contractMethod = contract.buyGold;
  const author = state.modals.modalProps.author;
  const id = state.modals.modalProps.id;
  const usdPerEth = await getValOfEthInUsd();
  const address = state.keyStore.address;

  const res = await fetch(
    `https://reddapp.decenter.com/gold.php?months=${months}&toUsername=${author}&fromAddress=${address}&id=${id}`
  );
  const data = await res.json();

  const value = web3.toWei(data.priceInEth.toString());

  const params = [
    web3.toHex(author), // bytes32 _to
    months, // string _months
    data.priceInUsd.toString(), // string _priceUsd
    data.nonce.toString(), // string _nonce
    data.signature, // string _signature
  ];

  const gas = await estimateGasForTx(web3, contractMethod, params, value);
  const gasPrice = parseFloat(web3.toWei(form.gasPrice.value, 'gwei'));

  setTxValues(web3, dispatch, value, gas, gasPrice, usdPerEth, balance);
};
