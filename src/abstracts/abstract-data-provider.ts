import { Platform } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HTTP } from "@ionic-native/http";
import { HelperProvider } from '../providers/helper.provider';

export abstract class AbstractDataProvider {
  apiUrl: string = "";
  baseUrl: string = 'http://sample-api.com';
  headers: HttpHeaders;
  headersNative: any;

  protected constructor (public platform: Platform, public httpNative: HTTP, public httpClient: HttpClient, public helperService: HelperProvider, apiUrl: string) {
    this.apiUrl += apiUrl;
    this.headers = new HttpHeaders()
      .set("Content-Type", "application/json");
    this.headersNative = {
      'Content-Type': 'application/json'
    };
  }

  doRequest(type, params = {}, data = {}) {
    return new Promise((resolveData, reject)=>{
      this[type](params, data)
        .then((response:any)=>{
          if(response.Status == 'Error'){
            reject(response);
            this.parseError(response);
          } else {
            resolveData(response);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  setHeader(callback){
    callback();
  }

  get (params, data){
    return new Promise((resolve, reject) => {
      this.setHeader(()=>{
        this.httpNative.get(this.baseUrl + this.apiUrl, params, this.headersNative)
          .then(data => {
            try {
              data = JSON.parse(data.data);
              resolve(data);
            } catch (e) {
              this.helperService.presentToastError('invalid response: '+this.apiUrl);
              reject();
            }
          })
          .catch(error => {
            this.parseError(error);
            reject(error);
          });
      });
    });
  }

  putNative(params, put){
    return new Promise((resolve, reject) => {
      this.setHeader(()=>{
        this.httpNative.put(this.baseUrl + this.apiUrl + '/' + params.id, put, this.headersNative)
          .then(data => {
            try {
              data = JSON.parse(data.data);
              resolve(data);
            } catch (e) {
              this.helperService.presentToastError('invalid response');
              reject();
            }
          })
          .catch(error => {
            this.parseError(error);
            reject(error);
          });
      });
    });
  }

  postNative(params, post){
    return new Promise((resolve, reject) => {
      this.setHeader(()=>{
        this.httpNative.post(this.baseUrl + this.apiUrl, post, this.headersNative)
          .then(data => {
            try {
              data = JSON.parse(data.data);
              resolve(data);
            } catch (e) {
              this.helperService.presentToastError('invalid response');
              reject();
            }
          })
          .catch(error => {
            this.parseError(error);
            reject(error);
          });
      });
    });
  }

  parseError(error: Error) {
    if(error.Details) {
      this.helperService.presentToastError(error.Details);
    } else if(error.Message) {
      this.helperService.presentToastError(error.Message);
    }
  }

}

interface Error {
  Status: string;
  Message: string;
  Details: string;
}