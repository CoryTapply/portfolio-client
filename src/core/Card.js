import React from 'react';
import './Card.scss';

const Card = (props) => {
  return <div className="Card-Container">{props.children}</div>;
};

export default Card;
