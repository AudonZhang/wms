import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutboundComponent } from './outbound.component';

describe('OutboundComponent', () => {
  let component: OutboundComponent;
  let fixture: ComponentFixture<OutboundComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OutboundComponent]
    });
    fixture = TestBed.createComponent(OutboundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
