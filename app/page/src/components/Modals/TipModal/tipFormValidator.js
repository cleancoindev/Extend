import { weiPerEth } from '../../../../../constants/general';

const generateNewPasswordFormValidator = (values) => {
  const errors = {};

  if (!values.amount) errors.amount = 'Required';
  if (!values.gasPrice) errors.gasPrice = 'Required';

  if (values.amount) {
    const commaError = values.amount && values.amount.indexOf(',') > 0;
    const nanError = isNaN(parseFloat(values.amount));
    const toSmallError = !nanError && (parseFloat(values.amount) * weiPerEth) < 1;

    if (commaError) errors.amount = 'Use a full stop as a delimiter instead of a comma';
    if (toSmallError) errors.amount = 'Smallest amount is one wei';
    if (nanError) errors.amount = 'The provided input is not a number';
  }

  if (values.gasPrice) {
    const nanError = isNaN(parseFloat(values.gasPrice));
    const toSmallError = !nanError && parseFloat(values.gasPrice) < 1;

    if (nanError) errors.gasPrice = 'The provided input is not a number';
    if (toSmallError) errors.gasPrice = 'Smallest amount is one gwei';
  }

  return errors;
};

export default generateNewPasswordFormValidator;
