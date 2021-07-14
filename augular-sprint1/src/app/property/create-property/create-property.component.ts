import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PropertyServiceService} from '../property-service.service';
import {Router} from '@angular/router';
import {AngularFireStorage} from '@angular/fire/storage';
import {Observable} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-bootstrap-spinner';

@Component({
  selector: 'app-create-property',
  templateUrl: './create-property.component.html',
  styleUrls: ['./create-property.component.css']
})
export class CreatePropertyComponent implements OnInit {
  propertiesForm: FormGroup;
  downloadURL!: Observable<string>;
  fb: any;
  arrImage: string[] = [];
  priceTemp: number;

  constructor(private formBuilder: FormBuilder,
              private propertyService: PropertyServiceService,
              private router: Router,
              private storage: AngularFireStorage,
              private toastrService: ToastrService,
              private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {
    this.propertiesForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern(/^([\p{Lu}][\p{Ll}]{1,8})(\s([\p{Lu}]|[\p{Lu}][\p{Ll}]{1,10})){0,5}$/u), Validators.maxLength(100)]],
      detail: ['', [Validators.required, Validators.maxLength(500)]],
      price: ['', [Validators.required, Validators.pattern('^[1-9][\\d]*$'), Validators.maxLength(100)]],
      amount: ['0', [Validators.required, Validators.pattern('^[\\d]*$'), Validators.maxLength(100)]],
      image: [''],
      maintenance: 0
    })
    ;
  }

  get form() {
    return this.propertiesForm.controls;
  }

  callToastr() {
    this.toastrService.success('Thành công !', 'Tài sản đã được thêm mới');
  }

  onSubmit() {
    const property = this.propertiesForm.value;
    property.availability = property.amount - property.maintenance;
    property.image = this.arrImage;
    this.priceTemp = property.price;
    this.propertyService.saveProperty(property).subscribe(() => {
      this.callToastr();
      this.router.navigateByUrl('/tai-san/danh-sach');
    }, e => {
      this.router.navigateByUrl('/404');
    });
  }

  get image(): FormArray {
    return this.propertiesForm.get('image') as FormArray;
  }

  onBack() {
    this.router.navigateByUrl('/tai-san/danh-sach');
  }

  showPreview(event: any) {
    this.spinner.show();
    for (let i = 0; i < event.target.files.length; i++) {
      setTimeout(() => {
        const n = Date.now();
        const file = event.target.files[i];
        const filePath = `Properties/${n}`;
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(`Properties/${n}`, file);
        task
          .snapshotChanges()
          .pipe(
            finalize(() => {
              this.downloadURL = fileRef.getDownloadURL();
              this.downloadURL.subscribe(url => {
                if (url) {
                  this.arrImage[i] = url;
                }
              });
            })
          )
          .subscribe(() => {

            }, error => {

            }, () => {
              setTimeout(() => {
                /** spinner ends after 5 seconds */
                this.spinner.hide();
              }, 1000);
            }
          );
      }, 2000);
    }
  }
}
