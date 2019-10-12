import React from "react";
import Style from "./Card.scss";

const Card = props => {
  return <div className="Card-Container">{props.children}</div>;
};

export default Card;
