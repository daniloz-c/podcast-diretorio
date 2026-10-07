import React from 'react';
import PropTypes from 'prop-types';

export default function Card({ children, className = '', style = {}, ...props }) {
  const classes = ['card', className].join(' ');

  return (
    <div className={classes} style={style} {...props}>
      {children}
    </div>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  style: PropTypes.object
};