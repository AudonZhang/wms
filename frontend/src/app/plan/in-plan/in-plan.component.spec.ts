import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InPlanComponent } from './in-plan.component';

describe('InPlanComponent', () => {
  let component: InPlanComponent;
  let fixture: ComponentFixture<InPlanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InPlanComponent]
    });
    fixture = TestBed.createComponent(InPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
