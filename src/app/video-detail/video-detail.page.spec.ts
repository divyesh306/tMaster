import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VideoDetailPage } from './video-detail.page';

describe('VideoDetailPage', () => {
  let component: VideoDetailPage;
  let fixture: ComponentFixture<VideoDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VideoDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
