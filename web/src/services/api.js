// @ts-ignore

/* eslint-disable */
import { KEY_AUTH_TOKEN } from '@/shared/constant';
import { message } from 'antd';
import { history } from 'umi';
import { extend } from 'umi-request';

const errorHandler = (error) => {
  if (error?.response?.status === 401) {
    message.error('Please log in, in order to see the requested page.');
    return history.push('/user/login');
  }
  if (error?.response?.status === 403) {
    return history.push('/403');
  }
  if (error?.response?.status === 404) {
    return history.push('/404');
  }
  // if(error?.response?.status === 500){
  //   if (error?.data?.error){
  //     message.error(`Server error: ${error?.data?.error}`)
  //   }
  // }
  if (error?.response?.status === 422) {
    if (error?.data?.errors) {
      message.error(error?.data?.errors.join('\n'));
    }
  }
};

export const apiPrefix = process.env.NODE_ENV === 'development' ? 'http://localhost:3010' : '';

const api = extend({
  prefix: apiPrefix,
  errorHandler,
});

api.interceptors.request.use((url, options) => {
  const token = localStorage.getItem(KEY_AUTH_TOKEN);
  if (token) {
    return {
      url,
      options: {
        ...options,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    };
  }
  return {
    url,
    options,
  };
});

// api.interceptors.request.use((data, response) => {
//   console.log(data, response);
//   return {data, response}
// })

export default api;

export async function currentUser(options) {
  return api('/api/current_user', {
    method: 'GET',
    ...(options || {}),
  });
}
/** 退出登录接口 POST /api/login/outLogin */

export async function logout(options) {
  return api('/api/logout', {
    method: 'POST',
    ...(options || {}),
  });
}
/** 登录接口 POST /api/login/account */

export async function login(body, options) {
  return api('/api/login', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
/** 此处后端没有提供注释 GET /api/notices */

export async function getNotices(options) {
  return api('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}
/** 获取规则列表 GET /api/rule */

export async function rule(params, options) {
  return api('/api/rule', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}
/** 新建规则 PUT /api/rule */

export async function updateRule(options) {
  return api('/api/rule', {
    method: 'PUT',
    ...(options || {}),
  });
}
/** 新建规则 POST /api/rule */

export async function addRule(options) {
  return api('/api/rule', {
    method: 'POST',
    ...(options || {}),
  });
}
/** 删除规则 DELETE /api/rule */

export async function removeRule(options) {
  return api('/api/rule', {
    method: 'DELETE',
    ...(options || {}),
  });
}
