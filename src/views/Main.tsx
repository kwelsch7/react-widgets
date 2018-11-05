import * as React from "react";
import { WidgetList } from './WidgetList';

export class Main extends React.PureComponent {
  render() {
    return (
      <div className="container">
        <header>
          <h1>React Widgets</h1>
          <h2>Meeting all your spatula needs</h2>
        </header>
        <div className="content">
          <WidgetList/>
        </div>
      </div>
    );
  }
}
