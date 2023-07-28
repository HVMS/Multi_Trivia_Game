import React, { useState } from 'react';
import { Configuration, OpenAIApi } from "openai";
//require('dotenv').config();

function TeamNameGenerator() {
  const [teamName, setTeamName] = useState('');


    const generateTeamName = async () => {
      console.log("-------");

      const configuration = new Configuration({
        organization: "org-genYHs6tBwtmKmy5LFle9HpW ",
        apiKey: "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",
      });
      console.log("-------");

      const openai = new OpenAIApi(configuration);
      console.log(openai);
      const response=await openai.listEngines();
      console.log(response.data)
      console.log("-------");
    
  };

  return (
    <div>
      <button onClick={generateTeamName}>Generate Team Name</button>
      <p>{teamName}</p>
    </div>
  );
}

export default TeamNameGenerator;
