import * as React from 'react';

interface InputError {
  key: string;
  errors: string[];
}

export interface FormGroupProps {
  className?: string;
  errors?: InputError[];
  help?: string;
  label?: string;
  name: string;
}

export const FormGroup: React.SFC<FormGroupProps> = (props) => {
  const { className, errors, help, name, label } = props;

  /* If just a single error allowed, a key is still needed to verify that this input
        of all the inputs on the form is the one that should be styled differently.
    Alternatively/additionally to the form-group-invalid class on the parent,
        the incoming props.children can be given is-valid or is-invalid
        in addition to the form-control class.
  */
  let errorList: string[] = [];
  errors && errors.forEach((inputError) => {
    if (inputError.key.toLowerCase() === name.toLowerCase()) {
      errorList = errorList.concat(inputError.errors);
    }
  });

  return (
    <div className={`form-group${errorList.length ? ' form-group-invalid' : ''}${className ? ` ${className}` : ''}`}>
      {label && <label htmlFor={name}>{label}</label>}
      {props.children}
      {errorList.length > 0 &&
        <ul className="list-unstyled">
          {errorList.map((feedback, index) => (
            <li key={index}>
              <div className="invalid-feedback">{feedback}</div>
            </li>
          ))}
        </ul>
      }
      {help && <small className="form-text text-muted">{help}</small>}
    </div>
  );
};
