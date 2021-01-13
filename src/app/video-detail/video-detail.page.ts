import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { chats } from '../Service/chat.service';
import { configService } from '../Service/config.service';
import { LocalstorageService } from '../Service/localstorage.service';
import { userService } from '../Service/user.service';

@Component({
  selector: 'app-video-detail',
  templateUrl: './video-detail.page.html',
  styleUrls: ['./video-detail.page.scss'],
})
export class VideoDetailPage implements OnInit {

  userDetail;
  s3Url;
  constructor(private activatedRoute: ActivatedRoute, private router: Router, private userService: userService,
    private localStorage: LocalstorageService, private configService: configService, private chatService: chats) {
    this.activatedRoute.params.subscribe(params => {
      // this.userId.type = params['userId'];
      // console.log('Url Id: ', this.userId);
    })
    this.s3Url = this.configService.getS3();
    this.userDetail = this.localStorage.get('selectedUser');
    console.log("Selected User ", this.userDetail);
  }

  calculateAge(bdate) {
    var dobDate = new Date(bdate);
    var todayDate = new Date();
    var ageyear = todayDate.getFullYear() - dobDate.getFullYear();
    return ageyear;
  }
  backHangout() {
    this.localStorage.remove('selectedUser');
    this.router.navigate(['tabs/hangout']);
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
    this.userService.CloseApi(mutation).subscribe(result => {
      const res = result['data'].create_rooms;

      if (!res.hasError) {
        console.log(res)
        const data = {
          roomname: res.data.room_id
        };
        const room = this.chatService.createRoom(data);
        console.log("Add Room : ", room.ref.key);
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
        this.userService.CloseApi(mutation).subscribe(result => {
          const res = result['data'].update_rooms;
          console.log("Response : ", res);
          if (!res.hasError) {

          }
        }, err => {
          console.log("Somthing Went Wrong")
        });
        this.configService.sendToast('success', 'Room Created', 'bottom');
      } else {

      }
    }, err => {
      console.log("Somthing Went Wrong")
    });
  }

}
