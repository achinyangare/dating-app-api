import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt';
import {environment} from '../../environments/environment';
import {User} from '../_models/user.model';
import {DecodedToken} from '../_models/decoded-token.model';
import {BehaviorSubject} from 'rxjs';
import {LoginUser} from '../_models/login-user.model';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    baseUrl = environment.apiUrl + 'authentication/';
    jwtHelperService = new JwtHelperService();
    decodedToken: DecodedToken;
    currentUser: User;
    photoUrl = new BehaviorSubject<string>('../../assets/user.png');
    currentPhotoUrl = this.photoUrl.asObservable();

    constructor(private httpClient: HttpClient) { }

    changeMemberPhoto(photoUrl: string) {
        this.photoUrl.next(photoUrl);
    }

    login(loginUser: LoginUser) {
        console.log('in ServiceLogin');
        console.log(loginUser);
        return this.httpClient.post(this.baseUrl + 'login', loginUser).pipe(
            map((response: any) => {
                const localUser = response;
                if (localUser) {
                    localStorage.setItem('token', localUser.token);
                    localStorage.setItem('user', JSON.stringify(localUser.user));
                    this.decodedToken = this.jwtHelperService.decodeToken(localUser.token);
                    this.currentUser = localUser.user;
                    this.changeMemberPhoto(this.currentUser.photoUrl);
                }
            })
        );
    }

    register(user: User) {
        return this.httpClient.post(this.baseUrl + 'register', user);
    }

    loggedIn() {
        const token = localStorage.getItem('token');
        return !this.jwtHelperService.isTokenExpired(token);
    }
}
