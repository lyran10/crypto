import React from "react";

export class ErrorBoundaries extends React.Component {
  constructor() {
    super();
    this.state = {
      error: false,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      error: true,
    };
  }

  render() {
    if (this.state.error) {
      return <h1>Error</h1>;
    }
    return this.props.children;
  }
}
