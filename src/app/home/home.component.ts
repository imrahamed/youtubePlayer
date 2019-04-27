import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isVisible = false;
  isConfirmLoading = false;
  model: any = {};
  data = [];
  currentIndex = 0;
  id = '5q5GKQnqgjs';
  player: any;

  constructor(private router: Router, private notification: NzNotificationService) { }

  ngOnInit() {
    if (localStorage.getItem('libray')) {
      this.data = JSON.parse(localStorage.getItem('libray'))
    }
  }
  logOut() {
    localStorage.removeItem('userData');
    this.router.navigateByUrl('/login');
  }

  setIndex(i) {
    this.currentIndex = i;
  }
  currentVideo(){
    return this.data[this.currentIndex];
  }

  getId() {
    if (this.data[this.currentIndex])
      return this.data[this.currentIndex].id;
  }

  playvideo(id) {
    this.player.loadVideoById(id);
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isConfirmLoading = true;
    const id = this.matchYoutubeUrl(this.model.url);
    if (this.model && id) {
      this.isVisible = false;
      this.isConfirmLoading = false;
      this.data.push({
        model: this.model,
        id: id
      });
      localStorage.setItem('libray', JSON.stringify(this.data));
      this.model = {};
    } else {
      this.isConfirmLoading = false;
      this.notification.create(
        'error',
        'Invalid Entry',
        'Enter Valid Entry'
      );
    }
  }

  handleCancel(): void {
    this.isVisible = false;
  }
  matchYoutubeUrl(url) {
    var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    if (url.match(p)) {
      return url.match(p)[1];
    }
    return false;
  }

  deleteEntry(i) {
    console.log(i);
    this.data.splice(i, 1);
    localStorage.setItem('libray', JSON.stringify(this.data));
    if (this.player) this.player.stopVideo()
    this.currentIndex = 0;
    this.playvideo(this.data[this.currentIndex].id);
    
  }
  playEntry(i) {
    this.currentIndex = i;
    if (this.data[this.currentIndex]) {
      if (!this.data[this.currentIndex].views) this.data[this.currentIndex].views = 0;
      this.data[this.currentIndex].views += 1;
      localStorage.setItem('libray', JSON.stringify(this.data));
      this.playvideo(this.data[this.currentIndex].id);
    }
  }
  savePlayer(player) {
    console.log('player instance', player);
    this.player = player;
    player.playVideo();
    if(!this.data[this.currentIndex].views) this.data[this.currentIndex].views = 0;
    this.data[this.currentIndex].views += 1;
    localStorage.setItem('libray', JSON.stringify(this.data));
  }
  onStateChange(event) {
    console.log('player state', event.data, this.data[this.currentIndex + 1]);
    if (event.data === 0) {
      if (this.data[this.currentIndex + 1]) {
        this.currentIndex = this.currentIndex + 1;
        this.playvideo(this.data[this.currentIndex].id);
        if (!this.data[this.currentIndex].views) this.data[this.currentIndex].views = 0;
        this.data[this.currentIndex].views += 1;
        console.log(this.data[this.currentIndex]);
        localStorage.setItem('libray', JSON.stringify(this.data));
      } else {
        if (this.player) this.player.stopVideo()
      }
    }
  }
  isAllViews (){
    return (this.data.length && !this.data.find(d => {return !d.views}));
  }
}
