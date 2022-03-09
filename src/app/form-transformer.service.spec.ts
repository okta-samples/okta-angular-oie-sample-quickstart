import { TestBed } from '@angular/core/testing';

import {
  authenticatorTransformer,
  FormTransformerService,
  inputTransformer,
  securityQuestionTransformer,
  selectTransformer
} from './form-transformer.service';
import { NextStep } from '@okta/okta-auth-js';
import {
  AuthenticatorControl,
  CheckboxControl,
  LabelControl,
  SelectControl,
  TextInputControl
} from './controls/control';

describe('FormTransformerService', () => {
  let service: FormTransformerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormTransformerService]
    });
    service = TestBed.inject(FormTransformerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

describe('input transformer', () =>  {
  it('should transform text and checkbox controls', () => {
    const nextStep = {
      inputs: [
        {name: 'typey', label: 'Typey Label', required: true, maxLength: 5, minLength: 1},
        {name: 'checky', label: 'Checky Label', required: false, type: 'boolean'},
        {name: 'secret', label: 'Secret', secret: true}
      ]
    } as NextStep;

    const expected = [
      new TextInputControl({key: 'typey', label: 'Typey Label', inputType: 'text', required: true, minLength: 1, maxLength: 5}),
      new CheckboxControl({key: 'checky', label: 'Checky Label'}),
      new TextInputControl({key: 'secret', label: 'Secret', inputType: 'password'})
    ];

    const actual = inputTransformer(nextStep);
    expect(actual).toEqual(expected);
  })

  it('should not transform when Input doesn\'t have a label', () => {
    const nextStep = {
      inputs: [
        {name: 'typey', required: true},
        {name: 'tappy', label: 'Tappy Label'},
      ]
    } as NextStep;

    const expected = [
      new TextInputControl({key: 'tappy', label: 'Tappy Label', inputType: 'text'})
    ];

    const actual = inputTransformer(nextStep);
    expect(actual).toHaveSize(1);
    expect(actual).toEqual(expected);
  })

  it('should not transform if there are no inputs', () => {
    const nextStep = {} as NextStep;

    expect(inputTransformer(nextStep)).toHaveSize(0);
  });
});

describe('select transformer', () => {
  it('should transform', () => {
    const nextStep = {
      inputs: [
        {name: 'Name', label: ''}
      ],
      options: [
        {value: 'one', label: '1'},
        {value: 'two', label: '2'}
      ]
    } as NextStep;

    const expected = [new SelectControl({key: 'Name', options: [{value: 'one', label: '1'}, {value: 'two', label: '2'}]})];
    const actual = selectTransformer(nextStep);
    expect(actual).toEqual(expected);
  });

  it('should not transform when missing options or inputs', () => {
    const nextStep = {} as NextStep;
    expect(selectTransformer(nextStep)).toHaveSize(0);
  })
});

describe('authenticator transform', () => {
  it('should transform', () => {
    const nextStep = {
      name: 'authy',
      authenticator: {
        contextualData: {
          qrcode: {
            href: 'linky'
          },
          sharedSecret: 'sharing is caring'
        }
      }
    } as NextStep;

    const expected = [
      new AuthenticatorControl({key: 'authy', authenticator: {qrCodeUrl: 'linky', secret: 'sharing is caring'}})
    ];

    const actual = authenticatorTransformer(nextStep);
    expect(actual).toEqual(expected);
  });

  it('should not transform when qrcode is undefined', () => {
    const nextStep = {
      authenticator: {
        contextualData: {
        }
      }
    } as NextStep;

    expect(authenticatorTransformer(nextStep)).toHaveSize(0);
  });
});

describe('security question transformer', () => {
  it('should transform questions in a SelectControl', () => {
    const nextStep = {
      inputs: [
        {
          name: 'questionKey',
          type: 'string',
          require: true
        },
      ],
      authenticator: {
        contextualData: {
          questionKeys: [
            'one',
            'two',
            'three',
          ],
          questions: [
            {
              questionKey: 'three',
              question: '3'
            },
            {
              questionKey: 'one',
              question: '1'
            },
            {
              questionKey: 'two',
              question: '2'
            }
          ]
        },
      }
    };

    const expected = [
      new SelectControl({
        key: 'questionKey',
        label: 'Choose a security question',
        options: [
          { value: 'three', label: '3'},
          { value: 'one', label: '1'},
          { value: 'two', label: '2'}
        ]
      })
    ];

    const actual = securityQuestionTransformer(nextStep as unknown as NextStep);
    expect(actual).toEqual(expected)
  })

  it('should transform enrollment as a LabelControl', () => {
    const nextStep = {
      authenticator: {
        contextualData: {
          enrolledQuestion:
            {
              question: 'Hello?'
            }
        }
      }
    } as NextStep;

    const expected = [new LabelControl({label: 'Hello?'})];

    const actual = securityQuestionTransformer(nextStep);
    expect(actual).toEqual(expected);
  });

  it('should not transform if NextStep is missing questions or enrolledQuestion', () => {
    const nextStep = {} as NextStep;

    expect(securityQuestionTransformer(nextStep)).toHaveSize(0);
  });
});
