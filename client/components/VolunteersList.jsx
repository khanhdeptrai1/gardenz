import React from 'react'
import VolunteerListItem from './VolunteerListItem'

function VolunteersList (props) {
  return (
    <>
      <h4>List of Volunteers</h4>
      <ul>{props.volunteers?.map(volunteer => {
        return (
          <VolunteerListItem key={volunteer.userId} attended={volunteer.attended} userId={volunteer.userId} eventId={props.eventId} firstName={volunteer.firstName} lastName={volunteer.lastName} />
        )
      })}
      </ul>
    </>
  )
}

export default VolunteersList
