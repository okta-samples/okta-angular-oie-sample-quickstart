import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormQuestionComponent } from './form-question.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LabelControl } from '../controls/control';

describe('FormQuestionComponent', () => {
  let component: FormQuestionComponent;
  let fixture: ComponentFixture<FormQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormQuestionComponent ],
      imports: [ReactiveFormsModule]
    })
    .compileComponents();
  });

  it('should create', () => {
    fixture = TestBed.createComponent(FormQuestionComponent);
    component = fixture.componentInstance;
    component.form = new FormGroup({test: new FormControl('')});
    component.question = new LabelControl({key: 'test'});
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
