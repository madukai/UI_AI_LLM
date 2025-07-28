import React, { FC, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import "./llm.css";

interface LLMProps extends React.HTMLAttributes<HTMLDivElement> {}
interface LLMBtnProps extends React.HTMLAttributes<HTMLDivElement> {}

const fetchDataFromLLM = async (msg: object, llmURL: string = '') => {
  const urlEndPoint:string = llmURL || 'http://127.0.0.1:11434/api/chat';
  const apiResponse = await fetch(urlEndPoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(msg)
  });
  const result:string = await apiResponse.text();
  return result;
};

const parseJSONString = (jsonString: string) => {
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

let aiBtnTextState:boolean = false;

const LLM: FC<LLMProps> = () => {
    const [userPrompt, setUserPrompt] = useState('');
    const [aiResponse, setAIResponse] = useState('');
    const [llmEndpoint, setllmEndpoint] = useState('');
    const [llmModel, setllmModel] = useState('gemma3:1b');
    const [btnAISettingText, setBtnAISettingText] = useState('Show AI Setting');

    const invokeAILLMapi = async () => {
      const msg:object = {
        model: llmModel,
        messages: [{ role: 'user', content: userPrompt }],
      };
      const response:string = await fetchDataFromLLM(msg, llmEndpoint);
      const formatResponse:any = JSON.parse(parseJSONString(response));
      console.log(formatResponse);
      const len = formatResponse.length;
      let aiResponse:string = '';
      for (let i = 0; i < len; i++) {
        aiResponse += formatResponse[i].message.content;
      }
      setAIResponse(aiResponse);
    }

    const handlePromptChange = (ev: { target: { value: React.SetStateAction<string>; }; }) => {
      setUserPrompt(ev.target.value);
    }

    const handleLLMEndpoint = (ev: { target: { value: React.SetStateAction<string>; }; }) => {
      setllmEndpoint(ev.target.value);
    }

    const handleLLMModel = (ev: { target: { value: React.SetStateAction<string>; }; }) => {
      setllmModel(ev.target.value);
    }

    const handleBtnAISetting = () => {
      aiBtnTextState = !aiBtnTextState;
      if (aiBtnTextState) {
        setBtnAISettingText('Hide AI Setting');
      } else {
        setBtnAISettingText('Show AI Setting');
      }
    }
    
    return <div>
        <div className="llm-header">React LLM</div>
        <div className="container">
          <div className="form-floating">
            <div className="form-setting">
              <div className="collapse-setting">
                <button className="btn btn-primary" type="button" onClick={handleBtnAISetting} data-bs-toggle="collapse" data-bs-target="#aiSettingCollapse" aria-expanded="false" aria-controls="aiSettingCollapse">
                  {btnAISettingText}
                </button>
                <div className="collapse" id="aiSettingCollapse">
                  <div className="mb-3">
                <label htmlFor="llmEndPointInput" className="form-label">LLM Endpoint</label>
                <input className="form-control llm-endpoint-input" value={llmEndpoint} onChange={handleLLMEndpoint} id="llmEndPointInput" />
              </div>
              <div className="mb-3">
                <label htmlFor="llmModelInput" className="form-label">LLM Model</label>
                <input className="form-control llm-model-input" value={llmModel} onChange={handleLLMModel} id="llmModelInput" />
              </div>
                </div>
              </div>
            </div>
            <div className="blank-divider"></div>
            <div className="form-floating">
              <textarea 
              id="floatingTextarea2"
              className="prompt-input form-control"
              value={userPrompt}
              onChange={handlePromptChange}
              />
              <label htmlFor="floatingTextarea2">Ask AI</label>
            </div>
          </div>
          <button type="button" onClick={invokeAILLMapi} className="invoke-btn btn btn-primary">Ask</button>
          <div className="AI_response container-lg"><p>{aiResponse}</p></div>
        </div>
    </div>;
}

export default LLM;