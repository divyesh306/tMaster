import { Inject, Injectable } from '@angular/core';
import S3 from 'aws-sdk/clients/s3';
import { Observable, of } from 'rxjs';
import { environment } from './enviroment';

@Injectable()
class FileUpload {
    name: String;
    url: String;

    constructor(name: String, url: String) {
        this.name = name;
        this.url = url;
    }
    result: any[];
}
export class S3Controller {
    FOLDER = 'Profilevideo/';
    BUCKET = environment.bucketName;

    private static getS3Bucket(): any {
        return new S3(
            {
                accessKeyId: environment.accessKeyId,
                secretAccessKey: environment.secretAccessKey,
                region: environment.region
            }
        );
    }

    public uploadFile(videoFile, filename, callback) {
        const bucket = new S3(
            {
                accessKeyId: environment.accessKeyId,
                secretAccessKey: environment.secretAccessKey,
                region: environment.region
            }
        );
        const params = {
            Bucket: this.BUCKET,
            Key: this.FOLDER + filename,
            Body: videoFile
        };
        bucket.upload(params, function (err, data) {
            if (err) {
                console.log('There was an error uploading your file: ', err);
                return false;
            }
            callback(data);
            return true;
        });
    }

    public getFiles(): Observable<Array<FileUpload>> {
        const fileUploads = [];
        const params = {
            Bucket: this.BUCKET
        };

        S3Controller.getS3Bucket().listObjects(params, function (err, data) {
            if (err) {
                console.log('There was an error getting your files: ' + err);
                return;
            }
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