import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalstorageService } from '../Service/localstorage.service';
import { userService } from '../Service/user.service';
import { configService } from '../Service/config.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { VideoPlayer, VideoOptions } from '@ionic-native/video-player/ngx';
import { ModalController, Platform } from '@ionic/angular';
import { S3Controller } from '../Service/upload.service';
import { File } from '@ionic-native/file/ngx';
import { VideoEditor, CreateThumbnailOptions } from '@ionic-native/video-editor/ngx';
declare var cordova: any;
@Component({
    selector: 'app-registration',
    templateUrl: './registration.page.html',
    styleUrls: ['./registration.page.scss'],
    providers: [S3Controller]
})

export class RegistrationPage implements OnInit {
    registerForm: FormGroup;
    options: VideoOptions;
    isshowing: boolean = false;
    profileImg = '../../assets/avatar.jpeg';
    isSubmitted = false;
    datePicker = Date.now();
    userData;
    storageDirectory;

    constructor(private router: Router, private activatedRoute: ActivatedRoute,
        private localStorage: LocalstorageService, private userService: userService, private file: File,
        public formBuilder: FormBuilder, private mediaCapture: MediaCapture, private uploadservice: S3Controller,
        private configService: configService, private videoEditor: VideoEditor, public modalCtrl: ModalController, public platform: Platform) {
        this.userData = {};
        this.platform.ready().then(() => {
            this.storageDirectory = cordova.file.cacheDirectory;
        })
        this.userData.picture = "https://www.flaticon.com/svg/static/icons/svg/147/147144.svg";
        this.userData.phone = this.localStorage.getsingel('phonenumber');
        this.activatedRoute.params.subscribe(params => {
            this.userData.type = params['position'];
            console.log('Url Id: ', this.userData);
        })
        this.options = {
            scalingMode: 0,
            volume: 0.5
        };
        this.registerForm = this.formBuilder.group({
            nick_name: ['', [Validators.required, Validators.minLength(5)]],
            date_of_birth: ['', [Validators.required]],
            phone: [this.userData.phone],
            picture: [this.userData.picture],
            gender: ['', [Validators.required]],
            rating: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.maxLength(3), Validators.max(400)]],
            jobs: ['', [Validators.required]],
            tags: ['', [Validators.required]],
        })
    }

    get errorControl() {
        return this.registerForm.controls;
    }
    ngOnInit() { }
    async startVedio() {
        var filename, filepath;
        var nItem = localStorage.getItem('videoNum');
        var numstr = 0;
        if (nItem == null) {
            numstr = 1;
        }
        else {
            var numstr = parseInt(nItem, 10);
            numstr = numstr + 1;
        }
        let options: CaptureVideoOptions = { duration: 3, quality: 1 }
        this.mediaCapture.captureVideo(options)
            .then(
                async (data: MediaFile[]) => {
                    var path = data[0].fullPath.replace('/private', 'file:///');
                    var option: CreateThumbnailOptions = { fileUri: path.toString(), width: 160, height: 206, atTime: 1, outputFileName: 'sample' + numstr, quality: 50 };
                    const tempImage = await this.videoEditor.createThumbnail(option);
                    const tempFilename = tempImage.substr(tempImage.lastIndexOf('/') + 1);
                    const tempBaseFilesystemPath = tempImage.substr(0, tempImage.lastIndexOf('/') + 1);
                    const newBaseFilesystemPath = this.file.dataDirectory;
                    console.log("file Name : ",tempFilename);
                    console.log("tempBaseFilesystemPath : ",tempBaseFilesystemPath);
                    console.log("newBaseFilesystemPath : ",newBaseFilesystemPath);
                    //SAVE FILE
                    // this.configService.sendTost("danger", data[0].fullPath, "bottom");
                    // this.uploadservice.uploadFile(data[0]);
                },
                (err: CaptureError) => console.error(err)
            );
    }
    next() {
        this.isSubmitted = true;
        if (!this.registerForm.valid) {
            this.configService.sendToast('danger', 'Please provide all the required values!', 'top')
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
}