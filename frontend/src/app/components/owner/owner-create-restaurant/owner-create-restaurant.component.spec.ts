import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerCreateRestaurantComponent } from './owner-create-restaurant.component';

describe('OwnerCreateRestaurantComponent', () => {
  let component: OwnerCreateRestaurantComponent;
  let fixture: ComponentFixture<OwnerCreateRestaurantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerCreateRestaurantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerCreateRestaurantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
