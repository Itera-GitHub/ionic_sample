import { HttpClient } from '@angular/common/http';
import { ToastController, LoadingController, AlertController, NavController } from 'ionic-angular';
import { Injectable } from '@angular/core';

@Injectable()
export class HelperProvider {
  loading: any;
  alert: any;

  constructor(public http: HttpClient
              , private toastService: ToastController
              , private loadingCtrl: LoadingController
              , public alertController: AlertController) {

  }

  checkPagesInStack(navCtrl, page: string) {
    let pages = navCtrl.getViews();
    for(let i in pages){
      if(pages[i].component.name == page){
        return true;
      }
    }
    return false;
  }

  presentToastError(msg) {
    let toast = this.toastService.create({
      message: msg,
      duration: 2000,
      position: 'bottom',
      cssClass: 'error-toast',
    });
    toast.present();
  }

  presentToastSuccess(msg) {
    let toast = this.toastService.create({
      message: msg,
      duration: 2000,
      position: 'bottom',
      cssClass: 'success-toast',
      dismissOnPageChange: true
    });
    toast.present();
  }

  async presentAlertConfirm(text, onClose, styleClass = '') {
    this.alert = await this.alertController.create({
      message: text,
      cssClass: styleClass,
      buttons: [ {
          text: 'OK',
          role: 'cancel',
          handler: () => {
            onClose();
          }
        }
      ]
    });

    await this.alert.present();
  }

  async presentAlertAsk(text, onConfirm, onCancel, onClose) {
    this.alert = await this.alertController.create({
      message: text,
      buttons: [
        {
          text: 'Yes',
          cssClass: 'small-btn',
          handler: () => {
            onConfirm();
          }
        },
        {
          text: 'No',
          cssClass: 'small-btn',
          handler: () => {
            onCancel();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'small-btn',
          handler: (blah) => {
            onClose();
            this.loading.dismiss();
          }
        },
      ]
    });

    await this.alert.present();
  }

  showLoader(){
    this.loading = this.loadingCtrl.create({
      content: 'Loading...'
    });

    this.loading.present();
  }

}
