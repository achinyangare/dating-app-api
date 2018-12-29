import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router} from '@angular/router';
import {User} from '../_models/user.model';
import {UserService} from '../_services/user.service';
import {AlertifyService} from '../_services/alertify.service';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable()
export class MemberListResolver implements Resolve<User[]> {

    pageNumber = 1;
    pageSize = 6;

    constructor(
        private userService: UserService,
        private router: Router,
        private alertifyService: AlertifyService
    ) {
    }

    resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
        return this.userService.getUsers(this.pageNumber, this.pageSize).pipe(
            catchError(error => {
                this.alertifyService.error('Problem retrieving data' + error);
                console.log(error);
                this.router.navigate(['/home']).then();
                return of(null);
            })
        );
    }
}
