import api from '../services/api';
import { GET_SCOOTERS, UPDATE_SCOOTERS, CLEAN_SCOOTERS } from './types';

export const receivedScooters = payload => ({
  type: GET_SCOOTERS,
  payload
});

export const updateScooters = payload => ({
  type: UPDATE_SCOOTERS,
  payload
});

export const cleanedScooters = payload => ({
  type: CLEAN_SCOOTERS,
  payload
});

export const getScooters = () => async dispatch => {
  const response = await api.scooters.get();
  return dispatch(receivedScooters(response.data));
};

export const updatedScooters = scooters => dispatch => {
  return dispatch(updateScooters(scooters));
};

export const cleanScooters = () => dispatch => {
  return dispatch(cleanedScooters());
};
