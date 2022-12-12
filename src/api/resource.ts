import { AxiosPromise } from 'axios';
import http from '../utils/http';

export const createResource = (data: any): AxiosPromise<any> => {
    return http({
        url: '/api/resources/create',
        method: 'POST',
        data
      })
}

export const updateResource = (data: any): AxiosPromise<any> => {
  return http({
      url: '/api/resources/update',
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

export const getResourceDetail = (id: string): AxiosPromise<any> => {
  return http({
    url: '/api/resources/detail',
    method: 'GET',
    params: {
      _id: id
    }
  })
}
