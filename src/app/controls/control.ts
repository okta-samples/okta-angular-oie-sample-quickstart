import { FormControl, ValidatorFn, Validators } from '@angular/forms';

export type ControlType = 'input' | 'checkbox' | 'select' | 'authenticator' | 'label';

export interface Authenticator {
  qrCodeUrl: string;
  secret: string;
}

export abstract class Control {
  public key: string;
  public label: string;
  public required: boolean;
  public controlType: ControlType;
  public inputType: string;
  public minLength: number;
  public maxLength: number;
  public options: {label: string, value: string|{}}[];
  public authenticator: Authenticator | null;

  constructor(options: Partial<Control> = {}) {
    this.key = options.key ?? '';
    this.label = options.label ?? '';
    this.required = !!options.required;
    this.inputType = options.inputType ?? '';
    this.options = options.options ?? [];
    this.minLength = options.minLength ?? 0;
    this.maxLength = options.maxLength ?? 0;
    this.controlType = options.controlType ?? 'input';
    this.authenticator = options.authenticator ?? null;
  }

  public abstract formControl(): FormControl;
}

export class TextInputControl extends Control {
  override controlType = 'input' as ControlType;

  public formControl(): FormControl {
    const validators: ValidatorFn[] = [];
    if (this.required) validators.push(Validators.required);
    if (!!this.maxLength) validators.push(Validators.maxLength(this.maxLength));
    if (!!this.minLength) validators.push(Validators.minLength(this.minLength));

    return new FormControl('', validators);
  }
}

export class CheckboxControl extends Control {
  override controlType = 'checkbox' as ControlType;

  public formControl(): FormControl {
    const validators = this.required ? [Validators.required] : [];
    return new FormControl(false, validators);
  }
}

export class SelectControl extends Control {
  override controlType = 'select' as ControlType;

  public formControl(): FormControl {
    const validators = this.required ? [Validators.required] : [];
    return new FormControl('', validators);
  }
}

export class AuthenticatorControl extends Control {
  override controlType = 'authenticator' as ControlType;

  public formControl(): FormControl {
    return new FormControl('');
  }
}

export class LabelControl extends Control {
  override controlType = 'label' as ControlType;

  public formControl(): FormControl {
    return new FormControl('');
  }
}

