import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalstorageService } from '../Service/localstorage.service';
import { userService } from '../Service/user.service';

import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions } from '@ionic-native/media-capture/ngx';

@Component({
    selector: 'app-registration',
    templateUrl: './registration.page.html',
    styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {
    registerForm: FormGroup;
    isshowing: boolean = false;
    file: File;
    profileImg = '../../assets/avatar.jpeg';
    isSubmitted = false;
    datePicker = Date.now();
    userData;

    constructor(private router: Router, private activatedRoute: ActivatedRoute,
        private localStorage: LocalstorageService, private userService: userService,
        public formBuilder: FormBuilder, private mediaCapture: MediaCapture) {
        this.userData = {};
        this.userData.picture = "https://www.flaticon.com/svg/static/icons/svg/147/147144.svg";
        this.userData.phone = this.localStorage.getphonenumber();
        this.activatedRoute.params.subscribe(params => {
            this.userData.type = params['position'];
            console.log('Url Id: ', this.userData);
        })
        this.startVedio();

        this.registerForm = this.formBuilder.group({
            nick_name: ['', [Validators.required, Validators.minLength(5)]],
            date_of_birth: ['', [Validators.required]],
            phone: [this.userData.phone],
            picture: [this.userData.picture],
            gender: ['', [Validators.required]],
            rating: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.maxLength(3)]],
            jobs: ['', [Validators.required]],
            tags: ['', [Validators.required]],
        })
    }

    get errorControl() {
        return this.registerForm.controls;
    }
    ngOnInit() { }
    startVedio() {
        let options: CaptureImageOptions = { limit: 3 }
        this.mediaCapture.captureImage(options)
            .then(
                (data: MediaFile[]) => console.log(data),
                (err: CaptureError) => console.error(err)
            );
    }
    next(userData) {
        this.isSubmitted = true;
        if (!this.registerForm.valid) {
            console.log('Please provide all the required values!')
            return false;
        } else {
            // console.log(this.registerForm.value)
            var userdata = this.registerForm.value;
            userdata.type = this.userData.type;
            this.signup(userdata);
            this.router.navigate(['/register-complete']);
        }
    }
    signup(signuserData) {
        let body = {
            query: 'mutation signup($data:UserRegisterInputType!){signup(data:$data){hasError,message,userErrors,data}}',
            variables: {
                data: signuserData
            }
        }
        this.userService.sendApi(body).subscribe(result => {
            console.log();
            const res = result['data'].signup;
            console.log("Verify Otp : ", res)

            if (!res.hasError) {
                this.router.navigate(['/register-complete']);
            } else {

            }
        }, err => {
            console.log("Somthing Went Wrong")
        });;
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
    fillForm(option) {
        localStorage.setItem('formTitle', option);
        if (option == 'Birth') {
            this.isshowing = true;
        }
        // else {
        //     this.router.navigate(['register-form']);
        // }
    }
    changeDate(dt) {
        console.log(this.datePicker);
    }
}
