import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import "./llm.css";

const fetchDataFromLLM = async (msg, llmURL = '') => {
  const urlEndPOint = llmURL || 'http://127.0.0.1:11434/api/chat';
  const  apiResponse = await fetch(urlEndPOint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(msg)
  });
  const result = await apiResponse.text();
  return result;
};

const parseJSONString = (jsonString) => {
  if (!jsonString || typeof jsonString !== 'string') {
    return "Error: Input must be a non-empty string.";
  }

  const regex = /({(?:[^{}]|{[^{}]*})*})/g;

  const matches = [];
  let match;

  while ((match = regex.exec(jsonString)) !== null) {
    matches.push(match[1]);
  }

  if (matches.length === 0) {
    return "Error: No valid JSON objects found in the input string.";
  }

  const formattedJsonString = `[${matches.join(',')}]`;

  try {
    JSON.parse(formattedJsonString);
    return formattedJsonString;
  } catch (e) {
    return `Error: Failed to parse the generated JSON. This might indicate malformed individual JSON objects. Original error: ${e.message}`;
  }
}

function LLM() {
    const [userPrompt, setUserPrompt] = useState('');
    const [aiResponse, setAIResponse] = useState('');
    const [llmEndpoint, setllmEndpoint] = useState('');
    const [llmModel, setllmModel] = useState('');

    const invoke = async () => {
      setAIResponse('Currently Thinking...');
      const msg = {
        model: 'gemma3:1b',
        messages: [{ role: 'user', content: userPrompt }],
      };
      const response = await fetchDataFromLLM(msg, llmEndpoint);
      const formatResponse = JSON.parse(parseJSONString(response));
      const len = formatResponse.length;
      let aiResponse = '';
      for (let i = 0; i < len; i++) {
        aiResponse += formatResponse[i].message.content;
      }
      setAIResponse(aiResponse);
    }

    const handleChange = (ev) => {
      setUserPrompt(ev.target.value);
    }

    const handleLLMEndpoint = (ev) => {
      setllmEndpoint(ev.target.value);
    }

    const handleLLMModel = (ev) => {
      setllmModel(ev.target.value);
    }

    return (
    <div>
        <div className='llm-header'>React LLM</div>
        <div className='container'>
          <div className="form-setting">
              <div className="mb-3">
                <label htmlFor="llmEndPointInput" className="form-label">LLM Endpoint</label>
                <input className="form-control llm-endpoint-input" value={llmEndpoint} onChange={handleLLMEndpoint} id="llmEndPointInput" />
              </div>
              <div className="mb-3">
                <label htmlFor="llmModelInput" className="form-label">LLM Model</label>
                <input className="form-control llm-model-input" value={llmModel} onChange={handleLLMModel} id="llmModelInput" />
              </div>
          </div>
          <div className="form-floating">
            <textarea 
              id="floatingTextarea2"
              className="prompt-input form-control"
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
