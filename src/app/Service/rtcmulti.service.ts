import { Component } from '@angular/core';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Platform } from '@ionic/angular';

declare var RTCMultiConnection;

export class HomePage {
    connection: any;
    socket: any;
    constructor(private diagnostic: Diagnostic, private platform: Platform) {
        this.socket.on('1', (data) => { alert('Data'); console.log('data', data); })
    }

}