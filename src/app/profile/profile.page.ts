import { Component, OnInit } from '@angular/core';
import { LocalstorageService } from '../Service/localstorage.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { userService } from '../Service/user.service';
import { configService } from '../Service/config.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  registerForm: FormGroup;
  isSubmitted = false;
  file: File;
  profileImg = '../../assets/avatar.jpeg';
  userDetail;
  constructor(private localstorage: LocalstorageService, private userService: userService, public formBuilder: FormBuilder, private configService: configService) {
    this.userDetail = localStorage.getItem('userDetail');
    console.log(this.userDetail);
    if(this.userDetail !=null){
    this.registerForm = this.formBuilder.group({
      nick_name: [this.userDetail.nick_name, [Validators.required, Validators.minLength(5)]],
      date_of_birth: [this.userDetail.date_of_birth, [Validators.required]],
      picture: [this.userDetail.picture],
      gender: [this.userDetail.gender, [Validators.required]],
      rating: [this.userDetail.rating.toString(), [Validators.required, Validators.pattern('^[0-9]+$'), Validators.maxLength(3), Validators.max(400)]],
      jobs: [this.userDetail.jobs, [Validators.required]],
      tags: [this.userDetail.tags, [Validators.required]],
      type: [this.userDetail.type, [Validators.required]]
    });
  }
  }

  get errorControl() {
    return this.registerForm.controls;
  }
  next() {
    this.isSubmitted = true;
    if (!this.registerForm.valid) {
      this.configService.sendToast('danger', 'Please provide all the required values!', 'top')
      return false;
    } else {
      var userdata = this.registerForm.value;
      console.log("user Detail : ", userdata);
      this.signup(userdata);
    }
  }

  signup(signuserData) {
    const mutation = {
      name: 'update_profile',
      inputtype: 'UserRegisterInputType',
      data: signuserData
    }
    this.userService.CloseApi(mutation).subscribe(result => {
      const res = result['data'].update_profile;

      if (!res.hasError) {
        this.localstorage.set('userDetail',res.data);
        this.configService.sendToast('success','Profile Updated','bottom');
      } else {

      }
    }, err => {
      console.log("Somthing Went Wrong")
    });
  }

  fillForm(option) {
    localStorage.setItem('formTitle', option);
    if (option == 'Birth') {
      // this.isshowing = true;
    }
    // else {
    //     this.router.navigate(['register-form']);
    // }
  }

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