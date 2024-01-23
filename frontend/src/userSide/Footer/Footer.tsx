// Footer.tsx

import React from 'react';

const Footer: React.FC = () => {
  const footerStyle: React.CSSProperties = {
    background: '#000',
    color: '#fff',
    textAlign: 'center',
    padding: '1rem',
    position: 'fixed',
    bottom: 0,
    width: '100%',
  };

  return (
    <footer style={footerStyle}>
      <p>&copy; 2024 OnHash</p>
    </footer>
  );
};

export default Footer;
