import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AqanalysisComponent } from './aqanalysis.component';

describe('AqanalysisComponent', () => {
  let component: AqanalysisComponent;
  let fixture: ComponentFixture<AqanalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AqanalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AqanalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
