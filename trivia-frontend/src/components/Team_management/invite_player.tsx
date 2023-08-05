import { Formik, Form, Field } from 'formik';
import { useState, useEffect } from "react";
import './css/inviteTeam.css'

interface Team {
    teamName: string;
  }

const InvitePlayer = () => {
    const [memberEmail, setmemberEmail] = useState('');
    const [selectedTeam, setSelectedTeam] = useState('');
    const [teams, setTeams] = useState<Team[]>([]);

    const user = localStorage.getItem('email');

    useEffect(() => {
        fetchTeamNames(user);
    }, []);

    const fetchTeamNames = async (user: string | null) => {
        console.log(user);
        fetch('https://k4ru2wkr7a.execute-api.us-east-1.amazonaws.com/prod/fetchTeamNames', {
          method: 'POST',
          body: JSON.stringify({
            'email': user,
          }),
        }).then((response) => {
          return response.json();
        })
          .then((data) => {
            console.log(data);
            if (data.length > 0) {
              setTeams(data);
            }
          }).catch((error) => {
            console.error('Error:', error);
          });
      };

    const selectTeam = (team: string) => {
        console.log(team);
        setSelectedTeam(team);
    };

    const invitePlayers = () => {
        console.log(memberEmail);
        console.log(selectedTeam);

        var values = {
            "mails": [
              memberEmail
            ],
            "team": selectedTeam,
            "sender": user,
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
    <div className='invite-player-form'>
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
              as="select"
              id="teamList"
              name="teamList"
              onChange={(e: any) => selectTeam(e.target.value)}
            >
            {teams.map((team: Team, index: number) => (
            <option key={index}  >
                {Object.values(team)[0]}
            </option>
            ))}
            <option value="">Select a team</option>
            </Field>
                    <button type="submit">Submit</button>

                </Form>
                
            </Formik>
            
        </div>
        <br/>

        <button onClick={()=>window.location.href = '/team-stats'} style={{background:'grey'}}>Check Team Stats</button>

    </div>
);
};


export default InvitePlayer;
