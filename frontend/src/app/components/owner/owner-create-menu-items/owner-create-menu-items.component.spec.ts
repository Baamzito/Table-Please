import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerCreateMenuItemsComponent } from './owner-create-menu-items.component';

describe('OwnerCreateMenuItemsComponent', () => {
  let component: OwnerCreateMenuItemsComponent;
  let fixture: ComponentFixture<OwnerCreateMenuItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerCreateMenuItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerCreateMenuItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
