import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {User} from '../../_models/user.model';
import {ActivatedRoute} from '@angular/router';
import {AlertifyService} from '../../_services/alertify.service';
import {NgForm} from '@angular/forms';
import {UserService} from '../../_services/user.service';
import {AuthenticationService} from '../../_services/authentication.service';

@Component({
    selector: 'app-member-edit',
    templateUrl: './member-edit.component.html',
    styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {

    user: User;
    photoUrl: string;

    @ViewChild('editForm') editForm: NgForm;

    @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
        if (this.editForm.dirty) {
            $event.returnValue = true;
        }
    }

    constructor(
        private activatedRoute: ActivatedRoute,
        private alertifyService: AlertifyService,
        private userService: UserService,
        private authenticationService: AuthenticationService
    ) {
    }

    ngOnInit() {
        this.activatedRoute.data.subscribe(data => {
            this.user = data['user'];
        });
        this.authenticationService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
    }

    updateUser() {
        this.userService.updateUser(+this.authenticationService.decodedToken.nameid, this.user).subscribe(() => {
            this.alertifyService.success('Profile updated successfully');
            this.editForm.reset(this.user);
        }, error => {
            this.alertifyService.error(error);
        });
    }

    updateMainPhoto(photoUrl: string) {
        this.user.photoUrl = photoUrl;
    }
}
