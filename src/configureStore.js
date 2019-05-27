import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import lodash from 'lodash';

import reducers from './redux/reducers';
import {
  createAsyncStorageMiddleware,
  getCachedState
} from './middlewares/AsyncStorageMiddleware';

const blacklistedKeys = [];

export default async function() {
  const cachedState = lodash.omit(await getCachedState(), blacklistedKeys);
  const createStoreWithMiddleware = applyMiddleware(
    createAsyncStorageMiddleware(blacklistedKeys),
    thunk
  )(createStore);

  return createStoreWithMiddleware(reducers, cachedState);
}
