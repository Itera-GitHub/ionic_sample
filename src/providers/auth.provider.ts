import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractDataProvider } from '../abstracts/abstract-data-provider';
import { Device } from '@ionic-native/device';
import { HTTP } from '@ionic-native/http';
import { Platform } from 'ionic-angular';
import { HelperProvider } from './helper.provider';

interface Response {
  Status: string;
  Result: string;
}

@Injectable()
export class AuthProvider extends AbstractDataProvider {
  headers: HttpHeaders;

  constructor(public platform: Platform
              , public httpNative: HTTP
              , public httpClient: HttpClient
              , public helperService: HelperProvider
              , private device: Device) {
    super(platform, httpNative, httpClient, helperService, '/API/Register');
  }

  getAccess(callback) {
    let login = localStorage.getItem('login');
    if(login){
      this.login(login, callback);
    } else {
      this.register(callback);
    }
  }

  login(login, callback) {
    this.apiUrl = '/API/Login';
    let params = {login: login, password: login};
    this.doRequest('get', params)
      .then((response)=>{
        callback();
      })
      .catch((error) => {
        if(error.ErrorCode == 401) {
          this.register(callback);
        } else {
          callback();
        }
      });
  }

  register(callback) {
    let data = {imei: this.device.uuid, name: this.device.uuid};
    this.apiUrl = '/API/Register';
    let params = {IMEI: data.imei, name: data.name};
    this.doRequest('get', params).then((response: Response) => {
      localStorage.setItem('login', response.Result);
      this.login(response.Result, callback);
    }).catch(err => {
      callback();
    });
  }

}
