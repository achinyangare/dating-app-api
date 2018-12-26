import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../_models/user.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    baseUrl = environment.apiUrl;

    constructor(private httpClient: HttpClient) {
    }

    getUsers(): Observable<User[]> {
        return this.httpClient.get<User[]>(this.baseUrl + 'users');
    }

    getUser(id: number): Observable<User> {
        return this.httpClient.get<User>(this.baseUrl + 'users/' + id);
    }

    updateUser(id: number, user: User) {
        console.log('We here');
        return this.httpClient.put(this.baseUrl + 'users/' + id, user);
    }
}