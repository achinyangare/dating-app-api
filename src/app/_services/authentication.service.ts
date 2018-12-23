import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    baseUrl = 'http://localhost:5000/api/authentication/'

    constructor(private httpClient: HttpClient) { }

    login(model: any) {
        return this.httpClient.post(this.baseUrl + 'login', model).pipe(
            map((response: any) => {
                const user = response;
                if (user) {
                    localStorage.setItem('token', user.token);
                }
            })
        );
    }
}
