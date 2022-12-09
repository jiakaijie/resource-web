import { AxiosPromise } from 'axios';
import http from '../utils/http';

interface PostLoginData {
  token: string;
}
export const postLogin = (data: PostLoginData): AxiosPromise<any> => {
  return http({
    url: '/api/users/login',
    method: 'POST',
    data
  })
}

export const getUserInfo = (): AxiosPromise<any> => {
  return http({
    url: '/api/users/userInfo',
    method: 'GET',
  })
}

export const getUsersList = (): AxiosPromise<any> => {
  return http({
    url: '/api/users/list',
    method: 'GET',
  })
}

