import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {FeedBackServiceService} from '../feed-back-service.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {AngularFireStorage} from '@angular/fire/storage';
import {TypeError} from '../../models/type-error';
import {User} from '../../models/user';
import {TokenStorageService} from '../../user/token-storage.service';
@Component({
  selector: 'app-create-feedback-technical',
  templateUrl: './create-feedback-technical.component.html',
  styleUrls: ['./create-feedback-technical.component.css']
})
export class CreateFeedbackTechnicalComponent implements OnInit {
  typeErrorList: TypeError[] = [];
  arrayImage: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  username: string;
  userId: number;
  selectedImage: any;
  downloadURL: Observable<string>;
  feedbackForm: FormGroup;
  private user: User;

  constructor(private feedbackServiceService: FeedBackServiceService,
              private storage: AngularFireStorage,
              private toastService: ToastrService,
              private router: Router,
              private tokenStorageService: TokenStorageService,) {
  }
  ngOnInit(): void {
    this.getTypeError();
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      this.user = this.tokenStorageService.getUser();
    }
    this.feedbackForm = new FormGroup({
      feedbackTitle: new FormControl('', [Validators.required]),
      feedbackTime: new FormControl(''),
      feedbackContent: new FormControl('', Validators.required),
      image: new FormControl('', Validators.required),
      typeError: new FormControl(1, Validators.required),
      userFeedback: new FormControl(this.user.id),
      status: new FormControl(false),
      feedbackType: new FormControl(2),
      handleFeedback: new FormControl(null),
    });
  }
  getTypeError() {
    this.feedbackServiceService.getAllFBType().subscribe(type => {
      this.typeErrorList = type;
    });
  }
  showPreview(event: any) {
    for (let i = 0; i < 4; i++) {
      this.selectedImage = event.target.files[i];
      const nameImage = this.selectedImage.name;
      const fileRef = this.storage.ref(nameImage);
      this.storage.upload(nameImage, this.selectedImage).snapshotChanges().pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            this.arrayImage[i]=url;
            console.log(this.arrayImage);
          });
        })).subscribe();
    }
  }
  submit() {
    const feedbackForm = this.feedbackForm.value;
    feedbackForm.image = this.arrayImage;
    this.feedbackServiceService.save(feedbackForm).subscribe(() => {
      this.showSuccess();
    }, error => {
    }, () => {
      this.router.navigateByUrl('/dat-phong-hop/man-hinh');
    });
  }
  showSuccess() {
    this.toastService.success('Thành công !', 'Phản hồi');
  }
  onBack() {
    this.router.navigateByUrl('');
  }
}
