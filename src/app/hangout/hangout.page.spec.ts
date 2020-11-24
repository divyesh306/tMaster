import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HangoutPage } from './hangout.page';

describe('HangoutPage', () => {
  let component: HangoutPage;
  let fixture: ComponentFixture<HangoutPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HangoutPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HangoutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
