import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationrecordComponent } from './operationrecord.component';

describe('OperationrecordComponent', () => {
  let component: OperationrecordComponent;
  let fixture: ComponentFixture<OperationrecordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OperationrecordComponent]
    });
    fixture = TestBed.createComponent(OperationrecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
