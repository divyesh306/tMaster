import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BlocklistPage } from './blocklist.page';

describe('BlocklistPage', () => {
  let component: BlocklistPage;
  let fixture: ComponentFixture<BlocklistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlocklistPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BlocklistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
