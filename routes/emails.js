const faker = require('faker');
const sample = require('lodash/sample');
const times = require('lodash/times');
const Email = require('../db/models');
const express = require('express');
const router = express.Router();


const createEmail = () => Email.forge({
  uuid: faker.random.uuid(),
  createdAt: faker.date.past(),
  recipient: faker.name.findName().toLowerCase(),
  subject: faker.lorem.words().toLowerCase(),
  sender: faker.name.findName().toLowerCase(),
  category: sample(['physing', 'ransomware', 'hacking']),
  status: 'open', // sample(['open', 'approved', 'rejected']),
  requestedAt: faker.date.recent(),
  requestedBy: faker.name.findName().toLowerCase(),
  requestReason: faker.lorem.sentence().toLowerCase()
}).save();


router.get('/', async (req, res) => {
  const page = req.query.page || 1;
  const query = req.query.search;
  const filter = req.query.filter;

  res.send(await Email
    .query(qb => {
      if (filter) {
        qb.where('status', filter);
      }
    })
    .query(qb => {
      if (query) {
        const queryReg = `%${query.toLowerCase()}%`;
        qb.andWhere(builder => {
          builder
            .where('recipient', 'LIKE', queryReg)
                .orWhere('subject', 'LIKE', queryReg)
                .orWhere('sender', 'LIKE', queryReg)
                .orWhere('category', 'LIKE', queryReg)
                .orWhere('status', 'LIKE', queryReg)
                .orWhere('uuid', 'LIKE', queryReg)
                .orWhere('requestedBy', 'LIKE', queryReg)
                .orWhere('requestReason', 'LIKE', queryReg);
        })
      }
    })
    .query('orderBy', 'requestedAt', 'desc')
    .fetchPage({
      pageSize: 25,
      page,
    }))
});

router.post('/new', async (req, res) => {
  const count = req.query.count || 1;
  await Promise.all(times(count, createEmail));
  res.send('new mail added');
});

router.post('/batch_update', async (req, res) => {
  const request = req.body;
  await Email
    .query()
    .whereIn('id', request.body.ids)
    .update(request.body.delta)
  res.send('updated');
})

module.exports = router;
