import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import styles from './MainLayout.module.css';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <Navbar />
    <main className={styles.main}>
      {children}
    </main>
    <Footer />
  </>
);

export default MainLayout;
