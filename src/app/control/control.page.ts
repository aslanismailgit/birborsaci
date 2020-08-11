import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { HttpClient } from '@angular/common/http';
import { LoadingController, ToastController, NavController  } from '@ionic/angular';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';



@Component({
  selector: 'app-control',
  templateUrl: './control.page.html',
  styleUrls: ['./control.page.scss'],
})
export class ControlPage implements OnInit {
  userdata = {};
  username:string;
  unicid:string;
  isLoading = false;
  curentgues:Number = 0;
  progrescolor = 'progress__value_yellow';
  buttoncolor = 'warning';
  get_tahmin = "https://www.birborsaci.net/api/get_tahmin.php";
  save_tahmin= "https://www.birborsaci.net/api/save_tahmin.php";
  response = {};
  response_save = {};
  response_gues:number;
  urlapiprivacy = "https://www.birborsaci.net";
  screenmesage :string;
  loader = true;
  options : InAppBrowserOptions = {
    location : 'yes',//Or 'no' 
    hidden : 'no', //Or  'yes'
    clearcache : 'yes',
    clearsessioncache : 'yes',
    zoom : 'yes',//Android only ,shows browser zoom controls 
    hardwareback : 'yes',
    mediaPlaybackRequiresUserAction : 'no',
    shouldPauseOnSuspend : 'no', //Android only 
    closebuttoncaption : 'Close', //iOS only
    disallowoverscroll : 'no', //iOS only 
    toolbar : 'yes', //iOS only 
    enableViewportScale : 'no', //iOS only 
    allowInlineMediaPlayback : 'no',//iOS only 
    presentationstyle : 'pagesheet',//iOS only 
    fullscreen : 'yes',//Windows only    
};
  radius = 54;
  circumference = 2 * Math.PI * this.radius;
  dashoffset: number;
  constructor(public http: HttpClient, private loadingctrl: LoadingController, public navctrl :NavController,  private toastCtrl: ToastController, private nativeStorage: NativeStorage, private router: Router, private iab: InAppBrowser) { 
    this.progress(0);
  }

  ngOnInit() {
    //this.present();
    this.getStoreddata();
  }
  private progress(value: number) {
    const progress = value / 100;
    this.dashoffset = this.circumference * (1 - progress);
  }
  ionViewDidLoad(){
   // this.getStoreddata();
  }

  setBadge(gues){
    this.curentgues = gues;
    this.progress(gues);
    if(gues == 0){
      this.progrescolor = 'progress__value_yellow';
      this.buttoncolor = 'warning';
    }else{
      if(gues > 0){
        this.progrescolor = 'progress__value_green';
        this.buttoncolor = 'success';
      }else{
        this.progrescolor = 'progress__value_red';
        this.buttoncolor = 'danger';
      }
    }
    
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
      // this.dismiss();
      // this.goTabs();
      this.screenmesage = this.username ;
      this.getTahminData();
     }, (error) => {
       console.log(error);
     //  this.dismiss();
       this.goIntro();
      this.screenmesage = "Üye kaydınız yok.. " ;
     });
   }


   getTahminData(){
    this.presentToast('Bilgiler Kontrol Ediliyor..',1000);
 
    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json' );
    let postData =  {
      unicid: this.unicid
 }
 console.log('Posted : ' + JSON.stringify(postData));
  this.http.post(this.get_tahmin,postData,{observe: 'response'})
  .subscribe(data => {
   // this.response = JSON.stringify(data);
    this.response = data['body']['code'];
    this.response_gues = data['body']['tahmin'];
    console.log('Response code: ' + this.response);
    console.log('in: ' + JSON.stringify(this.response));
     
    if( this.response == 1){
     // this.dismiss();
      this.presentToast('Tahmin Yapmışsınız. Devam edebilirsiniz.',2000);
      this.router.navigateByUrl('/control');
      this.curentgues = this.response_gues;
     }
     if( this.response == 0){
     // this.dismiss();
      this.presentToast('Lütfen Tahmin Giriniz..',6000);
     }
    
   }, error => {
    console.log('Tahmin Err : ' +  JSON.stringify(error));
  });

  }


  

  goLogin(){
    this.router.navigateByUrl('/login');
  }
  goRegister(){
    this.router.navigateByUrl('/register');
  }
  goIntro(){
    this.router.navigateByUrl('/interview');
  }
  goTabs(){
    //this.router.navigateByUrl('/tabs');
    this.router.navigate(['/tabs/tab1']);
  }

  saveGuest(){
    this.presentToast('Beklenti kaydediliyor....',1000);
 
    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json' );
    let postData =  {
      unicid: this.unicid,
      tahmin: this.curentgues
 }
 console.log('Posted Guest: ' + JSON.stringify(postData));
  this.http.post(this.save_tahmin,postData,{observe: 'response'})
  .subscribe(data => {
   // this.response = JSON.stringify(data);
   this.response_save = data['body']['code'];
    console.log('Response code Save: ' + data['body']['code']);
     
    if( this.response_save == 'ok'){
      //this.dismiss();
      this.goTabs();
      this.presentToast('Beklenti kaydedildi..',3000);
     }else{
      //this.dismiss();
      this.presentToast('Beklenti kaydedilemedi..!' ,6000);
     }

   }, error => {
    console.log('Tahmin Kayıt Err : ' +  JSON.stringify(error));
  });

  }

  goPrivacy(){
    // const browser = this.iab.create(this.urlapiprivacy,'_blank',{location:'no', zoom:'no'}); 
  // browser.show();
  let target = "_system";
  this.iab.create(this.urlapiprivacy,target,this.options);
  
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
