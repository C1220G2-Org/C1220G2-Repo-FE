import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MeetingRoomServiceService} from '../meeting-room-service.service';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AngularFireStorage} from '@angular/fire/storage';
import {finalize} from 'rxjs/operators';
import {MeetingRoom} from '../../models/meeting-room';
import {PropertyDto} from '../../models/property-dto';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerModule, NgxSpinnerService} from 'ngx-bootstrap-spinner';

@Component({
  selector: 'app-create-meeting-room',
  templateUrl: './create-meeting-room.component.html',
  styleUrls: ['./create-meeting-room.component.css']
})
export class CreateMeetingRoomComponent implements OnInit {
  meetingRoom: MeetingRoom;
  meetingRoomList: MeetingRoom[] = [];
  collectionSize = 0;
  page = 1;
  pageSize = 2;
  id: number;
  meetingRoomForm: FormGroup;
  properties: PropertyDto[] = [];
  amountPropertyCreate: number;
  messageCreate = '';
  namePropertyForSearch: string;
  downloadURL: Observable<string>;
  selectedImage1: any;
  images: string[] = [];
  idPropertyDelete: number;
  namePropertyDelete: string;
  amountPropertyDelete: number;
  messageName = '';

  checkUpLoad = true;
  messageColor = '';

  constructor(private storage: AngularFireStorage, private meetingRoomService: MeetingRoomServiceService,
              private fb: FormBuilder, private router: Router, private angularFireStorage: AngularFireStorage,
              private toastService: ToastrService,
              private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {
    this.meetingRoomService.findAll().subscribe(data => {
      this.meetingRoomList = data['content'];
    });
    this.meetingRoom = {name: '', floor: 0, capacity: 0, status: '', color: '', images: [], propertyDtoList: [], amountUse: 0, ratings: []};
    this.meetingRoomForm = this.fb.group({
      id: new FormControl(''),
      name: new FormControl('', [Validators.required, Validators.pattern('^[A-Z][a-z0-9]*$')]),
      floor: new FormControl('', [Validators.required, Validators.min(0)]),
      capacity: new FormControl('', [Validators.required, Validators.min(1), Validators.max(40)]),
      status: new FormControl(''),
      color: new FormControl('', [Validators.required]),
      propertyDtoList: new FormControl(''),
      images: new FormControl('')
    });

    this.meetingRoomService.findListPropertyDto(this.namePropertyForSearch).subscribe(value => {
      this.properties = value;
      this.collectionSize = value.length;
      for (let i = 0; i < this.properties.length; i++) {
        this.properties[i].amount = 0;
        for (let j = 0; j < this.meetingRoom.propertyDtoList.length; j++) {
          if (this.properties[i].id == this.meetingRoom.propertyDtoList[j].id) {
            this.properties[i].amount = this.meetingRoom.propertyDtoList[j].amount;
            this.meetingRoom.propertyDtoList[j].amountTotal = this.properties[i].amountTotal;
          }
        }
      }
    });
    for (let i = 0; i < this.meetingRoom.images.length; i++) {
      this.images[i] = this.meetingRoom.images[i];
    }
  }

  chooseImage(event: any) {
    this.spinner.show();
    this.checkUpLoad = false;
    for (let i = 0; i < 4; i++) {
      this.selectedImage1 = event.target.files[i];
      const nameImg = this.selectedImage1.name;
      const fileRef = this.angularFireStorage.ref(nameImg);
      this.angularFireStorage.upload(nameImg, this.selectedImage1).snapshotChanges().pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            this.images[i] = url;
            this.checkUpLoad = true;
          });
        })
      ).subscribe(value => {
      }, error => {
        setTimeout(() => {
          /** spinner ends after 5 seconds */
          this.spinner.hide();
        }, 1000);
      }, () => {
        setTimeout(() => {
          /** spinner ends after 5 seconds */
          this.spinner.hide();
        }, 1000);
      });
    }
  }

  submit() {
    let check = true;
    this.messageName = '';
    this.messageColor = '';
    let colorValue = this.meetingRoomForm.value.color;
    let meetingRoom = this.meetingRoomForm.value;
    let nameValue = this.meetingRoomForm.value.name;
    for (let i = 0; i < this.meetingRoomList.length; i++) {
      // @ts-ignore
      if (colorValue == this.meetingRoomList [i].color) {
        this.messageColor = 'Đã có phòng sử dụng màu này, vui lòng chọn màu khác!';
        check = false;
      }
      if (nameValue == this.meetingRoomList[i].name) {
        this.messageName = 'Phòng đã tồn tại, vui lòng nhập lại tên phòng';
        check = false;
      }
    }
    if (check) {
      meetingRoom.propertyDtoList = this.meetingRoom.propertyDtoList;
      meetingRoom.images = this.images;
      meetingRoom.status = 'Trống';
      this.meetingRoomService.saveMeetingRoom(meetingRoom).subscribe(data => {
        // @ts-ignore
        this.router.navigate(['/phong-hop/danh-sach']);
        this.callToastr();
      });
    }
  }

  changeAmount($event: any, id: number, name: string, amountTotal: number) {
    amountTotal = Number(amountTotal);
    this.messageCreate = '';
    let tempAmountTotal: number = null;
    this.amountPropertyCreate = Number($event.target.value);
    if (this.amountPropertyCreate.toString().includes('.')) {
      this.messageCreate = 'Số lượng phải là số nguyên.';
    } else {
      if (this.amountPropertyCreate < 0) {
        this.messageCreate = 'Số lượng không được là só âm.';
      } else {
        let check = true;
        for (let i = 0; i < this.meetingRoom.propertyDtoList.length; i++) {
          if (this.meetingRoom.propertyDtoList[i].id == id) {
            if (this.amountPropertyCreate > (this.meetingRoom.propertyDtoList[i].amountTotal
              + this.meetingRoom.propertyDtoList[i].amount)) {
              this.messageCreate = 'Vượt quá số lượng trong kho.';
            } else {
              this.meetingRoom.propertyDtoList[i].amountTotal = amountTotal - (this.amountPropertyCreate - this.meetingRoom.propertyDtoList[i].amount);
              tempAmountTotal = amountTotal - (this.amountPropertyCreate - this.meetingRoom.propertyDtoList[i].amount);
              this.meetingRoom.propertyDtoList[i].amount = this.amountPropertyCreate;
              this.meetingRoom.propertyDtoList[i].name = name;
            }
            check = false;
            break;
          }
        }
        if (check) {
          let property: PropertyDto = {
            id: 0,
            name: '',
            amount: 0,
            amountTotal: 0
          };
          for (let i = 0; i < this.properties.length; i++) {
            if (this.properties[i].id == id) {
              if (this.amountPropertyCreate > this.properties[i].amountTotal) {
                this.messageCreate = 'Vượt quá số lượng trong kho.';
              } else {
                property.id = Number(id);
                property.name = name;
                property.amount = Number(this.amountPropertyCreate);
                property.amountTotal = amountTotal - property.amount;
                tempAmountTotal = amountTotal - property.amount;
                this.meetingRoom.propertyDtoList.push(property);
              }
              break;
            }
          }
        }
      }
      if ('' == this.messageCreate) {
        this.messageCreate = name + ' đã được chọn ';
      }
    }
    for (let i = 0; i < this.properties.length; i++) {
      if (this.properties[i].id == id && tempAmountTotal != null) {
        this.properties[i].amountTotal = tempAmountTotal;
      }
    }
    for (let i = 0; i < this.meetingRoom.propertyDtoList.length; i++) {
      if (this.meetingRoom.propertyDtoList[i].amount == 0) {
        this.meetingRoom.propertyDtoList.splice(i, 1);
      }
    }
  }

  passData(id: number, name: string, amount: number) {
    this.idPropertyDelete = id;
    this.namePropertyDelete = name;
    this.amountPropertyDelete = Number(amount);
  }

  deleteProperty() {
    for (let i = 0; i < this.properties.length; i++) {
      if (this.idPropertyDelete === this.properties[i].id) {
        this.properties[i].amount = 0;
        this.properties[i].amountTotal += this.amountPropertyDelete;
      }
    }
    for (let i = 0; i < this.meetingRoom.propertyDtoList.length; i++) {
      if (this.idPropertyDelete === this.meetingRoom.propertyDtoList[i].id) {
        this.meetingRoom.propertyDtoList.splice(i, 1);
      }
    }
  }

  setNameProperty($event: any) {
    this.namePropertyForSearch = $event.target.value;
  }

  searchProperty() {
    this.meetingRoomService.findListPropertyDto(this.namePropertyForSearch).subscribe(value => {
      this.properties = value;
      this.collectionSize = value.length;
      for (let i = 0; i < this.properties.length; i++) {
        this.properties[i].amount = 0;
        for (let j = 0; j < this.meetingRoom.propertyDtoList.length; j++) {
          if (this.properties[i].id == this.meetingRoom.propertyDtoList[j].id) {
            this.properties[i].amount = this.meetingRoom.propertyDtoList[j].amount;
            this.meetingRoom.propertyDtoList[j].amountTotal = this.properties[i].amountTotal;
          }
        }
      }
    });
  }

  callToastr() {
    this.toastService.success('Thêm mới thành công...', 'Thêm mới', {
      timeOut: 1500,
      progressBar: true,
      progressAnimation: 'increasing'
    });
  }

  cancelSubmit() {
    this.router.navigateByUrl('/phong-hop/danh-sach');
  }

  index = -1;
  checkCreateImageValuable = [false, false, false];

  checkCreateImage() {
    this.index += 1;
    this.checkCreateImageValuable[this.index] = true;
  }
}
