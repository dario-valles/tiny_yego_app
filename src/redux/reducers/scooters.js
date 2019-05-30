import { GET_SCOOTERS, UPDATE_SCOOTERS, CLEAN_SCOOTERS } from '../types';

const initialState = {
  scooters: []
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_SCOOTERS:
    case GET_SCOOTERS:
      return {
        ...state,
        scooters: [...action.payload]
      };
    case CLEAN_SCOOTERS:
      return {
        ...state,
        scooters: []
      };

    default:
      return state;
  }
}
