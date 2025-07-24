import React, { FC } from 'react';
import LLM from './components/llm/llm';
import './App.css';

interface AppProps {
  title: string;
}

const App: FC<AppProps> = ({ title }) => {
  return <div>
    <h1>{title}</h1>
    <LLM />
  </div>
  
};

export default App;