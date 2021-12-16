import axios, { AxiosResponse } from 'axios';
import { environment } from 'src/environments/environment';

export function get(url : string) : Promise<AxiosResponse> {
  url = environment.databaseUrl + url;
  return axios.get(url);
}

export function post(url : string, body : any) : Promise<AxiosResponse> {
  url = environment.databaseUrl + url;
  return axios.post(url, body);
}

export function put(url : string, body : any) : Promise<AxiosResponse> {
  url = environment.databaseUrl + url;
  return axios.put(url, body);
}

export function remove(url : string, body : any) : Promise<AxiosResponse> {
  url = environment.databaseUrl + url;
  return axios.delete(url, body);
}