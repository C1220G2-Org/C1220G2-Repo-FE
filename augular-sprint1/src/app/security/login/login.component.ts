import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../user/auth.service';
import {TokenStorageService} from '../../user/token-storage.service';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import firebase from 'firebase/app';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  form: any = {};
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(public afAuth: AngularFireAuth, private authService: AuthService, private tokenStorage: TokenStorageService,
              private router: Router,
              private toastService: ToastrService,
  ) {
  }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
  }

  onSubmit(): void {
    this.authService.login(this.form).subscribe(
      data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        window.location.assign('/dat-phong-hop/man-hinh');
        this.showSuccess();
      },
      err => {
        this.showLoginFailed();
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }, () => {

      }
    );
  }

  signInWithGoogle() {
    const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
    this.afAuth.signInWithPopup(googleAuthProvider).then(() => {
      this.showSuccess();
      this.router.navigateByUrl('/dat-phong-hop/man-hinh');
    });
  }

  signOut() {
    this.afAuth.signOut();
  }

  showSuccess() {
    this.toastService.success('Thành công !', 'Đăng nhập');
  }

  showLoginFailed() {
    this.toastService.error('Thất bại sai tên đăng nhập hoặc mật khẩu?!', 'Đăng nhập');
  }

}
