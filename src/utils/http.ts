import axios from 'axios';

import { apiHostConfig } from '../config/host';
import { env } from '../config/env';


const goLogin = (data: any) => {
  if (data.code === 401) {
    location.href = '/login'
  }
}

const http = axios.create({
  baseURL: apiHostConfig[env],
  timeout: 5000,
  headers: {
    'content-type': 'application/json',
  },
});

http
  .interceptors
  .request
  .use(
    config => {
      // console.warn(config);
      const Authorization = localStorage.getItem('Authorization') || '';

      (config.headers as any)['Authorization'] = Authorization;
      return config;
    },
    error => Promise.reject(error)
  );

http
  .interceptors
  .response
  .use(
    response => {

      let { status = 0, data: responseData } = response || {};
      responseData = responseData || {};
      status = status || 0;

      // if (status !== 200) {
      //   return '';
      // }

      // 没有登录跳转登录
      goLogin(responseData);

      // responseData：根据项目服务端返回数据改动
      let { code = 0, data = {}, msg = '' } = responseData;
      code = code || 0;
      data = data || {};
      msg = msg || '';


      if (code !== 0) {
        // console.log('errmsg------', msg);
        // 提示弹窗
        return data;
      }

      return data;
    },
    error => {
      let { message = '' } = error || {};
      message = message || '';
      // console.error('message------', message);
      // 提示弹窗
      return Promise.reject(error);
    });

export default http;