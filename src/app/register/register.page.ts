import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoadingController, ToastController, IonContent } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Router } from '@angular/router';
import { Device } from '@ionic-native/device/ngx';
import { FCM } from "cordova-plugin-fcm-with-dependecy-updated/ionic/ngx"
import { Platform } from '@ionic/angular';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  @ViewChild(IonContent, {read: IonContent, static: true}) myContent: IonContent;
  urlapi = "https://birborsaci.net/api/registration.php";
  urlapiprivacy = "https://www.birborsaci.net";
  lusername:string = '';
  lusermail:string = '';
  lpassword:string = '';
  privacy = 'notchecked';
  privacyControl = 'notchecked';
  response={};
  responsePlaces:any =[];
  isLoading = false;
  deviceID:string = '0';
  fcmtoken:string = '0';
  platformname:string;

  options : InAppBrowserOptions = {
    location : 'no',//Or 'no' 
    hidden : 'no', //Or  'yes'
    clearcache : 'yes',
    clearsessioncache : 'yes',
    zoom : 'no',//Android only ,shows browser zoom controls 
    hardwareback : 'yes',
    mediaPlaybackRequiresUserAction : 'no',
    shouldPauseOnSuspend : 'no', //Android only 
    closebuttoncaption : 'Close', //iOS only
    disallowoverscroll : 'no', //iOS only 
    toolbar : 'no', //iOS only 
    enableViewportScale : 'no', //iOS only 
    allowInlineMediaPlayback : 'no',//iOS only 
    presentationstyle : 'pagesheet',//iOS only 
    fullscreen : 'yes',//Windows only    
};

  constructor(private device: Device, private iab: InAppBrowser, public platform: Platform, private fcm: FCM, public http: HttpClient, private loadingctrl: LoadingController, private nativeStorage: NativeStorage, private toastCtrl: ToastController, private router: Router) { }

  async present() {
    this.isLoading = true;
    return await this.loadingctrl.create({
      duration: 5000,
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


  ngOnInit() {
   
    this.getfcmtoken();
  }

  async presentToast(mesage,time) {
    const toast = await this.toastCtrl.create({
      message: mesage,
      duration: time,
      position: 'top',
    });
    toast.present();
  }

   registration(){
     console.log('bilgiler:' +
     'kadi :' + this.lusername,
     'mail :' + this.lusermail,
     'pass :' + this.lpassword
     
     )
   }
   SendDataFu(){
    this.SendDataFu1();
   }
   privacyChaced(){
    if(this.privacyControl == 'checked'){
      this.privacyControl = 'notchecked';
      console.log('notchecked');
      this.presentToast('Üye Olmak için Sözleşmeyi Onaylamalısınız..!',1000);
    }else{
     this.privacyControl = 'notchecked';
     this.privacyControl = 'checked';
     console.log('checked');
    
    }
     }
     goPrivacy(){
     // const browser = this.iab.create(this.urlapiprivacy,'_blank',{location:'no', zoom:'no'}); 
   // browser.show();
   let target = "_system";
   this.iab.create(this.urlapiprivacy,target,this.options);
   
    }
  

   SendDataFu1(){
    this.presentToast('Bilgiler Kontrol Ediliyor..',1000);
    

    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json' );
    //headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE');
    //headers.append('Access-Control-Allow-Headers', 'origin, x-requested-with');
 

    this.deviceID = this.device.uuid;
   
    if(this.platform.is('android')){
    this.platformname = 'android';
    }
    if(this.platform.is('ios')){
      this.platformname = 'ios';
      }
  


    let postData =  {
     username: this.lusername,
     usermail: this.lusermail,
     password: this.lpassword,
     deviceid: this.deviceID,
     fcmtoken: this.fcmtoken,
     platforname: this.platformname
 }
 console.log('Posted : ' + JSON.stringify(postData));
 //console.log('Device UUID is: ' + this.device.uuid);
if( this.lpassword == '' || this.lusermail == '' || this.lusername == '' ||  this.privacyControl == 'notchecked' ){
  if(this.privacyControl == 'notchecked'){
    this.presentToast('Kullanım Sözleşmesini Kabul Etmeniz Gerekmektedir', 6000);
  }else{
    this.presentToast('Lütfen İstenilen Bilgileri Doğru Bir Şekilde Giriniz…', 6000);
  }
  
}else{
  this.present();
 //fcmtest
 if(this.fcmtoken != ''){
  this.http.post(this.urlapi,postData,{observe: 'response'})
  .subscribe(data => {
  //  this.response = JSON.stringify(data);
    this.response = data['body']['code'];
    console.log('Response code: ' + this.response);

     if( this.response == 'done'){
      this.dismiss();
      this.setStoreddata(data['body']['res'],this.lusername,this.lusermail);
      this.presentToast('Kayıt İşlemi Tamamlandı..',2000);
      this.router.navigateByUrl('/control');
     }
     if( this.response == 'already'){
      this.dismiss();
      this.presentToast('Mail Adresi İle Kayıtlı Hesap Mevcut. Mail Adresi Size Ait ise Giriş Yapınız...',6000);
     }
     if( this.response == 'deviceexist'){
      this.dismiss();
      this.presentToast('Bir Cihaz İle Birden Çok Üyelik Açılamaz...',6000);
     }
     if( this.response == 'nouser'){
      this.dismiss();
      this.presentToast('Kulllanıcı Bilgisi Hatası.. Lütfen Terar Deneyiniz...',6000);
     }
     if( this.response == 'usernameexist'){
      this.dismiss();
      this.presentToast('Kulllanıcı Adı Bir Kullanıcı Tarafından Kullanılmakta',6000);
     }
     if( this.response == 'mailformat'){
      this.dismiss();
      this.presentToast('Mail Adresinizin Formatı Hatalı..! ',6000);
     }
     if( this.response == 'SqlEr'){
      this.dismiss();
      let mesaj = 'Kayıt Sırasında Hata Oluştu!! Lütfen Tekrar Deneyiniz.';
      this.presentToast(mesaj,6000);
      console.log(data['body']['res']);
     }
     if( this.response == 'warn'){
      this.dismiss();
      let mesaj = data['body']['res'];
      this.presentToast(mesaj,6000);
     }
   
   }, error => {
    console.log(error);
  });
 }else{
  this.refreshfcmtoken();
 }
//fcm test
}
  }

  getfcmtoken(){
    //this.presentToast('FCM Kaydı Alınıyor..',1000);
   // this.present();
    this.fcm.getToken().then(token => {
      console.log(token);
      this.fcmtoken = token;
     // this.dismiss();
      //this.SendDataFu1();
    });
  }
  refreshfcmtoken(){
    this.fcm.onTokenRefresh().subscribe(token => {
      console.log(token);
      this.fcmtoken = token;
      this.SendDataFu1();
    });
  }
  setStoreddata(unicid,username,usermail){
    this.nativeStorage.setItem('myitem', {userid: unicid, username: username, usermail: usermail})
  .then(
    () => console.log('Stored User!'),
    error => console.error('Error storing item', error)
  );
  }
  onFocus() {
    //var contn = document.querySelector('ion-content');
    //contn.scrollToBottom(500);
    console.log('scroll:');
    this.myContent.scrollToBottom(300);
  }
  scollTop(){
    this.myContent.scrollToTop(300);
  }
}
