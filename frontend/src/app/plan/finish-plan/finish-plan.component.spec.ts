import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishPlanComponent } from './finish-plan.component';

describe('FinishPlanComponent', () => {
  let component: FinishPlanComponent;
  let fixture: ComponentFixture<FinishPlanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinishPlanComponent]
    });
    fixture = TestBed.createComponent(FinishPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
