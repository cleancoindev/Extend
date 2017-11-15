import { TOGGLE_DROPDOWN, CLEAR_PENDING } from '../../../constants/actionTypes';
import { OPTIONS_DROPDOWN_ITEMS } from '../../../constants/general';

const reducerName = 'dropdowns';

const INITIAL_STATE = {
  visible: false,
  optionsDropdownItems: OPTIONS_DROPDOWN_ITEMS
};

export const reducer = (state, action) => {
  const payload = action.payload;

  switch (action.type) {
    case `${CLEAR_PENDING}-${reducerName}`:
      return { ...state, visible: false };
    case TOGGLE_DROPDOWN:
      return { ...state, visible: payload };

    default:
      return false;
  }
};

export const data = {
  name: reducerName,
  initialState: INITIAL_STATE,
  handle: reducer,
  async: false
};
