import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import EventItem from './EventItem'

function Events ({ events, isAdmin }) {
  return (
    <div className="mr-6">
      {
        isAdmin
          ? <Link to='/events/new' className="button my-4 is-primary is-pulled-right">Add new event</Link>
          : <Link to='/events/new' className="button my-4 is-primary is-pulled-right">Not Admin (testing button)</Link>
      }
      <h2 className="my-4 is-pulled-left">Events</h2>
      <div className="box clearfix">
        {events.map((event) =>
          <EventItem key={event.id} event={event} isAdmin={isAdmin} />
        )}
      </div>
    </div>
  )
}

function mapStateToProps (state) {
  return {
    isAdmin: state.user.isAdmin
  }
}

export default connect(mapStateToProps)(Events)
