import React, { useState } from 'react';
import { Configuration, OpenAIApi } from "openai";

function TeamNameGenerator() {
  const [teamName, setTeamName] = useState('');



async function generateTeamName() {
  const configuration = new Configuration({
    apiKey: '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',
  });
  const openai = new OpenAIApi(configuration);
  
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: "Generate a unique team name of 15 characters or less for a quiz game like kahoot, last 4 characters are numbers. Space is allowed. The first 11 characters should be meaningful",
    max_tokens: 15,
    temperature: 0.5,
  });
  console.log(response); 

}


  return (
    <div>
      <button onClick={generateTeamName}>Generate Team Name</button>
      <p>{teamName}</p>
    </div>
  );
}

export default TeamNameGenerator;
