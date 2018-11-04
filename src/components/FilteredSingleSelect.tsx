// Lib
import * as React from 'react';

// App
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Input, InputGroup, InputGroupAddon } from 'reactstrap'; // Replace with bootstrap classed html tags
import { FormGroup, FormGroupProps } from './FormGroup';

export interface SingleSelectOption {
  name: string;
  value: number;
}

export interface FilterSingleProps extends FormGroupProps {
  checkedOption?: SingleSelectOption;
  className?: string;
  options: SingleSelectOption[];
  filterPlaceholder?: string;
  handleChange(e: any): void;
  updateChecked(option: SingleSelectOption): void;
}

export interface FilterSingleState {
  filteredOptions: SingleSelectOption[];
  isOpen: boolean;
}

export class FilteredSingleSelect extends React.PureComponent<FilterSingleProps, FilterSingleState> {
  private timeOut: number;

  constructor(props: FilterSingleProps) {
    super(props);

    this.timeOut = 0;
    this.state = { filteredOptions: props.options, isOpen: false };
  }

  public render() {
    const {
      checkedOption,
      className,
      errors,
      help,
      label,
      name,
      filterPlaceholder,
    } = this.props;

    const { filteredOptions } = this.state;

    const classes = `filtered-single-select form-control p-0
      ${className ? className : ''}
      ${this.state.isOpen ? ' retain-focus' : ''}
      ${label ? '' : 'text-gray-darker'}`;
    return (
      <FormGroup errors={errors} help={help} label={label} name={name}>
        <Dropdown
          className={classes}
          isOpen={this.state.isOpen}
          toggle={this.toggleOpen}
        >
          <DropdownToggle className="dropdown-toggle">
            {this.state.isOpen
              ? <i className="fas fa-caret-up float-right"/>
              : <i className="fas fa-caret-down float-right" />
            }
            {checkedOption ? checkedOption.name : 'Select one:'}
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem role="search" tag="div" disabled>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <span className="input-group-text"><i className="fas fa-search"/></span>
                </InputGroupAddon>
                <Input
                  type="search"
                  placeholder={filterPlaceholder}
                  onChange={this.searchHandler}
                />
              </InputGroup>
            </DropdownItem>
            <div className="radio-group" role="radiogroup" tabIndex={-1}>
              {filteredOptions.map(this.renderOption)}
            </div>
          </DropdownMenu>
        </Dropdown>
      </FormGroup>
    );
  }

  public filterOptions(searchText: string) {
    const options = this.props.options;
    const searchTerm = searchText.toLowerCase();
    if (searchTerm.length < 1 || !options) {
      return options;
    }

    return options.filter(option => option.name.toLowerCase().indexOf(searchTerm) >= 0);
  }

  public searchHandler = (e: any) => {
    const waitTime = 400;
    const text = e.target.value;
    window.clearTimeout(this.timeOut);
    this.timeOut = window.setTimeout(() => {
      this.setState({ filteredOptions: this.filterOptions(text) });
    }, waitTime);
  }

  private renderOption = (option: SingleSelectOption) => {
    const isChecked = this.isChecked(option);
    const checkedIcon = isChecked
      ? <i className="fas fa-dot-circle mr-2"/>
      : <i className="far fa-circle mr-2" />;

    return (
      <DropdownItemWrapper
        isChecked={!!isChecked}
        option={option}
        toggleOpen={this.toggleOpen}
        updateChecked={this.props.updateChecked}
        key={`option-${option.value}`}
      >
        {checkedIcon}{option.name}
      </DropdownItemWrapper>
    );
  }

  private isChecked = (option: SingleSelectOption) => this.props.checkedOption && option.value === this.props.checkedOption.value;

  private toggleOpen = () => {
    this.setState({ isOpen: !this.state.isOpen, filteredOptions: this.props.options });
  }
}

interface DropdownItemWrapperProps {
  isChecked: boolean;
  option: SingleSelectOption;
  toggleOpen(): void;
  updateChecked(option: SingleSelectOption): void;
}

class DropdownItemWrapper extends React.PureComponent<DropdownItemWrapperProps> {
  constructor(props: DropdownItemWrapperProps) {
    super(props);
  }

  public render() {
    return (
      <DropdownItem
        role="radio"
        aria-checked={this.props.isChecked}
        tag="div"
        className={this.props.isChecked ? 'selected' : undefined}
        onClick={this.handleClick}
        onKeyPress={this.handleKeyPress}
      >
        {this.props.children}
      </DropdownItem>
    );
  }

  private handleClick = () => this.props.updateChecked(this.props.option);

  private handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      this.props.updateChecked(this.props.option);
      this.props.toggleOpen();
    }
  }
}
