import * as T from '../actions/actions_types';

const initialState = {
  messages: [],
  chatList: [],
};

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case T.GET_TEXT_MESSAGE_SUCCESS:
      return {
        ...state,
        messages: action.getMessagesData.reverse(),
      };
    default:
      return state;
  }
};

export default chatReducer;
