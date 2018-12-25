import {Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {MemberListComponent} from './member-list/member-list.component';
import {MessagesComponent} from './messages/messages.component';
import {ListsComponent} from './lists/lists.component';
import {AuthenticationGuard} from './_guards/authentication.guard';

export const AppRoutes: Routes = [
    { path: '', component: HomeComponent },
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [AuthenticationGuard],
        children: [
            { path: 'members', component: MemberListComponent },
            { path: 'messages', component: MessagesComponent },
            { path: 'lists', component: ListsComponent }
        ]
    },
    { path: '**', redirectTo: '', pathMatch: 'full' },
];

