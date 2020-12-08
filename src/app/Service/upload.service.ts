import { Inject, Injectable } from '@angular/core';
import * as S3 from 'aws-sdk/clients/s3';
import { Observable, of } from 'rxjs';

@Injectable()
class FileUpload {
    name: string;
    url: string;

    constructor(name: string, url: string) {
        this.name = name;
        this.url = url;
    }
    result: any[];
}
export class S3Controller {
    FOLDER = 'Profilevideo';
    BUCKET = 'UserProfile';

    private static getS3Bucket(): any {
        return new S3(
            {
                accessKeyId: 'AKIATGI7CQBJLYUOYTPP',
                secretAccessKey: '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',
                region: 'ap-northeast-1'
            }
        );
    }

    public uploadFile(videoFile) {
        console.log("vedio : ",videoFile);
        const bucket = new S3(
            {
                accessKeyId: 'AKIATGI7CQBJLYUOYTPP',
                secretAccessKey: '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',
                region: 'ap-northeast-1'
            }
        );
        const params = {
            Bucket: this.BUCKET,
            Key: this.FOLDER + videoFile.name,
            Body: videoFile,
            ACL: 'public'
        };

        bucket.upload(params, function (err, data) {
            if (err) {
                console.log('There was an error uploading your file: ', err);
                alert(`There was an error uploading your file. ${err}`);
                return false;
            }
            console.log('Successfully uploaded file.', data);
            alert(`Successfully uploaded file. ${data}`);
            return true;
        });
        // for upload progress   
        /*bucket.upload(params).on('httpUploadProgress', function (evt) {
                  console.log(evt.loaded + ' of ' + evt.total + ' Bytes');
              }).send(function (err, data) {
                  if (err) {
                      console.log('There was an error uploading your file: ', err);
                      return false;
                  }
                  console.log('Successfully uploaded file.', data);
                  return true;
              });*/
    }

    public getFiles(): Observable<Array<FileUpload>> {
        const fileUploads = [];

        const params = {
            Bucket: this.BUCKET,
            Prefix: this.FOLDER
        };

        S3Controller.getS3Bucket().listObjects(params, function (err, data) {
            if (err) {
                console.log('There was an error getting your files: ' + err);
                return;
            }
            console.log('Successfully get files.', data);

            const fileDetails = data.Contents;

            fileDetails.forEach((videoFile) => {
                fileUploads.push(new FileUpload(
                    videoFile.Key,
                    'https://s3.amazonaws.com/' + params.Bucket + '/' + videoFile.Key
                ));
            });
        });

        return of(fileUploads);
    }

    public deleteFile(videoFile: FileUpload) {
        const params = {
            Bucket: this.BUCKET,
            Key: videoFile.name
        };

        S3Controller.getS3Bucket().deleteObject(params, (err, data) => {
            if (err) {
                console.log('There was an error deleting your file: ', err.message);
                return;
            }
            console.log('Successfully deleted file.');
        });
    }
}