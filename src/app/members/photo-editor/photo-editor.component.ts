import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Photo} from '../../_models/photo.model';
import {FileUploader} from 'ng2-file-upload';
import {environment} from '../../../environments/environment';
import {AuthenticationService} from '../../_services/authentication.service';
import {UserService} from '../../_services/user.service';
import {AlertifyService} from '../../_services/alertify.service';

@Component({
    selector: 'app-photo-editor',
    templateUrl: './photo-editor.component.html',
    styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {

    @Input() photos: Photo[];
    @Output() getMemberPhotoChange = new EventEmitter<string>();
    uploader: FileUploader;
    hasBaseDropZoneOver = false;
    baseUrl = environment.apiUrl;
    currentMainPhoto: Photo;

    constructor(
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertifyService: AlertifyService
    ) {
    }

    ngOnInit() {
        this.initializeUploader();
    }

    fileOverBase(e: any): void {
        this.hasBaseDropZoneOver = e;
    }

    initializeUploader() {
        this.uploader = new FileUploader({
            url: this.baseUrl + 'users/' + this.authenticationService.decodedToken.nameid + '/photos',
            authToken: 'Bearer ' + localStorage.getItem('token'),
            isHTML5: true,
            allowedFileType: ['image'],
            removeAfterUpload: true,
            autoUpload: false,
            maxFileSize: 10 * 1024 * 1024
        });
        this.uploader.onAfterAddingFile = (file) => {
            file.withCredentials = false;
        };

        this.uploader.onSuccessItem = (item, response, status, headers) => {
            if (response) {
                const apiResponse: Photo = JSON.parse(response);
                const photo = {
                    id: apiResponse.id,
                    url: apiResponse.url,
                    dateAdded: apiResponse.dateAdded,
                    description: apiResponse.description,
                    isMain: apiResponse.isMain
                };

                this.photos.push(photo);
            }
        };
    }

    setMainPhoto(photo: Photo) {
        this.userService.setMainPhoto(+this.authenticationService.decodedToken.nameid, photo.id).subscribe(response => {
            this.currentMainPhoto = this.photos.filter(p => p.isMain === true)[0];
            this.currentMainPhoto.isMain = false;
            photo.isMain = true;
            this.authenticationService.changeMemberPhoto(photo.url);
            this.authenticationService.currentUser.photoUrl = photo.url;
            localStorage.setItem('user', JSON.stringify(this.authenticationService.currentUser));
        }, error => {
            this.alertifyService.error(error);
        });
    }

    deletePhoto(id: number) {
        this.alertifyService.confirm('Are you sure you want to delte this photo?', () => {
            this.userService.deletePhoto(+this.authenticationService.decodedToken.nameid, id).subscribe(() => {
                this.photos.splice(this.photos.findIndex(p => p.id === id), 1);
                this.alertifyService.success('Photo has been deleted');
            }, error => {
                this.alertifyService.error(error);
            });
        });
    }
}
