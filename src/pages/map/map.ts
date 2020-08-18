import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { Events, MenuController, NavController, NavParams, Platform } from 'ionic-angular';
import { MapProvider } from '../../providers/map.provider';
import { Storage } from '@ionic/Storage';
import { LocationProvider } from '../../providers/location.provider';
import { Location } from '../../abstracts/interfaces/location';
import { LocationIfoComponent } from '../../components/location-ifo/location-ifo';
import { HelperProvider } from '../../providers/helper.provider';
import { UserPosition } from '../../abstracts/interfaces/userPosition';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  userPosition: UserPosition;
  locationsList: Location[];
  balance: any = {
    balance: 0,
    limitOnce: 0,
    bonus: 0,
    pan: ''
  };

  pageIsLoaded: boolean = false;

  @ViewChild('map_canvas') mapElement: ElementRef;

  @ViewChild(LocationIfoComponent) public locationInfo: LocationIfoComponent;

  constructor(public navCtrl: NavController
              , public navParams: NavParams
              , private menuCtrl: MenuController
              , public mapProvider: MapProvider
              , public locationsProvider: LocationProvider
              , private storage: Storage
              , private zone: NgZone
              , public events: Events
              , private helperService: HelperProvider
              , public platform: Platform) {

    events.subscribe('map:panTo', (location) => {
      this.showLocationDetails(location);
    });
    events.subscribe('map:userPositionUpdate', (userPosition) => {
      this.userPosition = userPosition;
      this.mapProvider.userPosition = this.userPosition;
      this.mapProvider.addUserMarker();
      this.updateLocationsDistance(()=>{});
    });
    events.subscribe('menu:opened', (userPosition) => {
      this.hideInfo();
      this.hideDirections();
    });

    this.helperService.showLoader();

  }

  ionViewWillLeave () {
    this.hideInfo();
    this.hideDirections();
  }

  ionViewDidLoad() {
    this.mapProvider.initializeData(this.mapElement);
    this.getLocations(()=>{
      this.mapProvider.loadGoogleMaps(this.locationsList, () => {
        this.helperService.loading.dismiss();
        this.addMarkersToMap();
      });
    }, () => {
      this.mapProvider.loadGoogleMaps(this.locationsList, () => {
        this.helperService.loading.dismiss();
      });
    });
  }

  hideInfo() {
    this.zone.run(() => {
      this.locationInfo.setToBottom();
      localStorage.setItem('mapPopUpShown', '0');
    });
  }

  updateLocationsDistance(callback) {
    if(this.userPosition && this.locationsList &&  this.userPosition.lat){
      this.locationsList.forEach((location, key)=>{
        location.distance = this.locationsProvider.getDistanceFromLatLonInKm(location.lat, location.lon, this.userPosition.lat, this.userPosition.lon);
      });
      callback();
    }
  }

  findMe() {
    if(this.userPosition){
      this.hideDirections();
      this.mapProvider.panTo(this.userPosition);
    }
    this.hideInfo();
  }

  getLocations(callback, onError) {
    this.locationsProvider.getLocations()
      .then((data: Location[]) => {
        this.locationsList = data;
        if(this.userPosition){
          this.locationsList.forEach((location, key)=>{
            location.distance = this.locationsProvider.getDistanceFromLatLonInKm(location.lat, location.lon, this.userPosition.lat, this.userPosition.lon);
          });
        }
        callback();
      }).catch(error => {
        this.helperService.loading.dismiss();
        onError();
    });
  }

  addMarkersToMap() {
    this.locationsList.forEach((location, key)=>{
      this.mapProvider.addMarker(location, (marker)=>{
        this.zone.run(() => {
          this.showLocationDetails(marker.point);
        });
      });
    });
  }

  showLocationDetails(location: Location){
    this.hideDirections();
    this.locationsProvider.getLocations({locationId: location.id+''})
      .then((locations: Location[]) => {
        if(locations[0]){
          let newLocation = Object.assign({}, locations[0]);
          newLocation.lat = newLocation.lat + 0.0188;
          this.mapProvider.panTo(newLocation, 12);
          this.zone.run(() => {
            this.locationInfo.showModalWindow(locations[0], this.userPosition);
            localStorage.setItem('mapPopUpShown', '1');
          });
        }
      });
  }

  showDirections(location: Location) {
    if(this.userPosition){
      this.hideInfo();
      this.mapProvider.showDirections(this.userPosition, location);
      localStorage.setItem('mapDirectionsShown', '1');
    }
  }

  hideDirections() {
    this.mapProvider.hideDirections();
    localStorage.setItem('mapDirectionsShown', '0');
  }

}
