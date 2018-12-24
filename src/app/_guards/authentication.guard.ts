import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthenticationService} from '../_services/authentication.service';
import {AlertifyService} from '../_services/alertify.service';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

    constructor(
        private router: Router,
        private alertifyService: AlertifyService,
        private authenticationService: AuthenticationService
    ) {
    }

    canActivate(): boolean {
        if (this.authenticationService.loggedIn())  {
            return true;
        }

        this.alertifyService.error('You shall not pass!!!');
        this.router.navigate(['/home']);
        return false;
    }
}
