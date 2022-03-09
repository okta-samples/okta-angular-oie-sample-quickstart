import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFormComponent } from './dynamic-form.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormTransformerService } from '../form-transformer.service';
import { Control, LabelControl } from '../controls/control';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('DynamicFormComponent', () => {
  let component: DynamicFormComponent;
  let fixture: ComponentFixture<DynamicFormComponent>;
  const formTransformerSpy = jasmine.createSpyObj<FormTransformerService>(['toForm']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicFormComponent ],
      imports: [ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .overrideProvider(FormTransformerService, {useValue: formTransformerSpy});

    const questions: Control[] = [new LabelControl({key: 'test'})];
    const formGroup = new FormGroup({test: new FormControl('')});
    formTransformerSpy.toForm.and.returnValue({questions, formGroup});
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicFormComponent);
    component = fixture.componentInstance;
    component.nextStep = {name: 'test name'};

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
