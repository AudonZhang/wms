import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InboundComponent } from './inbound.component';

describe('InboundComponent', () => {
  let component: InboundComponent;
  let fixture: ComponentFixture<InboundComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InboundComponent]
    });
    fixture = TestBed.createComponent(InboundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
