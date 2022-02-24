import React from 'react';
import { hosts } from '../utils/fetchRequest';
import './Toast.scss';

const TOAST_DURATION = 50000; // (ms)

export const Toast = ({ icon }) => {
  return (
    <div className="Toast">
      <img className="Toast-Icon" src={hosts.MAIN_SERVICE + `resources/icons/${icon}.svg`} />
    </div>
  );
};

export default Toast;

export const withToast = (Component) => {
  return class extends React.Component {
    state = {
      toastIcon: '',
      toastKey: Date.now(),
    };

    componentDidMount() {}

    handleShowToast = (toastIcon) => {
      this.setState({
        toastIcon,
        toastKey: Date.now(),
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
