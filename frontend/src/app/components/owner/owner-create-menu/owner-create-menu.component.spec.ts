import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerCreateMenuComponent } from './owner-create-menu.component';

describe('OwnerCreateMenuComponent', () => {
  let component: OwnerCreateMenuComponent;
  let fixture: ComponentFixture<OwnerCreateMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerCreateMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerCreateMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
