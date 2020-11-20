import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RegisterCompletePage } from './register-complete.page';

describe('RegisterCompletePage', () => {
  let component: RegisterCompletePage;
  let fixture: ComponentFixture<RegisterCompletePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterCompletePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterCompletePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
