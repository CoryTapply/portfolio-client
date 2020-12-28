import React from 'react';
import PropTypes from 'prop-types';
import Style from './Grid.scss';

const Grid = (props) => {
  return <div className="Grid">{props.children}</div>;
};

Grid.propTypes = {};

Grid.defaultProps = {};

export default Grid;
