import { Injectable } from '@angular/core';
import { File } from "@ionic-native/file/ngx";
import { FileTransfer, FileTransferObject } from "@ionic-native/file-transfer/ngx";
import { FileOpener } from "@ionic-native/file-opener/ngx";

@Injectable({
  providedIn: 'root'
})
export class FileViewerService {
  fileTransfer: FileTransferObject;
  constructor(
    private fileOpener: FileOpener,
    private transfer: FileTransfer,
    private file: File
  ) { }

  download(url: string, title: string) {
    this.fileTransfer = this.transfer.create();
    this.fileTransfer
      .download(url, this.file.dataDirectory + title)
      .then(entry => {
        let fileExtn = entry.toURL().split('.').reverse()[0];
        let fileMIMEType = this.getMIMEtype(fileExtn);
        this.fileOpener
          .open(entry.toURL(), fileMIMEType)
          .then(() => console.log("File is opened"))
          .catch(e => console.log("Error opening file", e));
      });
  }

  getMIMEtype(extn) {
    let ext = extn.toLowerCase();
    let MIMETypes = {
      'm4a' : 'audio/mpeg',
      'wav' : 'audio/wav',
      'weba' : 'audio/webm',
      'webm' : 'video/webm',
      'oga' : 'audio/ogg',
      'ogv' : 'video/ogg',
      'mid' : 'audio/midi',
      'midi' : 'audio/midi',
      'mp3' : 'audio/mpeg',
      'mpeg' : 'video/mpeg',
      'mp4' : 'video/mpeg',
      'avi' : 'video/x-msvideo',
      'txt': 'text/plain',
      '3gp' : 'video/3gpp',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'doc': 'application/msword',
      'pdf': 'application/pdf',
      'jpg': 'image/jpeg',
      'bmp': 'image/bmp',
      'png': 'image/png',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'rtf': 'application/rtf',
      'ppt': 'application/vnd.ms-powerpoint',
      'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    }
    return MIMETypes[ext];
  }
}
