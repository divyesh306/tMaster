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
  incomingCallId:any;
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
    console.log("Peer : ",this._peer);
  }
  getPeerJSOption(): Peer.PeerJSOption {
    return {
      debug: 0,
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
      console.log("On Calling : ", this._peer);
      call.answer(this._localStream);
      this._step3(call);
    });
    this._peer.on('error', (err) => {
      console.log("Create Peer Error : ", err);
      if (this.onCalling) {
        this.onCalling();
      }
    });
    this._step1();
  }
  
  call(otherUserId: string) {
    console.log("otherUserId Data : ", otherUserId);
    var call = this._peer.call(otherUserId, this._localStream);
    this.incomingCallId = call;
    console.log("Calling Data : ", call);
    this._step3(call);
  }

  endCall() {
    this._peer.disconnect();
    this._existingCall.close();
    if (this.onCalling) {
      this.onCalling();
    }
  }

  AnswerCall(incomingCallId) {
    this._peer.connect(incomingCallId);
    // this.nativeAudio.stop('uniqueI1').then(() => { }, () => { });

    // this.UpdateControlsOnAnswer();
  }

  private _step1() {
    // Get audio/video stream
    navigator.getUserMedia({ audio: true, video: true }, (stream) => {
      console.log("Streaming : ", stream);
      // Set your video displays
      this.myEl.srcObject = stream;

      this._localStream = stream;
      // this._step2();
      if (this.onCalling) {
        this.onCalling();
      }
    }, (error) => {
      console.log("step 1 : ", error);
    });
  }

  private _step3(call) {
    // Hang up on an existing call if present
    if (this._existingCall) {
      this._existingCall.close();
    }

    // Wait for stream on the call, then set peer video display
    call.on('stream', (stream) => {
      this.otherEl.srcObject = stream;
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
