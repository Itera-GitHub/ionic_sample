import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import { Events, Platform } from 'ionic-angular';
import { HelperProvider } from './helper.provider';
import { AuthProvider } from './auth.provider';

@Injectable()
export class ConnectivityProvider {
  isConnected: boolean = false;
  onDevice: boolean;

  connectSubscription:any;
  disconnectSubscription:any;

  constructor(public platform: Platform
    , private network: Network
    , private notification: HelperProvider
    , public auth: AuthProvider
    , public events: Events) {
    this.onDevice = this.platform.is('cordova');
  }

  checkOnline() {
    return new Promise((resolve, reject) => {
      if(this.onDevice){
        let conntype = this.network.type;
        this.isConnected = conntype && conntype !== 'unknown' && conntype !== 'none' && conntype !== null;
      } else {
        this.isConnected = navigator.onLine;
      }

      if(this.isConnected){
        this.auth.getAccess(()=>{
          resolve(this.isConnected);
        });
      } else {
        this.isConnected = false;
        this.notification.presentToastError('No internet connection');
        resolve(this.isConnected);
      }
    });
  }

  checkOffline() {
    this.disconnectSubscription = this.network.onDisconnect()
      .subscribe(() => {
        this.isConnected = false;
        this.events.publish('connection:failed');
        this.notification.presentToastError('No internet connection');
    });
  }

  stopWatching(){
    if(this.disconnectSubscription){
      this.disconnectSubscription.unsubscribe();
    }
  }

}
