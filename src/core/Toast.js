import React from "react";
import Style from "./Toast.scss";

const TOAST_DURATION = 50000; // (ms)

export const Toast = ({ icon }) => {
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

export const withToast = Component => {
  return class extends Component {
    componentDidMount() {}
    state = {
      toastIcon: "",
      toastKey: Date.now()
    };

    handleShowToast = toastIcon => {
      this.setState({
        toastIcon,
        toastKey: Date.now()
      });
    };

    render() {
      return (
        <Component
          onShowToast={this.handleShowToast}
          toastKey={this.state.toastKey}
          toastIcon={this.state.toastIcon}
          {...this.props}
        />
      );
    }
  };
};
