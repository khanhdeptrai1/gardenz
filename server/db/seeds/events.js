exports.seed = (knex) => {
  return knex('events').del()
    .then(() => {
      return knex('events').insert([{
        id: 1,
        garden_id: 1,
        title: 'Weeding worker Bee',
        date: '2020-08-27',
        description: 'Its time to get these weeds under control.',
        volunteers_needed: 8
      },
      {
        id: 2,
        garden_id: 1,
        title: 'Sowing Corn',
        date: '2020-08-28',
        description: 'Help get out the lovely corns in the ground!.',
        volunteers_needed: 4
      }])
    })
}