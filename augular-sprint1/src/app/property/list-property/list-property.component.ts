import {Component, OnInit} from '@angular/core';
import {Property} from '../../models/property';
import {PropertyServiceService} from '../property-service.service';
import {TokenStorageService} from '../../user/token-storage.service';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-bootstrap-spinner';

@Component({
  selector: 'app-list-property',
  templateUrl: './list-property.component.html',
  styleUrls: ['./list-property.component.css']
})
export class ListPropertyComponent implements OnInit {
  propertiesList: Property[] = [];
  tempId: number;
  property: Property;
  name: string;
  usingProperty: any;
  page = 1;
  pageSize = 4;
  collectionSize = 0;
  isLoggedIn = false;
  showAdminBoard = false;
  showUserBoard = false;
  username: string;
  userId: number;
  private roles: string[];
  checkSearchEmpty: any;
  checkListEmpty: any;
  negative: any;
  messageSearch: string = '';

  constructor(private propertyService: PropertyServiceService,
              private tokenStorageService: TokenStorageService,
              private router: Router, private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {
    this.getAll();

    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showUserBoard = this.roles.includes('ROLE_USER');

      this.username = user.username;
      this.userId = user.id;
    }
  }

  getAll() {
    this.propertyService.getAll().subscribe(property => {
      if (property == null) {
        this.propertiesList = [];
        this.collectionSize = 0;
        this.messageSearch = ' Không tìm thấy tài sản';
        setTimeout(() => {
          if (isNaN(this.checkListEmpty)) {
            this.showMessage();
          }
        }, 1000);
      } else {
        this.propertiesList = property['content'];
        for (let i = 0; i < this.propertiesList.length; i++) {
          if (this.propertiesList[i].usingProperty == null) {
            this.propertiesList[i].usingProperty = 0;
          }
        }
        this.collectionSize = property['totalPages'];
      }
    }, error => {
      this.router.navigateByUrl('/403');
    });
  }

  send(id: number) {
    this.tempId = id;
    this.propertyService.findById(id).subscribe(data => {
      this.property = data;
      this.name = this.property.name;
      this.usingProperty = this.property.usingProperty;
    });
  }

  deleteProperty() {
    this.propertyService.deleteProperty(this.tempId).subscribe(() => {
        this.getAll();
      }, () => {
      }
    );
  }

  searchProperty(search: string) {
    this.spinner.show();
    this.messageSearch = '';
    this.propertyService.searchProperty(search).subscribe(property => {
      this.propertiesList = property;
      this.collectionSize = property['totalPages'];
      this.checkSearchEmpty = property.length;
    }, e => {
      this.router.navigateByUrl('/403');
    }, () => {
      if (this.checkSearchEmpty == 0) {
        this.messageSearch = ' Không tìm thấy tài sản';
      }
      setTimeout(() => {
        /** spinner ends after 5 seconds */
        this.spinner.hide();
      }, 500);
    });
  }


  showMessage() {
    Swal.fire({
      title: 'Danh sách rỗng',
      text: 'Không có dữ liệu',
      icon: 'info',
      confirmButtonText: 'Đóng'
    });
  }
}

