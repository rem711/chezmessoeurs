/* global test */
const request = require('supertest')
const app = require('../../src/app')


test('Should access to index', async () => {
    await request(app).get('/').send().expect(200)
})