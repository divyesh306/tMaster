import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VideoChatPage } from './video-chat.page';

describe('VideoChatPage', () => {
  let component: VideoChatPage;
  let fixture: ComponentFixture<VideoChatPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoChatPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VideoChatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
