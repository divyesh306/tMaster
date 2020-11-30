import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VideolistCategoryPage } from './videolist-category.page';

describe('VideolistCategoryPage', () => {
  let component: VideolistCategoryPage;
  let fixture: ComponentFixture<VideolistCategoryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideolistCategoryPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VideolistCategoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
