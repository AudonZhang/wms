import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllboundComponent } from './allbound.component';

describe('AllboundComponent', () => {
  let component: AllboundComponent;
  let fixture: ComponentFixture<AllboundComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllboundComponent]
    });
    fixture = TestBed.createComponent(AllboundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
