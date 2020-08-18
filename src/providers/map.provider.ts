import { Injectable, NgZone } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { HelperProvider } from './helper.provider';
import { Location } from '../abstracts/interfaces/location';
import { UserPosition } from '../abstracts/interfaces/userPosition';
import { Storage } from '@ionic/Storage';
import { Events } from 'ionic-angular';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import { UserLocationProvider } from './user-location';

declare var google;

@Injectable()
export class MapProvider {

  apiKey: string = '123456789';
  map: any;
  markers: Array<any> = [];
  mapElement: any;
  mapReady: boolean = false;
  directionsShown: boolean = false;

  directionsService;
  directionsDisplay;
  geocoder;
  userPosition;
  userMarker;

  constructor(public geolocation: Geolocation
              , private helperService: HelperProvider
              , private storage: Storage
              , public events: Events
              , public userPositionService: UserLocationProvider
              , private zone: NgZone) {

  }

  initializeData(mapElement) {
    this.mapElement = mapElement;
  }

  loadGoogleMaps(locationsList, callback){
    if(typeof google == "undefined" || typeof google.maps == "undefined"){
      //Load the SDK
      window['mapInit'] = () => {
        this.createMap(locationsList, callback);
        this.userPositionService.getCurrentPosition();
      };
      let script = document.createElement("script");
      script.id = "googleMaps";
      script.src = 'https://maps.googleapis.com/maps/api/js?key=' + this.apiKey + '&callback=mapInit';
      document.body.appendChild(script);
    } else {
      this.createMap(locationsList, callback);
      this.userPositionService.getCurrentPosition();
    }
  }

  createMap(locationsList, callback){
    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer;
    this.geocoder          = new google.maps.Geocoder();
    let center = this.getMapCenter(locationsList);
    let params:any = {
      zoom: 10,
      center: center,
      disableDefaultUI: true,
      tilt: 0,
      zoomControl: false,
      mapTypeId: 'roadmap',
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, params);
    this.directionsDisplay.setMap(this.map);
    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      this.mapReady = true;
      this.addUserMarker();
      callback();
    });
  }

  addUserMarker() {
    if(this.userPosition && this.userPosition.lat && this.mapReady){
      this.zone.run(()=>{
        if(this.userMarker){
          this.userMarker.setPosition(new google.maps.LatLng(this.userPosition.lat, this.userPosition.lng));
        } else {
          this.userMarker = this.addMarker(this.userPosition, ()=>{}, 'assets/imgs/ico-user-pin.png');
          this.panTo(this.userPosition);
        }
      });
    }
  }

  getMapCenter(locationsList) {
    let center;
    if(this.userPosition && this.userPosition.lat){
      center = this.userPosition;
    } else {
      center = {
        lat: locationsList[0].lat,
        lon: locationsList[0].lon,
        lng: locationsList[0].lon,
      };
    }
    return center;
  }

  panTo(point, zoom: number = 14) {
    this.map.panTo(new google.maps.LatLng(point.lat, point.lon));
    this.map.setZoom(zoom);
  }

  showDirections(position: UserPosition, location: Location) {
    if(!position) return;
    this.directionsService.route({
      origin: new google.maps.LatLng(position.lat, position.lon),
      destination: new google.maps.LatLng(location.lat, location.lon),
      travelMode: 'WALKING'
    }, (response, status) => {
      if (status === 'OK') {
        this.zone.run(() => {
          this.directionsShown = true;
        });
        this.directionsDisplay.setDirections(response);
        this.directionsDisplay.setOptions( { polylineOptions: { strokeColor: "#4e7e18" }, suppressMarkers: true } );
      } else {
        this.helperService.presentToastError('Directions request failed due to ' + status);
      }
    });
  }

  hideDirections(){
    this.directionsDisplay.setDirections({routes: []});
    this.zone.run(() => {
      this.directionsShown = false;
    });
  }

  addMarker(point, onClick, iconHref: string = ''){
    let icon = {
      url: iconHref == '' ? 'assets/imgs/car_wash-512.png' : iconHref,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    };

    let marker = new google.maps.Marker({
      map: this.map,
      point: point,
      position: new google.maps.LatLng(point.lat, point.lon),
      icon: icon
    });
    this.markers.push(marker);
    google.maps.event.addListener(marker, 'click', () => {
      onClick(marker);
    });
    return marker;
  }

}
