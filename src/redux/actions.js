import api from '../services/api';

export const getScooters = () => async dispatch => {
  const response = await api.scooters.get();
  console.log(response.data);
  dispatch({
    type: 'GET_SCOOTERS',
    payload: response.data
  });
};
