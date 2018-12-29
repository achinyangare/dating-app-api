import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../_services/authentication.service';
import {AlertifyService} from '../_services/alertify.service';
import {Router} from '@angular/router';
import {LoginUser} from '../_models/login-user.model';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

    photoUrl: string;
    loginUser: LoginUser = new LoginUser();

    constructor(
        private router: Router,
        private alertifyService: AlertifyService,
        public authenticationService: AuthenticationService
    ) {
    }

    ngOnInit() {
        this.authenticationService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
    }

    login() {
        this.authenticationService.login(this.loginUser).subscribe(
            () => {
                this.alertifyService.success('Logged in successfully');
            }, error => {
                this.alertifyService.error(error);
            }, () => {
                this.router.navigate(['/members']).then();
            });
    }

    loggedIn() {
        return this.authenticationService.loggedIn();
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.authenticationService.decodedToken = null;
        this.authenticationService.currentUser = null;
        this.alertifyService.message('logged out');
        this.router.navigate(['/home']).then();
    }
}
