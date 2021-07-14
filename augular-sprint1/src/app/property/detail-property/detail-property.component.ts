import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {PropertyServiceService} from '../property-service.service';
import {Property} from '../../models/property';
import {PropertyInRoomDto} from '../../models/property-in-room-dto';

@Component({
  selector: 'app-detail-property',
  templateUrl: './detail-property.component.html',
  styleUrls: ['./detail-property.component.css']
})
export class DetailPropertyComponent implements OnInit {
  id: number;
  property: Property;
  arrImage: string[];
  propertyInRoom: any[];

  constructor(private propertyService: PropertyServiceService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      this.id = +paramMap.get('id');
      this.getPropertyById(this.id);
    });
  }

  ngOnInit(): void {
  }


  private getPropertyById(id: number) {
    return this.propertyService.findById(id).subscribe(property => {
      this.property = property;
      this.arrImage = property.image;
      this.propertyInRoom = property.propertyMeetingRoomDto;
    });
  }

  onBack() {
    this.router.navigateByUrl('/tai-san/danh-sach');
  }
}
