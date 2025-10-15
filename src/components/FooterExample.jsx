import React from 'react';
// Example of different ways to import the CustomFooter component
// Both of these will now work correctly:

// Default import (this is how App.jsx imports it)
import Footer from './Footer';

// Named import (this will now also work)
// import { CustomFooter } from './Footer';

const FooterExample = () => {
  return (
    <div>
      <h1>Footer Examples</h1>
      <p>This demonstrates how to properly use the CustomFooter component.</p>
      
      {/* Using the default export (as in App.jsx) */}
      <Footer />
      
      {/* Using the named export (now also works) */}
      {/* <CustomFooter /> */}
    </div>
  );
};

export default FooterExample;