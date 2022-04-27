import * as React from "react";
import PropTypes from "prop-types";
import Progress from "./Progress";
import LoginPage from "./Main";


export default class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      listItems: [],
    };
  }
  render() {
    const { title, isOfficeInitialized } = this.props;

    if (!isOfficeInitialized) {
      return (
        <Progress
          title={title}
          logo={require("./../../../assets/logo_only.png")}
          message="Please sideload your addin to see app body."
        />
      );
    }
    const mainContent = <LoginPage />;
    return (
      mainContent
    );
  }
}

App.propTypes = {
  title: PropTypes.string,
  isOfficeInitialized: PropTypes.bool,
};
