import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalMoveManagerComponent } from './internal-movemanager.component';

describe('InternalMoveManagerComponent', () => {
  let component: InternalMoveManagerComponent;
  let fixture: ComponentFixture<InternalMoveManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalMoveManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalMoveManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
