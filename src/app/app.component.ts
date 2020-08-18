import { Component, ViewChild } from '@angular/core';
import { Events, MenuController, Nav, Platform, Config, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

import { MapPage } from '../pages/map/map';
import { HelperProvider } from '../providers/helper.provider';
import { LocationsPage } from '../pages/locations/locations';
import { UserLocationProvider } from '../providers/user-location';
import { NoConnectionPage } from '../pages/no-connection/no-connection';
import { ConnectivityProvider } from '../providers/connectivity';
import { ProfilePage } from '../pages/profile/profile';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;

  rootPage;

  pages: Array<{title: string, component: any, icon: string, code: string, name: string}>;

  constructor(public platform: Platform
              , public statusBar: StatusBar
              , public config: Config
              , public app: App
              , public helper: HelperProvider
              , public userPositionService: UserLocationProvider
              , private screenOrientation: ScreenOrientation
              , public events: Events
              , public connectivityService: ConnectivityProvider
              , private menuCtrl: MenuController
              , public splashScreen: SplashScreen) {

    this.config.set('backButtonIcon', 'aqua-back');

    // used for navigation
    this.pages = [

      { title: 'Map', component: MapPage, icon: 'aqua-map', code: 'map', name: 'MapPage'  },
      { title: 'Point List', component: LocationsPage, icon: 'aqua-list', code: 'list', name: 'LocationsPage' },
      { title: 'Profile', component: ProfilePage, icon: 'aqua-profile', code: 'profile', name: 'ProfilePage'  }
    ];

    this.initializeApp();
  }

  ngAfterViewInit() {
    this.disableSwipe();
  }

  enableSwipe(): void {
    this.menuCtrl.swipeEnable(true);
    this.events.publish('menu:opened', {})
  }

  disableSwipe(): void {
    this.menuCtrl.swipeEnable(false);
  }

  initializeApp() {
    this.platform.ready().then(() => {

      this.platform.registerBackButtonAction(() => {
        this.backButtonActions();
      });

      this.connectivityService.checkOnline()
        .then(isConnected => {
          this.statusBar.backgroundColorByHexString('#1d226c');
          this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

          this.rootPage = isConnected ? MapPage : NoConnectionPage;

          this.splashScreen.hide();
          this.platform.pause.subscribe(() => {
            this.userPositionService.stopWatchUserPosition();
            this.connectivityService.stopWatching();
          });

          this.platform.resume.subscribe(() => {
            window['paused'] = 0;
            this.userPositionService.getCurrentPosition();
            this.userPositionService.watchUserPosition();
            this.connectivityService.checkOffline();
          });

          this.connectivityService.checkOffline();

          this.events.subscribe('connection:failed', (point) => {
            this.nav.setRoot(NoConnectionPage);
          });
        });
    });
  }

  backButtonActions() {
    if(this.helper.loading){
      this.helper.loading.dismiss();
    }
    let activeView = this.nav.getActive();
    if(this.helper.alert) {
      this.helper.alert.dismiss();
      this.helper.alert = null;
    } else if(activeView.name === 'MapPage') {
      if(localStorage.getItem('mapPopUpShown') == '1' || localStorage.getItem('mapDirectionsShown') == '1'){
        this.events.publish('menu:opened', {})
      } else {
        this.platform.exitApp();
      }
    } else {
      this.nav.pop();
    }
  }

  openPage(page) {
    if(page.code == 'map'){
      this.nav.popTo(page.component);
    } else {
      if(this.nav.getActive().name == page.name){
        this.menuCtrl.close();
      } else {
        this.nav.push(page.component, {gotFromMenu: true});
      }
    }
  }

}
