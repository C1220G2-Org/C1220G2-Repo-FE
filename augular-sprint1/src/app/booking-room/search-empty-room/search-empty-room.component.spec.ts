import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SearchEmptyRoomComponent} from './search-empty-room.component';

describe('SearchEmptyRoomComponent', () => {
  let component: SearchEmptyRoomComponent;
  let fixture: ComponentFixture<SearchEmptyRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchEmptyRoomComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchEmptyRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
