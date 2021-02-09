import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BuycoinsPage } from './buycoins.page';

describe('BuycoinsPage', () => {
  let component: BuycoinsPage;
  let fixture: ComponentFixture<BuycoinsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuycoinsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BuycoinsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
