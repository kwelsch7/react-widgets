import * as React from 'react';
import { FilteredSingleSelect, FormGroup, SelectMultiple } from '../components';

export class WidgetList extends React.PureComponent {
  render() {
    return (
      <ul className="list-group list-group-flush">
        <li className="list-group-item">
          {/* <FormGroup/> */}
          FormGroup
        </li>
        <li className="list-group-item">
          {/* <FilteredSingleSelect/> */}
          FilteredSingleSelect
        </li>
        <li className="list-group-item">
          {/* <SelectMultiple/> */}
          SelectMultiple
        </li>
      </ul>
    );
  }
}
