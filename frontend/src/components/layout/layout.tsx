import React, { ReactNode } from 'react';
import { Header } from 'components';
import 'components/layout/layout.scss';

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className='layout'>
      <div className='header'>
        <Header />
      </div>
      <div className='main'>{children}</div>
      <footer className='footer'></footer>
    </div>
  );
};

export default Layout;
