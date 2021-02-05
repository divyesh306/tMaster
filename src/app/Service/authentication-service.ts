import { Injectable, NgZone } from '@angular/core';
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";

@Injectable({
    providedIn: 'root'
})

export class AuthenticationService {
    userData: any;

    constructor(
        public ngFireAuth: AngularFireAuth,
        public router: Router,
        public ngZone: NgZone) {
    }

    // Login in with email/password
    SignIn(email, password) {
        return this.ngFireAuth.signInWithEmailAndPassword(email, password)
    }

    // Register user with email/password
    RegisterUser(email, password) {
        return this.ngFireAuth.createUserWithEmailAndPassword(email, password)
    }

    // Sign-out 
    SignOut() {
        return this.ngFireAuth.signOut().then(() => {
            // localStorage.removeItem('user');
        })
    }

}