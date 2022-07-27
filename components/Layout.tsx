import { NextPage } from 'next';
import styles from '../styles/layout.module.css';
const Layout: NextPage = ({ children }) => {
  return <div id="layout-container">{children}</div>;
};
