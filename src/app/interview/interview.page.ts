import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-interview',
  templateUrl: './interview.page.html',
  styleUrls: ['./interview.page.scss'],
})
export class InterviewPage implements OnInit {
  slideOptions = {
    initialSlide: 0,
    loop: false,
    speed: 400,
    effect: 'flip',
    pagination: {
      el: '.swiper-pagination',
      clickable: true   
    }
  };
  constructor(private router: Router) { }

  ngOnInit() {
  }
  goLogin(){
    this.router.navigateByUrl('/login');
  }
  goRegister(){
    this.router.navigateByUrl('/register');
  }
}
