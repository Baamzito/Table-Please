import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerEditRestaurantComponent } from './owner-edit-restaurant.component';

describe('OwnerEditRestaurantComponent', () => {
  let component: OwnerEditRestaurantComponent;
  let fixture: ComponentFixture<OwnerEditRestaurantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerEditRestaurantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerEditRestaurantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
