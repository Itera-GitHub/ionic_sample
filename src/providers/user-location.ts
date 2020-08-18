import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/Storage';
import { Events } from 'ionic-angular';
import { HelperProvider } from './helper.provider';

declare var navigator;
declare var google;

@Injectable()
export class UserLocationProvider {

  userPosition;
  userPositionSubscription;

  constructor(public http: HttpClient
    , private storage: Storage
    , private helperService: HelperProvider
    , public events: Events) {

  }

  getCurrentPosition () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        if(position && position.coords){
          this.userPosition = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            lng: position.coords.longitude,
          };
          this.storage.set('userPosition', this.userPosition);
          this.events.publish('map:userPositionUpdate', this.userPosition);
        }
      }, () => {
        this.helperService.presentToastError('can not find google Geolocation');
      });
    } else {
      this.helperService.presentToastError('Browser does not support Geolocation');
    }
    this.watchUserPosition();
  }

  watchUserPosition() {
    if(!this.userPositionSubscription){
      this.userPositionSubscription =  setInterval(() => {
        this.getCurrentPosition();
      }, 10000);
    }
  }

  stopWatchUserPosition() {
    clearInterval(this.userPositionSubscription);
    this.userPositionSubscription = undefined;
  }

}
