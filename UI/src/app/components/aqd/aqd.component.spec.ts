import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AqdComponent } from './aqd.component';

describe('AqdComponent', () => {
  let component: AqdComponent;
  let fixture: ComponentFixture<AqdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AqdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AqdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
