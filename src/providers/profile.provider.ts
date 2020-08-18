import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractDataProvider } from '../abstracts/abstract-data-provider';
import { HTTP } from '@ionic-native/http';
import { Platform } from 'ionic-angular';
import { HelperProvider } from './helper.provider';

interface Response {
  IMEI: string;
  Email: string;
  Name: string;
  Phone: string;
}
@Injectable()
export class ProfileProvider  extends AbstractDataProvider {

  constructor(public platform: Platform, public httpNative: HTTP, public helperService: HelperProvider, public httpClient: HttpClient) {
    super(platform, httpNative, httpClient, helperService, '/API/GetUser');
  }

  updateUser(params = {}) {
    this.apiUrl = '/API/SetUser';
    return new Promise((resolve, reject) => {
      this.doRequest('get', params)
        .then((response: any)=>{
          resolve(response)
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  getUser() {
    this.apiUrl = '/API/GetUser';
    return new Promise((resolve, reject) => {
      this.doRequest('get', {})
        .then((response: Response)=>{
          resolve(this.parseProfile(response));
         })
        .catch(error => {
          reject(error);
        });
    });
  }

  parseProfile(response: Response) {
    return {
      email: response.Email,
      imei: response.IMEI,
      name: response.Name,
      phone: response.Phone,
    }
  }


}
