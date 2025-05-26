import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerMenusComponent } from './owner-menus.component';

describe('OwnerMenusComponent', () => {
  let component: OwnerMenusComponent;
  let fixture: ComponentFixture<OwnerMenusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerMenusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerMenusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
