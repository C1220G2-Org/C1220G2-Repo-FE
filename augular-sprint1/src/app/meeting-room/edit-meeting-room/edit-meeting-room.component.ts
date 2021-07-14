import {Component, OnInit} from '@angular/core';
import {MeetingRoomServiceService} from '../meeting-room-service.service';
import {MeetingRoom} from '../../models/meeting-room';
import {AbstractControl, FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {PropertyDto} from '../../models/property-dto';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {AngularFireStorage} from '@angular/fire/storage';
import firebase from 'firebase';
import {finalize} from 'rxjs/operators';
import {NgxSpinnerService} from 'ngx-bootstrap-spinner';


@Component({
  selector: 'app-edit-meeting-room',
  templateUrl: './edit-meeting-room.component.html',
  styleUrls: ['./edit-meeting-room.component.css']
})
export class EditMeetingRoomComponent implements OnInit {

  collectionSize = 0;
  page = 1;
  pageSize = 4;
  meetingRoom: MeetingRoom;
  id: number;
  idMeetingRoom: number;
  meetingRoomForm: FormGroup;
  properties: PropertyDto[] = [];
  amountPropertyEdit: number;
  messageEdit = '';
  namePropertyForSearch = '';
  downloadURL: Observable<string>;
  messageCheckFileImage1 = '';
  selectedImage1: any;
  sizeImage: number;
  image = '';
  images: string[] = [];
  messageName: string = '';
  messageColor: string;
  namePropertyDelete: string;
  idPropertyDelete: number;
  amountPropertyDelete: number;
  checkUpLoad = true;
  meetingRoomList: MeetingRoom[] = [];

  constructor(private meetingRoomService: MeetingRoomServiceService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private toastService: ToastrService,
              private angularFireStorage: AngularFireStorage,
              private spinner: NgxSpinnerService) {

  }

  ngOnInit(): void {
    this.meetingRoomService.findAll().subscribe(data => {
      this.meetingRoomList = data['content'];
    });
    this.idMeetingRoom = Number(this.activatedRoute.snapshot.params.id);
    this.meetingRoomService.findById(this.idMeetingRoom).subscribe(value => {
      this.meetingRoom = value;
      this.meetingRoomForm = new FormGroup({
        id: new FormControl(this.meetingRoom.id),
        name: new FormControl(this.meetingRoom.name, [Validators.required, Validators.maxLength(30),
          Validators.pattern('^[A-Z][a-z0-9]*$')]),
        floor: new FormControl(this.meetingRoom.floor, [Validators.required, this.checkInteger]),
        capacity: new FormControl(this.meetingRoom.capacity, Validators.required),
        status: new FormControl(this.meetingRoom.status),
        color: new FormControl(this.meetingRoom.color),
        propertyDtoList: new FormControl(this.meetingRoom.propertyDtoList),
        images: new FormControl(this.meetingRoom.images)
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
    }, error => {
      this.router.navigateByUrl('/404');
    }, () => {
    });
  }

  chooseImage(event: any) {
    this.messageCheckFileImage1 = '';
    this.sizeImage = 0;
    this.checkUpLoad = false;
    this.images = [];
    console.log(event);
    for (let i = 0; i < event.target.files.length; i++) {
      this.selectedImage1 = event.target.files[i];
      if (this.selectedImage1.size > 5000000) {
        this.images = [];
        this.messageCheckFileImage1 = 'Kích thước file không được vượt quá 5MB.';
        break;
      }
      const nameImg = this.selectedImage1.name;
      const fileRef = this.angularFireStorage.ref(nameImg);
      this.angularFireStorage.upload(nameImg, this.selectedImage1).snapshotChanges().pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            this.images[i] = url;
          });
        })
      ).subscribe(value => {
      }, error => {
      }, () => {
      });
    }
    this.spinner.show();
    setTimeout(() => {
      /** spinner ends after 1 seconds */
      this.spinner.hide();
    }, 2000);
  }

  submitForm() {
    let check = true;
    this.messageName = '';
    this.messageColor = '';
    let temp = this.meetingRoomForm.value;
    let nameValue = temp.name;
    temp.images = this.images;
    for (let i = 0; i < this.meetingRoomList.length; i++) {
      // @ts-ignore
      if (nameValue == this.meetingRoomList[i].name && nameValue != this.meetingRoom.name) {
        this.messageName = 'Phòng đã tồn tại, vui lòng nhập lại tên phòng';
        check = false;
      }
    }
    if (check) {
      this.meetingRoomService.edit(temp).subscribe(value => {
        this.meetingRoomService.editProperties(this.properties).subscribe(value1 => {
          this.callToastr();
          this.router.navigateByUrl('/phong-hop/danh-sach');
        });
      });
    }
  }

