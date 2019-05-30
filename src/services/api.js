import axios from 'axios';

const requestHelper = axios.create({
  baseURL: '',
  params: {
    api_token: ''
  }
});

export default {
  scooters: {
    get: () =>
      requestHelper({
        url: 'scooters',
        method: 'get'
      })
  }
};
