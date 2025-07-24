import React, { FC, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import "./llm.css";

interface LLMProps {
  llmEndpoint?: string,
  llmModel?: string
}

const LLM: FC<LLMProps> = () => {
    const [userPrompt, setUserPrompt] = useState('');
    
    return <div>
        <div className='llm-header'>React LLM</div>
    </div>;
}

export default LLM;