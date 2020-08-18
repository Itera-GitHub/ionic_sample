import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HelperProvider } from '../../providers/helper.provider';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileProvider } from '../../providers/profile.provider';

@Component({
  selector: 'profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  profileForm: FormGroup;
  showError: boolean = false;
  emailPattern: string = '(.+)@(.+){2,}\\.(.+){2,}';

  constructor(public navCtrl: NavController
            , public navParams: NavParams
            , public profileService: ProfileProvider
            , public helperService: HelperProvider
            , private formBuilder: FormBuilder) {

    this.profileForm = this.formBuilder.group({
      name:  [''],
      email: [''],
      imei:  [''],
      phone: ['']
    });

    this.profileService.getUser()
      .then((response: any)=>{
        this.profileForm = this.formBuilder.group({
          name:  [response.name],
          imei:  [response.imei],
          email: [response.email, Validators.pattern(this.emailPattern)],
          phone: [response.phone]
        });
      })
      .catch();
  }

  ionViewWillEnter () {
    let pages = this.navCtrl.getViews();
    if(pages.length > 2){
      this.navCtrl.remove(this.navCtrl.getPrevious().index);
    }
  }

  saveForm() {
    if(this.profileForm.valid){
      this.showError = false;
      let formData = Object.assign({}, this.profileForm.value);
      delete formData.imei;
      this.profileService.updateUser(this.profileForm.value)
        .then(()=>{
          this.helperService.presentToastSuccess('Saved');
        })
        .catch();
    } else {
      this.showError = true;
    }
  }

}
