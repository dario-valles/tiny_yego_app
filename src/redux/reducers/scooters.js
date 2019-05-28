import { GET_SCOOTERS } from '../types';

const initialState = {
  scooters: []
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_SCOOTERS:
      return {
        ...state,
        scooters: [...action.payload]
      };
    default:
      console.log(action.type);
      return state;
  }
}
