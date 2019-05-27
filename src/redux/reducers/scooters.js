import { getScooters } from '../actions';
getScooters();
const initialState = {
  scooters: []
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'GET_SCOOTERS':
      scooters: [...action.payload];

    default:
      return state;
  }
}
