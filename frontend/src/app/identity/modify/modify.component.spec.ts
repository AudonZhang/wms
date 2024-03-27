import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyComponent } from './modify.component';

describe('ModifyComponent', () => {
  let component: ModifyComponent;
  let fixture: ComponentFixture<ModifyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModifyComponent]
    });
    fixture = TestBed.createComponent(ModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
