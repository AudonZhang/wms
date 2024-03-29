import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewuserComponent } from './newuser.component';

describe('NewuserComponent', () => {
  let component: NewuserComponent;
  let fixture: ComponentFixture<NewuserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewuserComponent]
    });
    fixture = TestBed.createComponent(NewuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
