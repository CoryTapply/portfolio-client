import React from 'react';
import PropTypes from 'prop-types';
import './ToggleInput.scss';

const ToggleInput = props => {
  return (
    <div className="ToggleInput-Container">
      <input className="ToggleInput-Input" type="checkbox" id="1" checked={props.value} onChange={event => props.setValue(event.target.checked)} />
      <label className="ToggleInput-Label" htmlFor="1">
        {/* <span>{props.value}</span> */}
        <span />
      </label>
    </div>
  );
};

ToggleInput.propTypes = {
  value: PropTypes.bool,
  placeholder: PropTypes.string,
  showButton: PropTypes.bool,
  setValue: PropTypes.func,
};

ToggleInput.defaultProps = {
  value: false,
  placeholder: 'Place Holder Text',
  showButton: false,
  setValue() {},
};

export default ToggleInput;
