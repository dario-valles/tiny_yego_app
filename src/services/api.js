import axios from 'axios';

const requestHelper = axios.create({
  baseURL: 'https://alphaone.getyugo.com/api/v1',
  params: {
    api_token: '***REMOVED***'
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
