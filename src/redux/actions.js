import api from '../services/api';
import { GET_SCOOTERS } from './types';

export const receivedScooters = payload => ({
  type: GET_SCOOTERS,
  payload
});

export const getScooters = () => async dispatch => {
  const response = await api.scooters.get();
  console.log('holaaaaaaaaaaaaaaaaaaaaaaa', typeof response.data);
  return dispatch(receivedScooters(response.data));
};
