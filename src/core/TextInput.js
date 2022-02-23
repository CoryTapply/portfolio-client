import React from 'react';
import PropTypes from 'prop-types';
import './TextInput.scss';

const TextInput = props => {
  return (
    <div className="TextInput-Container">
      <input
        type="text"
        className="TextInput-Element"
        value={props.value}
        onChange={event => { props.setValue(event.target.value); event.preventDefault(); event.stopPropagation();}}
        placeholder={props.placeholder}
      />
      {props.showButton && (<button type="submit"><i class="icon ion-android-arrow-forward"></i></button>)}
    </div>
  );
};

TextInput.propTypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string,
  showButton: PropTypes.bool,
  setValue: PropTypes.func,
};

TextInput.defaultProps = {
  value: '',
  placeholder: 'Place Holder Text',
  showButton: false,
  setValue() {},
};

export default TextInput;
