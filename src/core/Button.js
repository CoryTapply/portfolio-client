import React from 'react';
import Style from './Button.scss';

const Button = (props) => {
  return (
    <div className="Button-Container">
      <button type="button" onClick={props.onClick} className="Button-Element">
        {props.children}
      </button>
    </div>
  );
};

export default Button;
