import { AxiosPromise } from 'axios';
import http from '../utils/http';

export const getVersionList = (data: any): AxiosPromise<any> => {
  return http({
    url: '/api/versions/list',
    method: 'GET',
    params: data,
  })
}

export const createVersion = (data: any): AxiosPromise<any> => {
  return http({
    url: '/api/versions/create',
    method: 'POST',
    data,
  })
}
