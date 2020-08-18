import { HttpClient } from '@angular/common/http'
import { HTTP } from '@ionic-native/http';
import { Injectable } from '@angular/core';
import { AbstractDataProvider } from '../abstracts/abstract-data-provider';
import { Platform } from 'ionic-angular';
import { HelperProvider } from './helper.provider';

interface Response {
  Status: string;
  Records: any;
}

@Injectable()
export class LocationProvider extends AbstractDataProvider{

  constructor(public platform: Platform, public httpNative: HTTP, public httpClient: HttpClient, public helperService: HelperProvider) {
    super(platform, httpNative, httpClient, helperService, '/API/Locations');
  }

  getLocations(params = {}) {
    return new Promise((resolve, reject) => {
      this.doRequest('get', params)
        .then((response: Response)=>{
          resolve(response.Records)})
        .catch(error => {
          reject(error);
        });
    });
  }

  getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    let Radius = 6371; // Radius of the earth in km
    let dLat = this.deg2rad(lat2-lat1);  // deg2rad below
    let dLon = this.deg2rad(lon2-lon1);
    let a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    let distance = Radius * c; // Distance in km
    return distance.toFixed(2);
  }

  deg2rad(deg) {
    return deg * (Math.PI/180)
  }

}
