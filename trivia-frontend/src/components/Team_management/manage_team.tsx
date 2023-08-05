import React from 'react';
import InvitePlayer from './invite_player';
import CreateTeam from './create_team';
const ManageTeam = () => {
    return (
        <div>
            <h1>Create or Manage Teams</h1>
            <CreateTeam />
            <br/>
      <InvitePlayer />
      <br/>
        </div>
    )
}

export default ManageTeam;