import {Component, OnInit} from '@angular/core';
import {TokenStorageService} from '../token-storage.service';
import {UserDto} from '../../models/user-dto';
import {UserService} from '../user.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../../models/user';
import {finalize} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {DepartmentService} from '../department.service';
import {ToastrService} from 'ngx-toastr';
import {RoleService} from '../role.service';
import {AngularFireStorage} from '@angular/fire/storage';
import Swal from 'sweetalert2';
import {NgxSpinnerService} from 'ngx-bootstrap-spinner';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    downloadUrl: Observable<string>;
    userDto: User;
    public informationForm: FormGroup;
    avatarTemp: any;
    id: number;
    role: number;

    constructor(private token: TokenStorageService,
                private userService: UserService,
                private router: Router,
                private toastService: ToastrService,
                private activatedRoute: ActivatedRoute,
                private departmentService: DepartmentService,
                private roleService: RoleService,
                private storage: AngularFireStorage,
                private spinner: NgxSpinnerService) {
        this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
            this.id = +paramMap.get('id');
        });
    }

    ngOnInit(): void {
        this.getUser();
    }

    private getUser() {
        return this.userService.findById(this.id).subscribe(user => {
            if (user == null) {
                this.router.navigateByUrl('/404');
            } else {
                this.spinner.show();
                this.role = user.roles[0].id;
                this.informationForm = new FormGroup({
                    username: new FormControl(user.username),
                    roles: new FormControl(user.roles[0].id),
                    email: new FormControl(user.email),
                    avatar: new FormControl(user.avatar),
                });
            }
        }, () => {

        }, () => {
            this.avatarTemp = this.informationForm.value.avatar;
            setTimeout(() => {
                /** spinner ends after 5 seconds */
                this.spinner.hide();
            }, 1000);
        });
    }

    saveAvatar() {
        this.userService.updateUserAvatar(this.id, this.avatarTemp).subscribe(() => {
        }, e => {
            console.log(e);
        }, () => {
            this.showSuccess();
            this.router.navigateByUrl('/dat-phong-hop/man-hinh');
        });
    }

    showPreview(event: any) {
        const dateTime = Date.now();
        const file = event.target.files[0];
        const filePath = `User/${dateTime}`;
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(`User/${dateTime}`, file);
        this.spinner.show();
        task
            .snapshotChanges()
            .pipe(
                finalize(() => {
                    this.downloadUrl = fileRef.getDownloadURL();
                    this.downloadUrl.subscribe(url => {
                            if (url) {
                                this.avatarTemp = url;
                            }
                            setTimeout(() => {
                                /** spinner ends after 5 seconds */
                                this.spinner.hide();
                            }, 2000);
                        }, () => {
                        },
                        () => {
                        });
                })
            )
            .subscribe(() => {
            });
    }

    showSuccess() {
        this.toastService.success('Thành công !', 'Thêm mới ảnh đại diện');
    }
}


