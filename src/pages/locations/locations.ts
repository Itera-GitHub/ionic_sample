import { Component, ViewEncapsulation } from '@angular/core';
import { NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import { Location } from '../../abstracts/interfaces/location';
import { Storage } from '@ionic/Storage';
import { LocationProvider } from '../../providers/location.provider';
import { MapPage } from '../map/map';
import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operators';
import { HelperProvider } from '../../providers/helper.provider';

@Component({
  selector: 'page-locations',
  templateUrl: 'locations.html',
  encapsulation: ViewEncapsulation.None
})
export class LocationsPage {
  locationsList: Location[];
  locationsSearchList: Location[];
  search: string;
  userPosition;
  public searchSubject: Subject<any>        = new Subject();

  constructor(public navCtrl: NavController
              , private storage: Storage
              , public loadingCtrl: LoadingController
              , public events: Events
              , public locationsProvider: LocationProvider
              , public helperProvider: HelperProvider
              , public navParams: NavParams) {
    this.helperProvider.showLoader();

    this.getLocations();

    this.searchSubject.pipe(
      debounceTime(300)
    ).subscribe(searchTextValue => {
      this.searchLocations(this.search);
    });

    this.storage.get('userPosition').then((userPosition) => {
      this.userPosition = userPosition;
    });
  }

  ionViewWillEnter () {
    let pages = this.navCtrl.getViews();
    if(pages.length > 2){
      this.navCtrl.remove(this.navCtrl.getPrevious().index);
    }
  }

  onInputSearch(e) {
    this.searchSubject.next();
  }

  onCancelSearch(e) {
    this.locationsSearchList = Object.assign({}, this.locationsList);
  }

  selectLocation(location){
    setTimeout(()=>{
      this.navCtrl.popTo(MapPage);
      this.events.publish('map:panTo', location);
    });
  }

  getLocations(params = {}) {
    this.locationsProvider.getLocations(params)
      .then((data: Location[]) => {
        this.locationsList = data;
        this.locationsSearchList = data;
        if(this.userPosition && this.userPosition.lat){
          this.calculateDistance(this.userPosition);
        }
        this.helperProvider.loading.dismiss();
      })
      .catch(err => {
        this.helperProvider.loading.dismiss();
      });
  }

  searchLocations(searchText) {
    let newLocations = [];
    this.locationsList.forEach((item) => {
      if(item.address.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) != -1 || item.name.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) != -1){
        newLocations.push(item);
      }
    });
    this.locationsSearchList = newLocations;
  }

  calculateDistance(userPosition) {
    this.locationsList.forEach((location, key)=>{
      location.distance = this.locationsProvider.getDistanceFromLatLonInKm(location.lat, location.lon, userPosition.lat, userPosition.lon);
    });
    this.locationsList.sort(function(a:any, b:any){return a.distance-b.distance});
  }

  ionViewDidLeave() {
    this.searchSubject.complete();
  }

}
