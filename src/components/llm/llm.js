import React, { useState } from 'react';
import ollama  from 'ollama/browser';
import 'bootstrap/dist/css/bootstrap.css';
import "./llm.css";

function LLM() {
    const [userPrompt, setUserPrompt] = useState('');
    const [aiResponse, setAIResponse] = useState('');

    const invoke = async () => {
      console.log('Button is clicked');
      console.log(userPrompt);
      setAIResponse('Currently Thinking...');
      const response = await ollama.chat({
        model: 'gemma3:1b',
        messages: [{ role: 'user', content: userPrompt }],
      });
      setAIResponse(response.message.content);
    }

    const handleChange = (ev) => {
      setUserPrompt(ev.target.value);
    }

    return (
    <div>
        <div className='llm-header'>React LLM</div>
        <div className='container'>
          <div className="form-floating">
            <textarea 
              id="floatingTextarea2"
              className="form-control"
              value={userPrompt}
              onChange={handleChange}
            />
            <label htmlFor="floatingTextarea2">Ask AI</label>
          </div>
          <button type="button" onClick={invoke} className="invoke-btn btn btn-primary">Invoke</button>
          <div className='AI_response container-lg'><p>{aiResponse}</p></div>
        </div>
    </div>
  );
}

export default LLM;
