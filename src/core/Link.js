import React from 'react';
import PropTypes from 'prop-types';
import './Link.scss';

/**
 * rel="noopener noreferrer" is used to prevent a phising attack called "tabnabbing"
 * @param {*} props 
 */

const Link = (props) => {
  return (
    <a type="Link" href={props.href} className="Link-Element" rel="noopener noreferrer" target={props.sameTab ? '' : '_blank'}>
      {props.children}
    </a>
  );
};

Link.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  sameTab: PropTypes.bool
};

Link.defaultProps = {
  sameTab: false
};

export default Link;
