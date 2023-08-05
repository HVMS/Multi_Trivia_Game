import { Formik, Form, Field } from 'formik';
import { useState } from "react";
import './css/createTeam.css'
import { Configuration, OpenAIApi } from "openai";

const createTeam = () => {
    const [teamName, setTeamName] = useState<any>('');

    const user = localStorage.getItem('email');
    
    async function generateTeamName(e:any) {
        e.preventDefault();
      const configuration = new Configuration({
        apiKey: process.env.REACT_APP_OPENAI_API_KEY,
      });
      const openai = new OpenAIApi(configuration);
      
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: "Generate a unique team name of 15 characters or less for a quiz game like kahoot, last 4 characters are numbers. Space is allowed. The first 11 characters should be meaningful",
        max_tokens: 15,
        temperature: 0.5,
      });
      console.log(response);
      console.log(response.data.choices[0])
      let newName=response.data.choices[0].text?.split('\n').join('');
      console.log(newName);
        setTeamName(newName);
    }
    

    const handleSubmit = (values: any) => {
        console.log(teamName);
        console.log(user);
        values = {
            "Team": teamName,
            "user1": user,
        };
        fetch('https://67u4ndnjaf.execute-api.us-east-1.amazonaws.com/prod/create-team', {
            method: 'POST',
            body: JSON.stringify(values),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                if(data.statusCode == 200){
                    alert('Team Created');
                }
                else{
                    console.error('Error:', data);
                    alert(data);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Error');
            });
    };

    return (
        <div className='create-team-form'>
            <h1>Create Team</h1>
            <div>
            <Formik
                    initialValues={{ teamName: '', user1: '' }}
                    onSubmit={(initialValues)=>handleSubmit(initialValues)}
                >
                    <Form>
                        <button onClick={(e:any)=>generateTeamName(e)}>Generate Team Name</button>
                        <br/>
                        <br/>
                        <Field
                            id="Team"
                            name="Team"
                            placeholder="Team Name"
                            value={teamName}
                            onChange={(e: any) => setTeamName(e.target.value)}
                        />

                        <button type="submit">Submit</button>
                    </Form>
                </Formik>
            </div>
        </div>
    );
};


export default createTeam;
