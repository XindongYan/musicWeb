import { musicList, searchMusic } from '../services/example'

export default {

  namespace: 'example',

  state: {
    musicList: [],
    currentUser: {},
    play: null,
    currentPlayName: null
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save' });
    },
    *fetchMusicList({ payload, callback }, { call, put }) {
      let response;
      if (payload) {
        response = yield call(musicList, payload);
      } else {
        response = yield call(musicList);
      }
      yield put({ type: 'musicList', action: response });
      if (callback) callback(response)
    },
    *fetchCurrentUser({ payload }, { call, put }) {
      console.log(payload)
      yield put({ type: 'currentUser', action: payload })
    },
    *play({ payload }, { call, put }) {
      yield put({ type: 'play1', action: payload })
    },
    *searchMusic({ payload }, { call, put }) {
      const response = yield call(searchMusic, payload);
      yield put({ type: 'searchMusic1', action: response });
    }
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    musicList(state, action) {
      return {
        ...state,
        musicList: action.action.data.result
      }
    },
    currentUser(state, action) {
      return {
      ...state,
      currentUser: action.action.user
    }
    },
    play1(state, action) {
      console.log(action)
      return {
        ...state,
        play: 'http://127.0.0.1:3000' + action.action.source,
        currentPlayName: action.action.currentPlayName
      }
    },
    searchMusic1(state, action) {
      return {
        ...state,
        musicList: action.action.data.music
      }
    }
  },

};
