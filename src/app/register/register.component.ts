import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthenticationService} from '../_services/authentication.service';
import {AlertifyService} from '../_services/alertify.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsDatepickerConfig} from 'ngx-bootstrap';
import {User} from '../_models/user.model';
import {Router} from '@angular/router';
import {LoginUser} from '../_models/login-user.model';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

    @Output() cancelRegister = new EventEmitter<boolean>();
    registerForm: FormGroup;
    user: User = new User();
    loginUser: LoginUser = new LoginUser();
    bsConfig: Partial<BsDatepickerConfig>;

    constructor(
        private authenticationService: AuthenticationService,
        private alertifyService: AlertifyService,
        private formBuilder: FormBuilder,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.bsConfig = {
            containerClass: 'theme-red'
        };
        this.createRegistrationForm();
        // this.registerForm = new FormGroup({
        //     username: new FormControl('', Validators.required),
        //     password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
        //     confirmPassword: new FormControl('', Validators.required)
        // }, this.confirmPasswordValidator);
    }

    createRegistrationForm() {
        this.registerForm = this.formBuilder.group({
            gender: ['male'],
            username: ['', Validators.required],
            knownAs: ['', Validators.required],
            dateOfBirth: [null, Validators.required],
            city: ['', Validators.required],
            country: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
            confirmPassword: ['', Validators.required]
        }, {validator: this.confirmPasswordValidator});
    }

    register() {
        if (this.registerForm.valid) {
            this.user = Object.assign({}, this.registerForm.value);
            this.updateLoginUser(this.user);
            this.authenticationService.register(this.user).subscribe(() => {
                this.alertifyService.success('Registration successful');
            }, error => {
                this.alertifyService.error(error);
            }, () => {
                console.log('Trying to login');
                this.authenticationService.login(this.loginUser).subscribe(() => {
                    this.router.navigate(['/members']).then();
                });
            });
        }
        // this.authenticationService.register(this.loginUser).subscribe(
        //     () => {
        //         this.alertifyService.success('registration successful');
        //     }, error => {
        //         this.alertifyService.error(error);
        //     }
        // );
    }

    updateLoginUser(user: User) {
        this.loginUser.username = user.username;
    }

    cancel() {
        this.cancelRegister.emit(false);
    }

    confirmPasswordValidator(formGroup: FormGroup) {
        return formGroup.get('password').value === formGroup.get('confirmPassword').value ? null : {'mismatch': true};
    }
}
