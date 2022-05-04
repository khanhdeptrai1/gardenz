const express = require('express')
const log = require('../logger')
const db = require('../db/news')

const router = express.Router()
module.exports = router

router.get('/:gardenid', (req, res) => {
  db.getNewsByGardenId(Number(req.params.gardenid))
    .then((news) => {
      res.status(200).json({ news })
      return null
    })
    .catch((err) => {
      log(err.message)
      res.status(500).json({
        error: {
          title: 'Unable to retrieve news',
        },
      })
    })
})

router.post('/', (req, res) => {
  // const { gardenId, title, content } = req.body
  // TODO: get the current date here (tip: use moment package)
  // TODO: call db functin here to insert a newsItem
  res.sendStatus(201)
})
