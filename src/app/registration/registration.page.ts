import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalstorageService } from '../Service/localstorage.service';
import { userService } from '../Service/user.service';
import { configService } from '../Service/config.service';

import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';

import { S3Controller } from '../Service/upload.service';
import { File } from '@ionic-native/file/ngx';
import { VideoEditor, CreateThumbnailOptions } from '@ionic-native/video-editor/ngx';
@Component({
    selector: 'app-registration',
    templateUrl: './registration.page.html',
    styleUrls: ['./registration.page.scss'],
    providers: [S3Controller]
})

export class RegistrationPage implements OnInit {
    registerForm: FormGroup;
    isshowing: boolean = false;
    profileImg = '../../assets/avatar.jpeg';
    isSubmitted = false;
    datePicker = Date.now();
    userData;
    userEligible: boolean = false;

    constructor(private router: Router, private activatedRoute: ActivatedRoute,
        private localStorage: LocalstorageService, private userService: userService, private file: File,
        public formBuilder: FormBuilder, private mediaCapture: MediaCapture, private uploadservice: S3Controller,
        private configService: configService, private videoEditor: VideoEditor) {
        this.userData = {};

        this.userData.phone = this.localStorage.getsingel('phonenumber');

        this.activatedRoute.params.subscribe(params => {
            this.userData.type = params['position'];
        })

        this.registerForm = this.formBuilder.group({
            nick_name: ['', [Validators.required, Validators.minLength(5)]],
            date_of_birth: ['', [Validators.required]],
            phone: [this.userData.phone],
            gender: ['', [Validators.required]],
            rating: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.maxLength(3), Validators.max(400)]],
            jobs: ['', [Validators.required]],
            tags: ['', [Validators.required]],
        })
    }

    ngOnInit() { }
    get errorControl() {
        return this.registerForm.controls;
    }

    async startVedio() {
        let options: CaptureVideoOptions = { duration: 3, quality: 1 }
        this.mediaCapture.captureVideo(options)
            .then(
                async (data: MediaFile[]) => {
                    var path = data[0].fullPath.replace('/private', 'file:///');
                    const newBaseFilesystemPath = this.file.externalDataDirectory + "files/videos/";
                    const videofilename = path.substr(path.lastIndexOf('/') + 1);
                    const videopath = path.substr(0, path.lastIndexOf('/') + 1);
                    const filename = videofilename.substr(0, videofilename.lastIndexOf('.'));
                    this.file.readAsArrayBuffer(videopath, videofilename).then((body) => {
                        this.uploadservice.uploadFile(body, videofilename, (url) => {
                            this.userData.video = url.Key;
                        });
                    }).catch(err => {
                        console.log('readAsDataURL failed: (' + err.code + ")" + err.message);
                    })

                    var option: CreateThumbnailOptions = { fileUri: path.toString(), width: 160, height: 206, atTime: 1, outputFileName: filename, quality: 50 };
                    const tempImage = await this.videoEditor.createThumbnail(option);
                    const tempFilename = tempImage.substr(tempImage.lastIndexOf('/') + 1);
                    const tempBaseFilesystemPath = tempImage.substr(0, tempImage.lastIndexOf('/') + 1);

                    this.file.readAsArrayBuffer(newBaseFilesystemPath, tempFilename).then((b64str) => {
                        this.uploadservice.uploadFile(b64str, tempFilename, (url) => {
                            this.userData.picture = url.Key;
                            this.profileImg = this.configService.getS3() + url.Key;
                            console.log("Profile Img : ", this.profileImg);
                        });
                    }).catch(err => {
                        console.log('readAsDataURL failed: (' + err.code + ")" + err.message);
                    })
                },
                (err: CaptureError) => console.error(err)
            );
    }
    next() {
        this.isSubmitted = true;
        if (!this.registerForm.valid) {
            this.configService.sendToast('danger', 'Please provide all the required values!', 'top')
            return false;
        } else if (!this.userEligible) {
            this.configService.sendToast('danger', 'You are not eligible now.', 'top');
            return false;
        } else {
            if (this.userData.picture) {
                var userdata = this.registerForm.value;
                userdata.type = this.userData.type;
                userdata.picture = this.userData.picture;
                userdata.video = this.userData.video;
                console.log("UserData : ", userdata);
                this.signup(userdata);
            }
            else {
                this.configService.sendToast('danger', 'Please Select Image', 'bottom')
            }
            // this.router.navigate(['/register-complete']);
        }
    }
    signup(signuserData) {
        const mutation = {
            name: 'signup',
            inputtype: 'UserRegisterInputType',
            data: signuserData
        }
        this.userService.sendApi(mutation).subscribe(result => {
            const res = result['data'].signup;

            if (!res.hasError) {
                this.router.navigate(['/register-complete']);
            } else {

            }
        }, err => {
            console.log("Somthing Went Wrong")
            this.configService.sendToast('danger', 'Please Fill Up All Field', 'bottom');
        });;
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
    calculateAge() {
        var bdate = this.registerForm.value.date_of_birth;
        var dobDate = new Date(bdate);
        const todayDate = new Date();
        var age = todayDate.getFullYear() - dobDate.getFullYear();
        if (age < 18) {
            this.configService.sendToast('danger', 'You are not eligible now.', 'top');
            this.userEligible = false;
        } else {
            this.userEligible = true;
        }
    }
}