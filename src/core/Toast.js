import React, { Component, Fragment } from "react";
import Style from "./Toast.scss";

const TOAST_DURATION = 50000; // (ms)

const Toast = ({ icon }) => {
  return (
    <div className="Toast">
      <img
        className="Toast-Icon"
        src={`http://localhost:9090/resources/icons/${icon}.svg`}
      />
    </div>
  );
};

export default Toast;

export const withCircularToast = Component => {
  return class extends Component {
    componentDidMount() {
      console.log('mounted the hoc')
    }
    state = {
      toastIcon: "",
      toastKey: Date.now()
    };

    activeTimer = null;

    handleShowToast = toastIcon => {
      this.setState({
        toastIcon,
        toastKey: Date.now()
      });

      clearTimeout(this.activeTimer);
    };

    render() {
      console.log('redering the hoc', this.state)
      const renderToast = this.state.toastIcon;
      return (
        <Fragment>
          <Component onShowToast={this.handleShowToast} />
          {renderToast && <Toast key={this.state.toastKey} center cirlce icon={this.state.toastIcon} />}
        </Fragment>
      );
    }
  };
};
