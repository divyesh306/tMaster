import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VerifyNumberPage } from './verify-number.page';

describe('VerifyNumberPage', () => {
  let component: VerifyNumberPage;
  let fixture: ComponentFixture<VerifyNumberPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyNumberPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VerifyNumberPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
