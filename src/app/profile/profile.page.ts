import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  file: File;
  profileImg = '../../assets/avatar.jpeg';
  constructor() { }

  ngOnInit() {
  }
  changeListener(event): void {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.profileImg = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]); // to trigger onload
    }

    let fileList: FileList = event.target.files;
    let file: File = fileList[0];
    console.log(file);
  }

}
