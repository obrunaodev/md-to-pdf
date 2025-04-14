import React from 'react';

function BoxedContainer({children}) {
  return (
    <div className="container mx-auto w-full px-4 lg:px-8">{children}</div>
  );
}

export default BoxedContainer;
