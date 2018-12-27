import {Component, OnInit} from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import {AuthenticationService} from './_services/authentication.service';
import {User} from './_models/user.model';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    jwtHelperService = new JwtHelperService();

    constructor(private authenticationService: AuthenticationService) {}

    ngOnInit(): void {
        const token = localStorage.getItem('token');
        const user: User = JSON.parse(localStorage.getItem('user'));
        if (token) {
            this.authenticationService.decodedToken = this.jwtHelperService.decodeToken(token);
        }
        if (user) {
            this.authenticationService.currentUser = user;
            this.authenticationService.changeMemberPhoto(user.photoUrl);
        }
    }
}
