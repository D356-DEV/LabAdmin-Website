import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventaryregisterComponent } from './inventaryregister.component';

describe('InventaryregisterComponent', () => {
  let component: InventaryregisterComponent;
  let fixture: ComponentFixture<InventaryregisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventaryregisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventaryregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
