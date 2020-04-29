/* global describe, test, beforeAll, expect */
const request = require('supertest')
const app = require('../../src/app')

describe("index" , () => {
    let cookie = undefined

    beforeAll(async () => {
        const response = await request(app).post('/authentification').send({ password : 'demo@2020crm-CMS' }).expect(302)
        
        cookie = response.header['set-cookie']
    })

    test('Should access to index', async () => {
        const response = await request(app).get('/').set('Cookie', cookie).send().expect(200)

        expect(response.text).toContain("/img/logo_cmstraiteur.png")
    })
})