import * as React from "react";

export interface MainProps {
  something: string;
}

export class Main extends React.Component<MainProps> {
    render() {
        return <h1>Hello from {this.props.something}!</h1>;
    }
}