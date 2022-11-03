import React, { useState } from 'react';

const Component = () => {
  const [show, setShow] = useState(false);
  return(
    <>
      <button onClick={() => setShow(prev => !prev)}>Click</button>
      {show && <p>This is your component</p>}
    </>
  );
}

export default Component