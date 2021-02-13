import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BugreportPage } from './bugreport.page';

describe('BugreportPage', () => {
  let component: BugreportPage;
  let fixture: ComponentFixture<BugreportPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BugreportPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BugreportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
