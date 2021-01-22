import * as actionTypes from '../actions/actionTypes';

const initialState = {
  username: '',
  name: '',
  password: '',
  logged: false,
  error: null,
  loading: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case actionTypes.AUTH_SUCCESS:
      return {
        ...state,
        username: action.username,
        name: action.name,
        password: action.password,
        logged: true,
        error: null,
        loading: false,
      };
    case actionTypes.AUTH_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case actionTypes.AUTH_REFRESH:
      return {
        ...state,
        loading: false,
        error: null,
        username: localStorage.getItem('username'),
        name: localStorage.getItem('name'),
        password: localStorage.getItem('password'),
        logged: localStorage.getItem('logged'),
      };
    case actionTypes.AUTH_LOGOUT:
      localStorage.removeItem('username');
      localStorage.removeItem('name');
      localStorage.removeItem('password');
      localStorage.removeItem('logged');
      return {
        ...state,
        username: '',
        name: '',
        password: '',
        error: null,
        loading: false,
        logged: false,
      };
    default:
      return state;
  }
};

export default reducer;
