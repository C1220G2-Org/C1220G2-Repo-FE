import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserPassword} from '../../models/user-password';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {UserService} from '../user.service';
import Swal from 'sweetalert2';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  public changePasswordForm: FormGroup;
  userPassword: UserPassword;
  id: number;
  errorMessage = '';
  isSuccessful = false;
  isSignUpFailed = false;

  constructor(private activatedRoute: ActivatedRoute,
              private userService: UserService,
              private toastService: ToastrService,
              private router: Router,
  ) {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      this.id = +paramMap.get('id');
    });
  }

  ngOnInit() {
    this.changePasswordForm = new FormGroup({
      oldPassword: new FormControl('', [Validators.required, Validators.minLength(6),
        Validators.maxLength(30)]),
      pwGroup: new FormGroup({
        password: new FormControl('', [Validators.required, Validators.minLength(6),
          Validators.maxLength(30)]),
        confirmPassword: new FormControl('')
      }, {validators: this.comparePassword}),
    });
  }

  comparePassword(c: AbstractControl) {
    const v = c.value;
    return (v.password === v.confirmPassword) ?
      null : {
        passwordNotMatch: true
      };
  }

  submit() {
    const passwordForm = this.changePasswordForm;
    // @ts-ignore
    this.userPassword = {
      oldPassword: passwordForm.value.oldPassword,
      newPassword: passwordForm.value.pwGroup.password
    };
    this.userService.changePassword(this.id, this.userPassword).subscribe(() => {
      this.isSuccessful = true;
      this.isSignUpFailed = false;
      this.showSuccess();
    }, e => {
      this.isSignUpFailed = true;
      this.showError();
      console.log(e);
    }, () =>
      this.router.navigateByUrl(''));
  }

  get getPassword() {
    return this.changePasswordForm.get('pwGroup')?.get('password');
  }

  get pwGroup() {
    return this.changePasswordForm.get('pwGroup');
  }

  showSuccess() {
    this.toastService.success('Th??nh c??ng !', '?????i m???t kh???u ');
  }

  showError() {
    Swal.fire({
      title: '?????i m???t kh???u th???t b???i!',
      text: 'M???t kh???u c?? kh??ng ????ng',
      icon: 'error',
      confirmButtonText: '????ng'
    });
  }
}
