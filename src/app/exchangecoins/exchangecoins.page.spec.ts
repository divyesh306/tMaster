import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExchangecoinsPage } from './exchangecoins.page';

describe('ExchangecoinsPage', () => {
  let component: ExchangecoinsPage;
  let fixture: ComponentFixture<ExchangecoinsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExchangecoinsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ExchangecoinsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
