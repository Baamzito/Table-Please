import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerEditMenuComponent } from './owner-edit-menu.component';

describe('OwnerEditMenuComponent', () => {
  let component: OwnerEditMenuComponent;
  let fixture: ComponentFixture<OwnerEditMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerEditMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerEditMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
