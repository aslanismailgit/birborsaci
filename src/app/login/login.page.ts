import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoadingController, ToastController } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Router } from '@angular/router';
//import { FCM } from '@ionic-native/fcm/ngx';
import { FCM } from "cordova-plugin-fcm-with-dependecy-updated/ionic/ngx"
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  lusermail:string;
  lpassword:string;
  fcmtoken:string = '0';
  response={};
  isLoading = false;
  urlapi = "https://birborsaci.net/api/logon.php";
  constructor(public platform: Platform, private fcm: FCM, public http: HttpClient, private loadingctrl: LoadingController, private nativeStorage: NativeStorage, private toastCtrl: ToastController, private router: Router) { }

  ngOnInit() {
    
   // this.dellStoreddata();
    this.getfcmtoken();
 
  }

  dellStoreddata(){
    this.nativeStorage.clear();
    //this.username = '';
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
  getfcmtoken(){
    //this.presentToast('FCM Kaydı Alınıyor..',1000);
   // this.present();
   this.platform.ready().then(() => {
    this.fcm.getToken().then(token => {
      console.log(token);
      this.fcmtoken = token;
     // this.dismiss();
      //this.SendDataFu1();
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
      position: 'top',
    });
    toast.present();
  }

  SendDataFu(){
    this.presentToast('Bilgiler Kontrol Ediliyor…',1000);
    this.present();

    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json' );
 
    //headers.append("Content-Security-Policy", "script-src 'self'");
   



    let postData =  {
     usermail: this.lusermail,
     password: this.lpassword,
     fcmtoken: this.fcmtoken
 }
 console.log('Posted : ' + JSON.stringify(postData));
 //console.log('Device UUID is: ' + this.device.uuid);

  this.http.post(this.urlapi, postData,{observe: 'response'})
  .subscribe(data => {
  //  this.response = JSON.stringify(data);
    this.response = data['body']['code'];
    console.log('Response code: ' + this.response);
    console.log('All: ' + JSON.stringify(data));

     if( this.response == 'done'){
      this.dismiss();
      this.setStoreddata(data['body']['usercode'],data['body']['username'],this.lusermail,data['body']['yetki']);

      //this.presentToast('Oturum İşlemi Tamamlandı...',2000);
      this.router.navigateByUrl('/control');
     }
     if( this.response == 'nousserr'){
      this.dismiss();
      this.presentToast('Mail Adresi Hatalı!',6000);
     }
     if( this.response == 'passerr'){
      this.dismiss();
      this.presentToast('Parola Hatalı!',6000);
     }
   
     if( this.response == 'SqlEr'){
      this.dismiss();
      let mesaj =  'Sql Err:' + data['body']['res'];
      this.presentToast(mesaj,6000);
     }
   
   }, error => {
    console.log(error);
  });
  }
 
 setStoreddata(unicid,username,usermail,yetki){
  this.nativeStorage.setItem('myitem', {userid: unicid, username: username, usermail: usermail, yetki: yetki})
.then(
  () => console.log('Stored User!'),
  error => console.error('Error storing item', error)
);
}


}
