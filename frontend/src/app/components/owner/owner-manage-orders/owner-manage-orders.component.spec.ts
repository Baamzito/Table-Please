import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerManageOrdersComponent } from './owner-manage-orders.component';

describe('OwnerManageOrdersComponent', () => {
  let component: OwnerManageOrdersComponent;
  let fixture: ComponentFixture<OwnerManageOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerManageOrdersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerManageOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
