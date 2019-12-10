import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalPKMNManagerComponent } from './internal-pkmnmanager.component';

describe('InternalPKMNManagerComponent', () => {
  let component: InternalPKMNManagerComponent;
  let fixture: ComponentFixture<InternalPKMNManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalPKMNManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalPKMNManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
