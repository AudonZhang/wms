import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyGoodsComponent } from './modify-goods.component';

describe('ModifyGoodsComponent', () => {
  let component: ModifyGoodsComponent;
  let fixture: ComponentFixture<ModifyGoodsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModifyGoodsComponent]
    });
    fixture = TestBed.createComponent(ModifyGoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
