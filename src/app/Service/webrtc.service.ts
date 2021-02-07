import { Injectable } from '@angular/core';
import Peer from 'peerjs';
import { LocalstorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class WebrtcService {
  private _peer: Peer;
  private _localStream: any;
  private _existingCall: any;

  myEl: HTMLMediaElement;
  otherEl: HTMLMediaElement;
  onCalling: Function;
  userDetail;
  stun = 'stun.l.google.com:19302';
  mediaConnection: Peer.MediaConnection;
  options: Peer.PeerJSOption;
  stunServer: RTCIceServer = {
    urls: 'stun:' + this.stun,
  };

  constructor(private localStorage: LocalstorageService) {
    navigator.getUserMedia = navigator.getUserMedia;
    this.userDetail = this.localStorage.get('userDetail');
  }
  createPeer(userId: string) {
    this._peer = new Peer(userId, this.getPeerJSOption());
  }
  getPeerJSOption(): Peer.PeerJSOption {
    return {
      key: this.userDetail.firebase_user_id,
      debug: 3,
      secure: false,
      config: {
        iceServers: [
          this.stunServer
        ]
      }
    }
  }
  async init(myEl: HTMLMediaElement, otherEl: HTMLMediaElement, onCalling: Function) {
    this.myEl = myEl;
    this.otherEl = otherEl;
    this.onCalling = onCalling;
    this._peer.on('call', (call) => {
      console.log(this._peer);
      call.answer(this._localStream);
      this._step3(call);
    });
    this._peer.on('error', (err) => {
      console.log(err.message);
      if (this.onCalling) {
        this.onCalling();
      }
    });
    this._step1();
  }
  call(otherUserId: string) {
    var call = this._peer.call(otherUserId, this._localStream);
    this._step3(call);
  }

  endCall() {
    this._existingCall.close();
    if (this.onCalling) {
      this.onCalling();
    }
  }

  private _step1() {
    // Get audio/video stream
    navigator.getUserMedia({ audio: true, video: true }, (stream) => {
      console.log(stream);
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

  private _step3(call) {
    // Hang up on an existing call if present
    if (this._existingCall) {
      this._existingCall.close();
    }

    // Wait for stream on the call, then set peer video display
    call.on('stream', (stream) => {
      this.otherEl.src = URL.createObjectURL(stream);
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
  }

}
