import {Component, OnInit} from '@angular/core';
import {User} from '../../_models/user.model';
import {UserService} from '../../_services/user.service';
import {AlertifyService} from '../../_services/alertify.service';
import {ActivatedRoute} from '@angular/router';
import {Pagination} from '../../_models/pagination.model';
import {PageChangedEvent} from 'ngx-bootstrap';
import {PaginatedResult} from '../../_models/paginated-result.model';
import {UserParams} from '../../_models/user-params.model';

@Component({
    selector: 'app-member-list',
    templateUrl: './member-list.component.html',
    styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

    users: User[];
    pagination: Pagination;
    userParams: UserParams = new UserParams();
    user: User = JSON.parse(localStorage.getItem('user'));
    genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Females'}];

    constructor(
        private userService: UserService,
        private alertifyService: AlertifyService,
        private activatedRoute: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.activatedRoute.data.subscribe(data => {
            this.users = data['users'].result;
            this.pagination = data['users'].pagination;
        });

        this.userParams.gender = this.user.gender === 'female' ? 'male' : 'female';
        this.userParams.minAge = 18;
        this.userParams.maxAge = 99;
        this.userParams.orderBy = 'lastActive';
    }

    resetFilters() {
        this.userParams.gender = this.user.gender === 'female' ? 'male' : 'female';
        this.userParams.minAge = 18;
        this.userParams.maxAge = 99;
        this.loadUsers();
    }

    loadUsers() {
        this.userService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams).subscribe(
            (response: PaginatedResult<User[]>) => {
                this.users = response.result;
                this.pagination = response.pagination;
            }, error => {
                this.alertifyService.error(error);
            });
    }

    pageChanged(event: PageChangedEvent) {
        this.pagination.currentPage = event.page;
        this.loadUsers();
    }
}
