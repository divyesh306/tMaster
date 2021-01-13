import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LetstalknowPage } from './letstalknow.page';

describe('LetstalknowPage', () => {
  let component: LetstalknowPage;
  let fixture: ComponentFixture<LetstalknowPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetstalknowPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LetstalknowPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
