// src/components/Layout/Logo.tsx

import React from 'react';
import styles from './Layout.module.css';

const Logo: React.FC = () => {
  return (
    <div className={styles.logo}>
      <h1 className='text-white text-center text-xl  leading-8	m-2.5 p-4'>
        Logo
      </h1>
    </div>
  );
};

export default Logo;