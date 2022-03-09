import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Control } from '../controls/control';

@Component({
  selector: 'app-form-question',
  templateUrl: './form-question.component.html',
  styleUrls: ['./form-question.component.scss']
})
export class FormQuestionComponent {
  @Input() public question!: Control;
  @Input() public form!: FormGroup;

  public get fc() {
    return this.form.controls[this.question.key];
  }
}
