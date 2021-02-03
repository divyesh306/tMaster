import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { configService } from '../Service/config.service';
import { LocalstorageService } from '../Service/localstorage.service';
import { userService } from '../Service/user.service';
import * as firebase from 'firebase';
import { chats } from '../Service/chat.service';
import { LoadingService } from '../Service/loading.service';

@Component({
  selector: 'app-video-detail',
  templateUrl: './video-detail.page.html',
  styleUrls: ['./video-detail.page.scss'],
})
export class VideoDetailPage implements OnInit {
  // @Input() video:string = "";
  userDetail;
  s3Url;
  video: HTMLMediaElement;
  userData;
  usersList = [];
  currentUserIndex: number;
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: userService,
    private loading: LoadingService,
    private localStorage: LocalstorageService,
    private configService: configService,
    private chatService: chats,
    private navCtrl: NavController,
    public elRef: ElementRef,) {

    this.activatedRoute.params.subscribe(params => {
      // this.userId.type = params['userId'];
    })
    this.s3Url = this.configService.getS3();
    this.userDetail = this.localStorage.get('selectedUser');

    this.usersList = this.localStorage.get('categoryUser');
    this.userData = this.localStorage.get('userDetail'); // User Detail
    this.video = this.s3Url + this.userDetail.video;
  }

  addFavorite() {
    const mutation = {
      name: 'add_to_favorite_user',
      inputtype: 'AddFavoriteUserInputType',
      data: { favorite_user: this.userDetail._id, type: 'favorite' },
    }
    this.loading.present();
    this.userService.CloseApi(mutation).subscribe(result => {
      const res = result['data'].add_to_favorite_user;
      this.loading.dismiss();
      if (!res.hasError) {
        this.configService.sendToast('success', 'This User Add As a Favorite', 'bottom');
      } else { }
    }, err => {
      this.loading.dismiss();
      this.configService.sendToast("danger", "Something Went Wrong" + err, "bottom");
    });
  }

  onSwipeLeft($event) {
    this.currentUserIndex = this.usersList.findIndex(x => x.id == this.userDetail.id);
    console.log(this.currentUserIndex);
    if (this.currentUserIndex != 0 && this.currentUserIndex < this.usersList.length) {
      this.userDetail = this.usersList[this.currentUserIndex - 1];
      this.video = this.elRef.nativeElement.querySelector('#myVideo');
      this.video.src = this.s3Url + this.userDetail.video;
    }
  }

  onSwipeRight($event) {
    this.currentUserIndex = this.usersList.findIndex(x => x.id == this.userDetail.id);
    console.log(this.currentUserIndex);
    if (this.currentUserIndex + 1 < this.usersList.length) {
      this.userDetail = this.usersList[this.currentUserIndex + 1];
      this.video = this.elRef.nativeElement.querySelector('#myVideo');
      this.video.src = this.s3Url + this.userDetail.video;
    }
  }
  calculateAge(bdate) {
    var dobDate = new Date(bdate);
    const todayDate = new Date();
    return todayDate.getFullYear() - dobDate.getFullYear();
  }

  backHangout() {
    this.localStorage.remove('selectedUser');
    // this.router.navigate(['tabs/profile']);
    this.navCtrl.back();
  }

  ngOnInit() {
  }

  createroom() {
    const mutation = {
      name: 'create_rooms',
      inputtype: 'CreateRoomInputType',
      data: {
        'receiver_id': this.userDetail.id
      }
    }
    this.loading.present();
    this.userService.CloseApi(mutation).subscribe(result => {
      const res = result['data'].create_rooms;
      this.loading.dismiss();
      if (!res.hasError) {
        const data = {
          roomname: res.data.room_id
        };
        const room = this.chatService.createRoom(data);
        const mutation = {
          name: 'update_rooms',
          inputtype: 'UpdateRoomInputType',
          data: {
            'id': res.data.id,
            'receiver_id': res.data.receiver_id,
            'room_id': res.data.room_id,
            'room_key': room.ref.key,
          }
        }
        this.loading.present();
        this.userService.CloseApi(mutation).subscribe(result => {
          const res = result['data'].update_rooms;
          this.loading.dismiss();
          if (!res.hasError) {
            let newData = firebase.database().ref('chatroom/' + res.data.room_key + '/chats').push();
            newData.set({
              type: 'message',
              user: this.userData.nick_name,
              message: 'hello',
              sendDate: Date()
            });
          }
        }, err => {
          this.loading.dismiss();
          this.configService.sendToast("danger", "Something Went Wrong" + err, "bottom");
        });
        this.configService.sendToast('success', 'Room Created', 'bottom');
      } else {
        this.configService.sendToast('success', 'You Sent message this user before', 'bottom');
      }
    }, err => {
      this.configService.sendToast("danger", "Something Went Wrong" + err, "bottom");
    });
  }

}
