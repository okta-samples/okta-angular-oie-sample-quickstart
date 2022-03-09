import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NextStep } from '@okta/okta-auth-js';
import {
  AuthenticatorControl,
  CheckboxControl,
  Control,
  LabelControl,
  SelectControl,
  TextInputControl
} from './controls/control';

export function inputTransformer(nextStep: NextStep): Control[] {
  if (!nextStep.inputs) return [];

  return nextStep.inputs.filter(i => !!i.label).map(
    ({ name,
       label,
       required,
       type,
       secret,
       maxLength,
       minLength}) => {

      if (type === 'boolean') {
        return new CheckboxControl({key: name, label, required});
      }

      const inputType = secret ? 'password' : 'text';
      return new TextInputControl({key: name, label, required, inputType, minLength, maxLength});
    }
  );
}

export function selectTransformer(nextStep: NextStep): Control[] {
  if (!nextStep.options || !nextStep.inputs) return [];

  const options = nextStep.options.map(({value, label}) => ({value, label}));
  return [new SelectControl({key: nextStep.inputs[0].name, label: '', options})];
}

export function authenticatorTransformer(nextStep: NextStep): Control[] {
  if (!nextStep.authenticator?.contextualData?.qrcode) return [];

  const key = nextStep.name;
  const {qrcode, sharedSecret} = nextStep.authenticator?.contextualData;
  return [new AuthenticatorControl({key, authenticator: {qrCodeUrl: qrcode.href, secret: sharedSecret ?? ''}})];
}

export function securityQuestionTransformer(nextStep: NextStep): Control[] {
  if (!nextStep.authenticator?.contextualData?.questions && !nextStep.authenticator?.contextualData?.enrolledQuestion) return [];

  const {questions, enrolledQuestion} = nextStep.authenticator?.contextualData;

  if (enrolledQuestion) {
    return [new LabelControl({label: enrolledQuestion.question})];
  }

  const key = (nextStep.inputs && nextStep.inputs[0])?.name ?? '';
  const options = questions?.map(({questionKey, question}) => ({value: questionKey, label: question}));
  return [new SelectControl({key, label: 'Choose a security question', options})];
}

@Injectable()
export class FormTransformerService {

  constructor() { }

  public toForm(nextStep: NextStep): {formGroup: FormGroup, questions: Control[] } {
   const questions = this.toQuestions(nextStep);
   const formGroup = this.toFormGroup(questions);
   return {questions, formGroup};
  }

  private toQuestions(nextStep: NextStep): Control[] {
    const questions: Control[] = [];
    questions.push(...authenticatorTransformer(nextStep));
    questions.push(...securityQuestionTransformer(nextStep));
    questions.push(...selectTransformer(nextStep));
    questions.push(...inputTransformer(nextStep));

    return questions;
  }

  private toFormGroup(questions: Control[]): FormGroup {
    const group: any = {};
    questions.forEach(q => group[q.key] = q.formControl());

    return new FormGroup(group);
  }
}
