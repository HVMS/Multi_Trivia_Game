import React from "react";
import { Formik, Form, Field } from 'formik';
import { useState } from "react";
var AWS = require("aws-sdk");

AWS.config.update({
    region: 'us-east-1',
    credentials: new AWS.Credentials({
        accessKeyId: "ASIA3EMVPIHUMJ7JMHUP",
        secretAccessKey: "zPMqiUJt8sx15HcT9I66dgBO70cIeRX98kkervl9",
        sessionToken: "FwoGZXIvYXdzEFwaDH2nrWvV0ScGtOnHZSLAAXYbtIORoJOXmt0DdmeX52fLQOGdtcXcUcarfuzeNqd+WiDORL9jeGsKtPUf0kymzAHwiWKG82ifFOxnvptZ+AqKU326B5iuhwe6Qjc56hyS0H1cv19qYuz9zEgg8ZeWxXj0YiKBlnKfQTAWGL/Qp4kDSXSZ8wr3uvIwCs6oLzeQLGb2L82L76aclsuWbyGcBbzJ81f3kkk9d4YBCMmF/tNveqvYEhVNETknvAEbLJLprz//dZMUZkiaUpTcKQ/ftij1gaemBjItGY4qsxzqzKt66Vwuk7+HcwX43D1QtY0GhrbP8cfgZSSTLemfLv5FueJwrH3l",
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
