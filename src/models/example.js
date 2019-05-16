import { musicList } from '../services/example'

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
    *fetchMusicList({ payload }, { call, put }) {
      let response;
      if (payload) {
        response = yield call(musicList, payload);
      } else {
        response = yield call(musicList);
      }
      yield put({ type: 'musicList', action: response })
    },
    *fetchCurrentUser({ payload }, { call, put }) {
      console.log(payload)
      yield put({ type: 'currentUser', action: payload })
    },
    *play({ payload }, { call, put }) {
      yield put({ type: 'play1', action: payload })
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
    }
  },

};
