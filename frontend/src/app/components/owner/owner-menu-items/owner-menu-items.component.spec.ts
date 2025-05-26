import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerMenuItemsComponent } from './owner-menu-items.component';

describe('OwnerMenuItemsComponent', () => {
  let component: OwnerMenuItemsComponent;
  let fixture: ComponentFixture<OwnerMenuItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerMenuItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerMenuItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
