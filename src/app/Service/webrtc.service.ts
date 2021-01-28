import { Injectable } from '@angular/core';
import Peer, { PeerJSOption } from 'peerjs';

@Injectable({
  providedIn: 'root'
})
export class WebrtcService {
  private _peer: Peer;
  private _localStream: any;
  private _existingCall: any;

  myEl: HTMLMediaElement;
  partnerEl: HTMLMediaElement;
  onCalling: Function;
  stun: string = 'stun.l.google.com:19302';

  stunServer: RTCIceServer = {
    urls: 'stun:' + this.stun
  };

  audio: boolean = true;
  video: boolean = false;
  constructor() {
  }

  createPeer(userId: string) {
    // Create the Peer object where we create and receive connections.
    this._peer = new Peer(userId, this.getPeerJSOption());
  }
  getPeerJSOption(): PeerJSOption {
    return {
      key: 'cd1ft79ro8g833di',
      debug: 3
    };
  }

  getMediaStreamConstraints(): MediaStreamConstraints {
    return <MediaStreamConstraints>{
      audio: this.audio,
      video: this.video
    }
  }
  init(myEl: HTMLMediaElement, partnerEl: HTMLMediaElement, onCalling: Function) {
    this.myEl = myEl;
    this.partnerEl = partnerEl;
    this.onCalling = onCalling;

    // Receiving a call
    this._peer.on('call', (call) => {
      // Answer the call automatically (instead of prompting user) for demo purposes
      call.answer(this._localStream);
      this._step3(call);
    });
    this._peer.on('error', (err) => {
      console.log(err.message);
      // Return to step 2 if error occurs
      if (this.onCalling) {
        this.onCalling();
      }
      // this._step2();
    });

    this._step1();
  }

  call(otherUserId: string) {
    // Initiate a call!
    var call = this._peer.call(otherUserId, this._localStream);

    this._step3(call);
  }

  endCall() {
    this._existingCall.close();
    // this._step2();
    if (this.onCalling) {
      this.onCalling();
    }
  }

  private _step1() {
    // Get audio/video stream
    navigator.getUserMedia({ audio: true, video: true }, (stream) => {
      // Set your video displays
      this.myEl.src = URL.createObjectURL(stream);

      this._localStream = stream;
      // this._step2();
      if (this.onCalling) {
        this.onCalling();
      }
    }, (error) => {
      console.log(error);
    });
  }

  // private _step2() {
  //     console.log('Hide Step1, Step3. Show Step2');
  //     //   $('#_step1, #_step3').hide();
  //     //   $('#_step2').show();
  // }

  private _step3(call) {
    // Hang up on an existing call if present
    if (this._existingCall) {
      this._existingCall.close();
    }

    // Wait for stream on the call, then set peer video display
    call.on('stream', (stream) => {
      this.partnerEl.src = URL.createObjectURL(stream);
    });

    // UI stuff
    this._existingCall = call;
    // $('#their-id').text(call.peer);
    call.on('close', () => {
      // this._step2();
      if (this.onCalling) {
        this.onCalling();
      }
    });
    // $('#_step1, #_step2').hide();
    // $('#_step3').show();
  }
  errorMsg(msg: string, error?: any) {
    const errorElement = document.querySelector('#errorMsg');
    errorElement.innerHTML += `<p>${msg}</p>`;
    if (typeof error !== 'undefined') {
      console.error(error);
    }
  }
}
