import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LocalstorageService {

    constructor() { }

    getphonenumber() {
        return localStorage.phonenumber;
    }
    setphonenumber(phonenumber) {
        localStorage.phonenumber = phonenumber;
    }
    removephonenumber() {
        localStorage.removeItem("phonenumber");
    }
}