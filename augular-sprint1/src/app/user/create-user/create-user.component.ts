import {Component, OnInit} from '@angular/core';
import {DepartmentService} from '../department.service';
import {Department} from '../../models/department';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {Role} from '../../models/role';
import {RoleService} from '../role.service';
import {UserService} from '../user.service';
import {UserDto} from '../../models/user-dto';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  EMAIL_REGEX: string = '^[a-z]+([\\_\\.]?[a-z\\d]+)*@[a-z]{3,7}\\.[a-z]{2,3}$';
  USERNAME_REGEX: string = '^[a-z0-9.]*$';
  public register: FormGroup;
  departmentList: Department[];
  roleList: Role[];
  user: UserDto;
  errorMessage = '';
  isSuccessful = false;
  isSignUpFailed = false;

  constructor(private departmentService: DepartmentService,
              private roleService: RoleService,
              private userService: UserService,
              private toastService: ToastrService,
              private router: Router,
  ) {
  }

  ngOnInit() {
    this.register = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(6),
        Validators.maxLength(50), Validators.pattern(this.USERNAME_REGEX)]),
      pwGroup: new FormGroup({
        password: new FormControl('', [Validators.required, Validators.minLength(6),
          Validators.maxLength(30)]),
        confirmPassword: new FormControl('')
      }, {validators: this.comparePassword}),
      name: new FormControl('', [Validators.required, Validators.minLength(6),
        Validators.maxLength(30), Validators.pattern(/^([\p{Lu}][\p{Ll}]{1,8})(\s([\p{Lu}]|[\p{Lu}][\p{Ll}]{1,10})){0,5}$/u)]),
      department: new FormControl('', Validators.required),
      role: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.pattern(this.EMAIL_REGEX)]),
    });
    this.departmentService.getAll().subscribe(departments => {
      this.departmentList = departments;
    });
    this.roleService.getAll().subscribe(roles => {
      this.roleList = roles;
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
    const userForm = this.register;
    // @ts-ignore
    this.user = {
      roles: userForm.value.role,
      name: userForm.value.name,
      password: userForm.value.pwGroup.password,
      username: userForm.value.username,
      email: userForm.value.email,
      department: userForm.value.department
    };
    console.log(this.user);
    this.userService.saveUser(this.user).subscribe(() => {
      this.isSuccessful = true;
      this.isSignUpFailed = false;
      this.showSuccess();
    }, e => {
      this.isSignUpFailed = true;
      this.register.reset();
      this.showError();
      console.log(e);
    }, () =>
      this.router.navigateByUrl('/nguoi-dung/danh-sach'));
  }

  get getPassword() {
    // @ts-ignore
    return this.register.get('pwGroup')?.get('password');
  }

  get pwGroup() {
    // @ts-ignore
    return this.register.get('pwGroup');
  }

  showSuccess() {
    this.toastService.success('Thành công !', 'Thêm mới người dùng');
  }

  showError() {
    Swal.fire({
      title: 'Tên đăng nhập hoặc email đã tồn tại !',
      text: 'Vui lòng nhập tên đăng nhập hoặc email khác.',
      icon: 'error',
      confirmButtonText: 'Đóng'
    });
  }
}
