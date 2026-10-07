import React from 'react';

export function Card({ children, className = '', style = {}, ...props }) {
  const classes = ['card', className].join(' ');

  return (
    <div className={classes} style={style} {...props}>
      {children}
    </div>
  );
}

export default Card;