// thay doi so luong tai san

  changeAmount($event: any, id: number, name: string, amountTotal: number) {
    amountTotal = Number(amountTotal);
    this.messageEdit = '';
    let tempAmountTotal: number = null;
    this.amountPropertyEdit = Number($event.target.value);

    if (this.amountPropertyEdit.toString().includes('.')) {
      this.messageEdit = 'Số lượng phải là số nguyên.';
    } else {
      if (this.amountPropertyEdit < 0) {
        this.messageEdit = 'Số lượng không hợp lệ.';
      } else {
        let check = true;
        for (let i = 0; i < this.meetingRoom.propertyDtoList.length; i++) {
          if (this.meetingRoom.propertyDtoList[i].id == id) {
            if (this.amountPropertyEdit > (this.meetingRoom.propertyDtoList[i].amountTotal
              + this.meetingRoom.propertyDtoList[i].amount)) {
              this.messageEdit = 'Vượt quá số lượng trong kho.';
            } else {
              this.meetingRoom.propertyDtoList[i].amountTotal = amountTotal - (this.amountPropertyEdit - this.meetingRoom.propertyDtoList[i].amount);
              tempAmountTotal = amountTotal - (this.amountPropertyEdit - this.meetingRoom.propertyDtoList[i].amount);
              this.meetingRoom.propertyDtoList[i].amount = this.amountPropertyEdit;
              this.meetingRoom.propertyDtoList[i].name = name;
            }
            check = false;
            break;
          }

        }

// khi tai san chua co trong danh sach thi them moi
        if (check) {
          let property: PropertyDto = {
            id: 0,
            name: '',
            amount: 0,
            amountTotal: 0
          };

          for (let i = 0; i < this.properties.length; i++) {
            if (this.properties[i].id == id) {
              if (this.amountPropertyEdit > this.properties[i].amountTotal) {
                this.messageEdit = 'Vượt quá số lượng trong kho.';
              } else {
                property.id = Number(id);
                property.name = name;
                property.amount = Number(this.amountPropertyEdit);
                property.amountTotal = amountTotal - property.amount;
                tempAmountTotal = amountTotal - property.amount;
                this.meetingRoom.propertyDtoList.push(property);
              }
              break;
            }
          }
        }
      }


      if ('' == this.messageEdit) {
        this.messageEdit = 'Số lượng ' + name + ' đã thay đổi ';
      }
    }
// cap nhat so luong tai san TONG trong list properties.
    for (let i = 0; i < this.properties.length; i++) {
      if (this.properties[i].id == id && tempAmountTotal != null) {
        this.properties[i].amountTotal = tempAmountTotal;

      }
    }
// xoa tai san trong Room neu so luong = 0
    for (let i = 0; i < this.meetingRoom.propertyDtoList.length; i++) {
      if (this.meetingRoom.propertyDtoList[i].amount == 0) {
        this.meetingRoom.propertyDtoList.splice(i, 1);
      }
    }
  }

  // delete property

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
    this.messageEdit = '';
  }


  cancelSubmit() {
    this.router.navigateByUrl('/phong-hop/danh-sach');
  }

  callToastr() {
    this.toastService.success('thông tin phòng họp chỉnh sửa thành công...', 'Chỉnh sửa', {
      timeOut: 1500,
      progressBar: true,
      progressAnimation: 'increasing'
    });
  }

  // search Property

  setNameProperty($event: any) {
    this.namePropertyForSearch = $event.target.value;
    this.collectionSize = 0;
    for (let i = 0; i < this.properties.length; i++) {
      if (this.properties[i].name.includes(this.namePropertyForSearch) || this.namePropertyForSearch == '') {
        this.collectionSize++;
      }
    }

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

  deleteImage(index: number) {
    index = Number(index);
    this.images[index] = '';
  }

  // savePropertyInRoom(id: number, amount: number, amountTotal: number) {
  //
  // }

  checkInteger(c: AbstractControl) {

    if (c.value == null) {
      return {
        checkinteger: true
      };
    } else {
      return (c.value.toString().includes('.') || Number(c.value) < 1) ? {
        checkinteger: true
      } : null;
    }
  }

  index = -1;
  checkCreateImageValuable = [false, false, false];

  checkCreateImage() {
    this.index += 1;
    this.checkCreateImageValuable[this.index] = true;
  }
}
