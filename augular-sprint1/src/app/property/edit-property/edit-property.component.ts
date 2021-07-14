import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Property} from '../../models/property';
import {PropertyServiceService} from '../property-service.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {finalize} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {AngularFireStorage} from '@angular/fire/storage';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-bootstrap-spinner';

function checkMaintenance(availability: string, maintenance: string) {
  return (formGroup: FormGroup) => {
    const availabilityControl = formGroup.controls[availability];
    const maintenanceControl = formGroup.controls[maintenance];
    if (maintenanceControl.errors && availabilityControl.errors.compare) {
      return;
    }
    if (maintenanceControl.value > (availabilityControl.value)) {
      maintenanceControl.setErrors({compare: true});
    } else {
      maintenanceControl.setErrors(null);
    }
  };
}

@Component({
  selector: 'app-edit-property',
  templateUrl: './edit-property.component.html',
  styleUrls: ['./edit-property.component.css']
})
export class EditPropertyComponent implements OnInit {
  propertiesForm: FormGroup;
  property: Property;
  id: number = 0;
  downloadURL!: Observable<string>;
  fb: any;
  arrImage: string[] = [];

  constructor(private formBuilder: FormBuilder,
              private propertyService: PropertyServiceService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private storage: AngularFireStorage,
              private toastrService: ToastrService,
              private spinner: NgxSpinnerService) {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      this.id = +paramMap.get('id');
      this.getProperty(this.id);
    });
  }

  ngOnInit(): void {
  }


  get form() {
    return this.propertiesForm.controls;
  }

  callToastr() {
    this.toastrService.success('Thành công !', 'Tài sản đã được chỉnh sửa');
  }

  updateProperty() {
    const property = this.propertiesForm.value;
    property.image = this.arrImage;
    this.propertyService.updateProperty(this.id, property).subscribe(() => {
      this.router.navigateByUrl('/tai-san/danh-sach');
      this.callToastr();
    }, e => {
      console.log(e);
    });
  }

  private getProperty(id: number) {
    return this.propertyService.findById(id).subscribe(property => {
      this.propertiesForm = this.formBuilder.group({
        name: [property.name, [Validators.required, Validators.pattern(/^([\p{Lu}][\p{Ll}]{1,8})(\s([\p{Lu}]|[\p{Lu}][\p{Ll}]{1,10})){0,5}$/u), Validators.maxLength(100)]],
        detail: [property.detail, [Validators.required, Validators.maxLength(500)]],
        price: [property.price, [Validators.required, Validators.pattern('^[1-9][\\d]*$'), Validators.maxLength(100)]],
        amount: [property.amount, [Validators.required, Validators.pattern('^[\\d]*$'), Validators.maxLength(100)]],
        maintenance: [property.maintenance, [Validators.required, Validators.pattern('^[\\d]*$'), Validators.maxLength(100)]],
        usingProperty: [property.usingProperty],
        availability: [property.availability],
        image: [property.image]
      }, {validators: checkMaintenance('availability', 'maintenance')});
      for (let i = 0; i < property.image.length; i++) {
        this.arrImage.push(property.image[i]);
      }
    }, e => {
      this.router.navigateByUrl('/404');
    });
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
      }, 3000);
    }
  }

  onBack() {
    this.router.navigateByUrl('/tai-san/danh-sach');
  }
}
