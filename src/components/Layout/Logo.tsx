// src/components/Layout/Logo.tsx

import React from 'react';
import styles from './Layout.module.css';

const Logo: React.FC = () => {
  return (
    <div className={styles.logo}>
      {/* You can replace this with an actual logo image */}
      <h1 style={{ color: 'white', textAlign: 'center', lineHeight: '32px', margin: 0, fontSize: '18px' }}>
        Logo
      </h1>
    </div>
  );
};

export default Logo;