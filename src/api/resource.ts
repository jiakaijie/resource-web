import { AxiosPromise } from 'axios';
import http from '../utils/http';

export const createResource = (data: any): AxiosPromise<any> => {
    console.log('data', data);
    return http({
        url: '/api/resources/create',
        method: 'POST',
        data
      })
}
export const getResourceList = (data: any): AxiosPromise<any> => {
  return http({
    url: '/api/resources/list',
    method: 'GET',
    params: data
  })
}