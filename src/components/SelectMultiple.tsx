// Lib
import * as React from 'react';
import * as ReactDOM from 'react-dom';

// App
import { FormGroup, FormGroupProps } from './FormGroup';

export interface SelectOption {
  name: string;
  value: string;
}

export interface SelectMultipleProps extends FormGroupProps {
  className?: string;
  name: string;
  options: SelectOption[];
  placeholder: string;
  handleOptionCheck(option: SelectOption): void;
  clearSelection(): void;
}

export interface SelectMultipleState {
  isOpen: boolean;
  selectedOptions: SelectOption[];
}

export class SelectMultiple extends React.PureComponent<SelectMultipleProps, SelectMultipleState> {
  constructor(props: SelectMultipleProps) {
    super(props);

    this.state = { isOpen: false, selectedOptions: [] };
  }

  public componentWillMount() {
    document.addEventListener('click', this.handleClickOutside, false);
  }

  public componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside, false);
  }

  public render() {
    const { className, errors, help, label, name, options, placeholder } = this.props;
    const { isOpen, selectedOptions } = this.state;

    return (
      <FormGroup
        className={`select-multiple position-relative d-inline-block ${className}`}
        name={name}
        errors={errors}
        help={help}
        label={label}
      >
        <button
          onClick={this.toggleOpen}
          onKeyPress={this.handleHeaderKeyPress}
          className={`dropdown-button form-control${isOpen ? ' retain-focus' : ''}`}
        >
          <span>{placeholder} ({selectedOptions.length})</span>
          <i className={`fas fa-caret-${isOpen ? 'up' : 'down'}`}></i>
        </button>
        {isOpen &&
          <div className="dropdown-body">
            {options.map((option) => (
              <OptionWrapper
                option={option}
                isChecked={selectedOptions.indexOf(option) >= 0}
                checkOption={this.props.handleOptionCheck}
              />
            ))}
            <button
              onClick={this.clearSelection}
              disabled={selectedOptions.length === 0}
              className="btn btn-secondary float-right mt-2"
            >
              Clear
            </button>
          </div>
        }
      </FormGroup>
    );
  }

  private clearSelection = () => {
    this.props.clearSelection();
    this.setState({ selectedOptions: [] });
  }

  private toggleOpen = () => {
    this.setState({ isOpen: !this.state.isOpen });
  }

  private handleClickOutside = (e: any) => {
    if (e && e.target) {
      const topNode = ReactDOM.findDOMNode(this);
      if (!topNode.contains(e.target)
          || e.target.className.indexOf('form-control-label') >= 0
          || e.target.className.indexOf('form-group') >= 0
          || e.target.className.indexOf('select-multiple') >= 0) {
        this.setState({ isOpen: false });
      }
    }
  }

  private handleHeaderKeyPress = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter') {
      this.toggleOpen();
    }
  }
}

// Wrapper for option is used instead of the <div> in render() being used
// directly in the SelectMultiple component so that we can avoid passing the onClick
// () => this.props.handleOptionCheck(option). This will prevent creating a new
// function on every render.
// https://codeburst.io/when-to-use-component-or-purecomponent-a60cfad01a81

interface OptionWrapperProps {
  option: SelectOption;
  isChecked: boolean;
  checkOption(option: SelectOption): void;
}

class OptionWrapper extends React.PureComponent<OptionWrapperProps> {
  constructor(props: OptionWrapperProps) {
    super(props);
  }

  public render() {
    const { isChecked, option } = this.props;

    return (
      <div
        className="option"
        onClick={this.handleOptionClick}
        onKeyPress={this.handleOptionKeyPress}
        role="checkbox"
        aria-checked={isChecked}
        tabIndex={0}
        key={`option-${option.value}`}
      >
        <i className={`mr-1 fas fa-${isChecked ? 'check-' : ''}square`}/>
        {option.name}
      </div>
    );
  }

  private handleOptionClick = () => this.props.checkOption(this.props.option);

  private handleOptionKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      this.handleOptionClick();
    }
  }
}
