import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../_models/user.model';
import {map} from 'rxjs/operators';
import {PaginatedResult} from '../_models/paginated-result.model';
import {UserParams} from '../_models/user-params.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    baseUrl = environment.apiUrl;

    constructor(private httpClient: HttpClient) {
    }

    getUsers(page?, itemsPerPage?, userParams?: UserParams): Observable<PaginatedResult<User[]>> {
        const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();
        let params = new HttpParams();
        if (page != null && itemsPerPage != null) {
            params = params.append('pageNumber', page);
            params = params.append('pageSize', itemsPerPage);
        }

        if (userParams != null) {
            params = params.append('minAge', userParams.minAge.toString());
            params = params.append('maxAge', userParams.maxAge.toString());
            params = params.append('gender', userParams.gender);
            params = params.append('orderBy', userParams.orderBy);
        }

        console.log(params);

        return this.httpClient.get<User[]>(this.baseUrl + 'users', {observe: 'response', params}).pipe(
            map(response => {
                paginatedResult.result = response.body;
                if (response.headers.get('Pagination') != null) {
                    paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
                }
                return paginatedResult;
            })
        );
    }

    getUser(id: number): Observable<User> {
        return this.httpClient.get<User>(this.baseUrl + 'users/' + id);
    }

    updateUser(id: number, user: User) {
        console.log('We here');
        return this.httpClient.put(this.baseUrl + 'users/' + id, user);
    }

    setMainPhoto(userId: number, id: number) {
        return this.httpClient.post(this.baseUrl + 'users/' + userId + '/photos/' + id + '/setMain', {});
    }

    deletePhoto(userId: number, id: number) {
        return this.httpClient.delete(this.baseUrl + 'users/' + userId + '/photos/' + id);
    }
}
