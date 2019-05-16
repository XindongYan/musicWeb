import request from '../utils/request';

export function query() {
  return request('/api/users');
};

export function users() {
  return request('/api/users',{
    method: 'GET'
  })
}

// 查找音乐
export function searchMusic(params) {
  return request(`/api/searchMusic?name=${params.name}`, {
    method: 'GET'
  })
}

// 封禁用户
export function freeze(params) {
  return request('/api/freeze', {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

// 查询用户
export function searchUser(params) {
  return request(`/api/search/user?username=${params.username}`, {
    method: 'GET'
  })
}

// 获取用户详细信息
export function taMessage(params) {
  return request(`/api/taMessage?id=${params.id}`, {
    method: 'GET'
  })
}

// 注销登陆
export function signOut() {
  return request('/api/signOut', {
    method: 'POST'
  })
}

// 取消喜欢
export function removeLike(params) {
  return request('/api/removeLike', {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

// 获得commit
export function commitList(params) {
  return request('/api/commit/list', {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

// 添加评分
export function addCommit(params) {
  return request('/api/commit', {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

// 收藏音乐
export function likeMusic(params) {
  return request('/api/like', {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

// 获取音乐列表
export function musicList(params) {
  if (params) {
    return request(`/api/music/list?id=${params.id}`, {
      method:'GET'
    })
  } else {
    return request(`/api/music/list`, {
      method:'GET'
    })
  }
}

// 注册
export function register(params) {
  return request('/api/register', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

// 登陆
export function login(params) {
  return request('/api/login', {
    method: 'POST',
    body: JSON.stringify(params)
  })
}

export function uploadFile(params) {
  return request('/api/uploadFile', {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      enctype: 'multipart/form-data'
    }
  })
}
