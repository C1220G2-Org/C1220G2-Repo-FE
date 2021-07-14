import {Component, OnInit} from '@angular/core';
import {User} from '../../models/user';
import {UserService} from '../user.service';
import {NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-bootstrap-spinner';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent implements OnInit {
  userList: User[] = [];
  check: [];
  user: User;
  page: number = 1;
  pageSize: number = 5;
  collectionSize: number = 0;
  checkListSearchEmpty: any;
  idDelete: number;
  userDelete: string;
  listEmpty: string;
  messageError: string;

  constructor(private userService: UserService,
              config: NgbModalConfig,
              private toastService: ToastrService,
              private router: Router,
              private spinner: NgxSpinnerService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.userService.getAllUser().subscribe(data => {
      this.messageError = '';
      this.spinner.show();
      if (data == null) {
        this.userList = [];
        this.collectionSize = 0;
        this.showError();
        this.messageError = 'Không tìm thấy dữ liệu.';
      } else {
        this.userList = data['content'];
        this.collectionSize = data['totalPages'];
      }
    }, () => {
      this.router.navigateByUrl('/403');
    }, () => {
      setTimeout(() => {
        /** spinner ends after 5 seconds */
        this.spinner.hide();
      }, 1000);
    });
  }

  searchUser(searchKeyword: string) {
    this.messageError = '';
    this.userService.searchUser(searchKeyword).subscribe(users => {
      this.spinner.show();
      this.userList = users;
      this.checkListSearchEmpty = users.length;
    }, e => {
      console.log(e);
    }, () => {
      if (this.checkListSearchEmpty == 0) {
        this.messageError = 'Không tìm thấy dữ liệu.';
      }
      setTimeout(() => {
        /** spinner ends after 5 seconds */
        this.spinner.hide();
      }, 500);
    });
  }

  deleteUser() {
    this.userService.deleteUser(this.idDelete).subscribe(() => {
      this.showSuccess();
    }, e => {
      console.log(e);
      this.showErrorDelete();
    }, () => {
      this.getData();
    });
  }

  sendIdToComponent(id: number) {
    this.idDelete = id;
    this.userService.findById(id).subscribe(data => {
      if (data == null) {
        this.router.navigateByUrl('/404');
      }
      this.user = data;
      this.userDelete = this.user.username;
    });
  }

  showSuccess() {
    this.toastService.success('Thành công !', 'Xóa người dùng ' + this.userDelete);
  }

  showError() {
    Swal.fire({
      text: 'Không tìm thấy dữ liệu từ hệ thống !',
      icon: 'warning',
      confirmButtonText: 'Đóng'
    });
  }

  showErrorSearch() {
    Swal.fire({
      text: 'Không tìm thấy người dùng !',
      icon: 'warning',
      confirmButtonText: 'Đóng'
    });
  }

  showErrorDelete() {
    Swal.fire({
      text: 'Không thể xóa người dùng !',
      icon: 'warning',
      confirmButtonText: 'Đóng'
    });
  }
}
