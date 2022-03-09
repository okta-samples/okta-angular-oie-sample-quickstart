import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NextStep } from '@okta/okta-auth-js';
import { FormGroup } from '@angular/forms';
import { Control } from '../controls/control';
import { FormTransformerService } from '../form-transformer.service';

export type USER_ACTION = 'submit' | 'cancel' | 'skip';
export interface UserAction {
  action: USER_ACTION;
  values?: object;
}

@Component({
  selector: 'app-okta-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
  providers: [FormTransformerService]
})
export class DynamicFormComponent {
  @Input() public set nextStep(nextStep: NextStep) {
    this.formTitle = nextStep.name;
    this.canSkip = nextStep.canSkip ?? false;
    const {formGroup, questions} = this.formTransformerService.toForm(nextStep);
    this.form = formGroup;
    this.questions = questions;
  };
  @Output() public userInput: EventEmitter<UserAction> = new EventEmitter<UserAction>();

  public formTitle = '';
  public form!: FormGroup;
  public questions: Control[] = [];
  public canSkip = false;

  constructor(private formTransformerService: FormTransformerService) { }

  public onCancel() {
    this.userInput.emit({action: 'cancel'});
  }

  public onSkip() {
    this.userInput.emit({action: 'skip', values: {skip: true}});
  }

  public onSubmit() {
    if (!this.form.valid) return;
    this.userInput.emit({action: 'submit', values:this.form.value});
  }
}
