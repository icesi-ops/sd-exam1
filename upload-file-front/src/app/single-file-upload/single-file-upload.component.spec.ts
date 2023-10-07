import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleFileUploadComponent } from './single-file-upload.component';

describe('SingleFileUploadComponent', () => {
  let component: SingleFileUploadComponent;
  let fixture: ComponentFixture<SingleFileUploadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SingleFileUploadComponent]
    });
    fixture = TestBed.createComponent(SingleFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
