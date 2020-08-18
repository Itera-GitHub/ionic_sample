import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConnectivityProvider } from '../../providers/connectivity';
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  selector: 'page-no-connection',
  templateUrl: 'no-connection.html',
})
export class NoConnectionPage {

  connected: boolean = false;

  constructor(public navCtrl: NavController
              , public navParams: NavParams
              , public events: Events
              , public splashScreen: SplashScreen
              , public connectivityService: ConnectivityProvider) {

  }

  checkConnection() {
    this.connectivityService.checkOnline()
      .then((result: boolean) => {
        this.connected = result;
        this.splashScreen.show();
         window.location.reload();
      });
  }

}
