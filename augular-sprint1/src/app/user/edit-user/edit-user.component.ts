import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Department} from '../../models/department';
import {Role} from '../../models/role';
import {UserDto} from '../../models/user-dto';
import {UserService} from '../user.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {DepartmentService} from '../department.service';
import {RoleService} from '../role.service';
import {ToastrService} from 'ngx-toastr';
import Swal from 'sweetalert2';
import {AngularFireStorage} from '@angular/fire/storage';
import {finalize} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  EMAIL_REGEX: string = '^[a-z]+([\\_\\.]?[a-z\\d]+)*@[a-z]{3,7}\\.[a-z]{2,3}$';
  public updateForm: FormGroup;
  departmentList: Department[];
  roleList: Role[];
  userDto: UserDto;
  id: number;
  department: string;
  role: string;
  errorMessage = '';
  isSuccessful = false;
  isEditFailed = false;
  downloadUrl: Observable<string>;
  temp: any;

  constructor(private userService: UserService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private departmentService: DepartmentService,
              private toastr: ToastrService,
              private roleService: RoleService,
              private storage: AngularFireStorage) {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      this.id = +paramMap.get('id');
    });
  }

  ngOnInit() {
    this.getUser(this.id);
    this.roleService.getAll().subscribe(roles => {
      this.roleList = roles;
    });
    this.departmentService.getAll().subscribe(departments => {
      this.departmentList = departments;
    });
  }

  private getUser(id: number) {
    return this.userService.findById(id).subscribe(user => {
      if (user == null) {
        this.router.navigateByUrl('/404');
      } else {
        this.updateForm = new FormGroup({
          username: new FormControl(user.username),
          name: new FormControl(user.name, [Validators.required, Validators.minLength(6),
            Validators.maxLength(30), Validators.pattern(/^([\p{Lu}][\p{Ll}]{1,8})(\s([\p{Lu}]|[\p{Lu}][\p{Ll}]{1,10})){0,5}$/u)]),
          department: new FormControl(user.department.id, Validators.required),
          roles: new FormControl(user.roles[0].id, Validators.required),
          email: new FormControl(user.email, [Validators.required, Validators.pattern(this.EMAIL_REGEX)]),
        });
      }
    }, error => {
      this.router.navigateByUrl('/403');
    });
  }

  update() {
    const userForm = this.updateForm;
    // @ts-ignore
    this.userDto = {
      roles: userForm.value.roles,
      name: userForm.value.name,
      username: userForm.value.username,
      email: userForm.value.email,
      department: userForm.value.department,
      avatar: this.temp,
    };
    console.log(this.userDto.avatar);
    this.userService.updateUser(this.id, this.userDto).subscribe(() => {
      this.isSuccessful = true;
      this.isEditFailed = false;
      this.showSuccess();
    }, e => {
      this.isEditFailed = true;
      this.showError();
      this.updateForm;
      console.log(e);
    }, () =>
      this.router.navigateByUrl('/nguoi-dung/danh-sach'));
  }

  showSuccess() {
    this.toastr.success('Thành công !', 'Sửa thông tin người dùng.');
  }

  showError() {
    Swal.fire({
      title: 'Sửa thông tin thất bại!',
      text: 'Email đã được sử dụng, vui lòng nhập email khác.',
      icon: 'error',
      confirmButtonText: 'Đóng'
    });
  }

  showPreview(event: any) {
    const dateTime = Date.now();
    const file = event.target.files[0];
    const filePath = `User/${dateTime}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`User/${dateTime}`, file);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadUrl = fileRef.getDownloadURL();
          this.downloadUrl.subscribe(url => {
            if (url) {
              console.log(url);
              this.temp = url;
            }
          });
        })
      )
      .subscribe(() => {
        }
      );
  }
}
