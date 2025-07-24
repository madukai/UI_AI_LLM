import React from 'react';
import { FC } from 'react';
import './App.css';

interface AppProps {
  title: string;
}

const App: FC<AppProps> = ({ title }) => {
  return <h1>{title}</h1>;
};

export default App;