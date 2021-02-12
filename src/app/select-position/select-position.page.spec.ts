import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectPositionPage } from './select-position.page';

describe('SelectPositionPage', () => {
  let component: SelectPositionPage;
  let fixture: ComponentFixture<SelectPositionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectPositionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectPositionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
