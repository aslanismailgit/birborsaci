import { Component } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { HttpClient } from '@angular/common/http';
import { LoadingController, ToastController, NavController  } from '@ionic/angular';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  userdata = {};
  username:string;
  unicid:string;
  xsite:number;
  xsite_yes:number;
  xsite_fark:number;
  xsite_user:number;
  totaluser:number;
  xsite_user_zero:number;
  isLoading = false;
  get_xsites = "https://www.birborsaci.net/api/get_xsites.php";
  response_xiste :any =[];
  direction = 'horizontal';
  horizontalText = '';
  constructor(public http: HttpClient, private loadingctrl: LoadingController, public navctrl :NavController,  private toastCtrl: ToastController, private nativeStorage: NativeStorage, private router: Router) {}

  ngOnInit() {
    //this.present();
    this.getStoreddata();
    setTimeout(() => {
      this.horizontalText = `this is the text to show that text could be refreshed. 
      but this feature support horizontal scroll only!`;
    }, 5000);
  
  }

  getStoreddata(){
    //this.present()
     this.nativeStorage.getItem('myitem')
   .then((data) => {
     this.userdata = {
       userid: data.userid,
       username: data.username,
       usermail: data.usermail
     };
     this.unicid = data.userid;
     this.username = data.username
       console.log(data);
       this.getXsiteData();
      // this.dismiss();

     }, (error) => {
       console.log(error);
      // this.dismiss();
     });
   }


   
   getXsiteData(){
    this.present();
    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json' );
    let postData =  {
      unicid: this.unicid
 }
 console.log('Posted : ' + JSON.stringify(postData));
 /* this.http.post(this.get_xsites,postData,{observe: 'response'})
  .subscribe(data => {*/
    this.http.post(this.get_xsites, postData).pipe(map(res => res ))
    .subscribe(data => {
    this.response_xiste = data;
    console.log('xsitess: ' + JSON.stringify(this.response_xiste));
    this.xsite = this.response_xiste[0]['xsite'];
    this.xsite_yes = this.response_xiste[0]['xsite_yes'];
    this.xsite_user = this.response_xiste[0]['tahmin_count'];
    this.xsite_user_zero = this.response_xiste[0]['tahmin_countzero'];
    this.totaluser = this.response_xiste[0]['totaluser'];
    this.xsite_fark = ((this.xsite)-(this.xsite_yes));
    this.dismiss();
 
   }, error => {
    this.dismiss();
    console.log('xsitess : ' +  JSON.stringify(error));
  });

  }


 async present() {
    this.isLoading = true;
    return await this.loadingctrl.create({
      spinner: 'dots',
      duration: 5000,
      cssClass:'loaderCss',
    }).then(a => {
      a.present().then(() => {
        console.log('presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }
  async dismiss() {
    this.isLoading = false;
    return await this.loadingctrl.dismiss().then(() => console.log('dismissed'));
  }
  async presentToast(mesage,time) {
    const toast = await this.toastCtrl.create({
      message: mesage,
      duration: time,
      position: 'bottom',
    });
    toast.present();
  }
}

