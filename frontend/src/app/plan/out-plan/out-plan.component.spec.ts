import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutPlanComponent } from './out-plan.component';

describe('OutPlanComponent', () => {
  let component: OutPlanComponent;
  let fixture: ComponentFixture<OutPlanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OutPlanComponent]
    });
    fixture = TestBed.createComponent(OutPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
