import { TextInputControl } from './control';
import { Validators } from '@angular/forms';

describe('TextInputControl', () => {
  it('should set controlType to input for a TextInputControl', () => {
    const control = new TextInputControl();
    expect(control.controlType).toEqual('input');
  })

  it('should create a FormControl with text value and validators', () => {
    const control = new TextInputControl({required: true, maxLength: 5, minLength: 4});

    const actual = control.formControl();
    expect(actual.value).toEqual('');
    expect(actual.hasValidator(Validators.required)).toBeTrue();
    actual.setValue('123456789');
    expect(actual.errors?.['maxlength']).toBeTruthy();
    actual.setValue('123');
    expect(actual.errors?.['minlength']).toBeTruthy();
  })
});
