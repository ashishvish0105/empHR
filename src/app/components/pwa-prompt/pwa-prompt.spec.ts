import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PwaPrompt } from './pwa-prompt';

describe('PwaPrompt', () => {
  let component: PwaPrompt;
  let fixture: ComponentFixture<PwaPrompt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PwaPrompt]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PwaPrompt);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
