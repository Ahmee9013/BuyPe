import {
  SET_CONTACTS,
  ADD_GROUP,
  DELETE_GROUP,
  UPDATE_GROUPS,
  SET_USER,
  LOGOUT_USER,
} from "./action";

const initialState = {
  contacts: [],
  groups: [],
  user: null,
};

export const contactReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CONTACTS:
      return {
        ...state,
        contacts: action.payload,
      };

    case ADD_GROUP:
      return {
        ...state,
        groups: [...state.groups, action.payload],
      };

    case DELETE_GROUP:
      return {
        ...state,
        groups: state.groups.filter((g) => g.name !== action.payload),
      };

    case UPDATE_GROUPS:
      return {
        ...state,
        groups: action.payload,
      };

    case SET_USER:
      return {
        ...state,
        user: action.payload,
      };

    case LOGOUT_USER:
      return {
        ...state,
        user: null,
      };

    default:
      return state;
  }
};
