import React from "react";
import { Formik, Form, Field } from 'formik';
import { useState } from "react";
var AWS = require("aws-sdk");

AWS.config.update({
    region: 'us-east-1',
    credentials: new AWS.Credentials({
        accessKeyId: "ASIA3EMVPIHUAGCW5UOI",
        secretAccessKey: "0Q6hEVE8aHGyyrTj/SHbF5Q5CfQZ3wsGcz4s5oyr",
        sessionToken: "FwoGZXIvYXdzEOT//////////wEaDNhFTXZZElqrRPmjtiLAAQY6RS0dHDvTva3Kg7aWr9ePmIHWOv3UgjOJ0fAv7/fHzv3WADHTxVbgNY1/eR8Qa1klD0a3A0yarz79y1RhNl9uY3wRoLEMli7FxQFP4hA7FZeWCx+WiScsmFioZUHDITke+FG1o4nJFhNKA8u8yvCTHjwCGhtAJVh6R/P8RgZiP0lf1AXtzBEuQe9MuFV8rQCl0HF+KmPAGFZ/rw86SLbkkaWQYDdWh5aMROPb0lEbP+iP24FeI4DaoXhQJrytyCj734ymBjItkEHwNPrZIfn12KwTv11fY3bgFhGBIczsekmpPa7emvy7uqVO4lGOF7gGX2Fx",
    }),
});

const InvitePlayer = () => {
    const [teamName, setTeamName] = useState('');
    const [memberEmail, setmemberEmail] = useState('');

    const invitePlayers = () => {
        console.log(memberEmail);
        console.log(teamName);
        var values = {
            "mails": [
              memberEmail
            ],
            "team": teamName,
            "sender": "Admin",//TODO: get this from the user
            "acceptLink": "https://serverless-pubsub-invite-form.s3.amazonaws.com/formInput.html"
          };

        fetch('https://vjwqkti30j.execute-api.us-east-1.amazonaws.com/prod/invite', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                if (data.statusCode == 200) {
                    alert('Invitation Sent');
                }
                else {
                    console.error('Error:', data);
                    alert('Error');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Error');
            });
};
    

return (
    <div>
        <h1>Invite Members</h1>
        <div>
        <Formik
                initialValues={{ teamName: '', memberEmail: '' }}
                onSubmit={invitePlayers}
            >
                <Form>
                    <label htmlFor="email">Email</label>
                    <Field
                        id="memberEmail"
                        name="memberEmail"
                        placeholder="email"
                        value={memberEmail}
                        onChange={(e: any) => setmemberEmail(e.target.value)}
                    />
                    <label htmlFor="Team">Team Name</label>
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


export default InvitePlayer;
