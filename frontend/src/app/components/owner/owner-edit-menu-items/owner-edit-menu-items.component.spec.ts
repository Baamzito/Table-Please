import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerEditMenuItemsComponent } from './owner-edit-menu-items.component';

describe('OwnerEditMenuItemsComponent', () => {
  let component: OwnerEditMenuItemsComponent;
  let fixture: ComponentFixture<OwnerEditMenuItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerEditMenuItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerEditMenuItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
