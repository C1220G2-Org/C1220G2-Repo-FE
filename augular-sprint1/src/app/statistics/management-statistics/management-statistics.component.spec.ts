import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ManagementStatisticsComponent} from './management-statistics.component';

describe('ManagementStatisticsComponent', () => {
  let component: ManagementStatisticsComponent;
  let fixture: ComponentFixture<ManagementStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManagementStatisticsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
