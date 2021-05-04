const { chromium } = require('playwright')
const config = require('../../server/db/knexfile').development
const db = require('knex')(config)

jest.setTimeout(10000)

const imgpath = 'tests/e2e/screenshots/'

let browser
beforeAll(async () => {
  browser = await chromium.launch({ headless: false, slowMo: 500 })
  await db.migrate.latest({ directory: './server/db/migrations' })
})

beforeEach(async () => {
  await db.seed.run({ directory: './server/db/seeds' })
})

afterAll(async () => {
  await browser.close()
})

// USER TESTS

test('Home page should display the text Gardenz', async () => {
  const page = await browser.newPage()
  await page.goto('localhost:3000')
  expect(await page.title()).toMatch('Gardenz')
  await page.screenshot({ path: imgpath + 'home.png' })
  await page.close()
})

test('Clicking register on home goes to /register', async () => {
  const page = await browser.newPage()
  await page.goto('localhost:3000')
  await page.click('text=register')
  expect(await page.url()).toBe('http://localhost:3000/register')
  await page.screenshot({ path: imgpath + 'registerpage.png' })
  await page.close()
})

test('Clicking get started when not logged in redirects to login', async () => {
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.goto('localhost:3000')
  await page.click('text=Get Started')
  expect(await page.url()).toBe('http://localhost:3000/signin')
  await page.screenshot({ path: imgpath + 'redirect.png' })

  await page.close()
})

test('Clicking get sign in goes to /signin', async () => {
  const page = await browser.newPage()
  await page.goto('localhost:3000')
  await page.click('text=Sign in')
  expect(await page.url()).toBe('http://localhost:3000/signin')
  await page.screenshot({ path: imgpath + 'signinpage.png' })

  await page.close()
})

test('Register fill in redirects to garden after signing up', async () => {
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.goto('localhost:3000/register')
  await page.fill('#firstName', 'bob')
  await page.fill('#lastName', 'dylan')
  await page.fill('#username', 'bob')
  await page.fill('#password', 'bob')
  await page.fill('#email', 'bob@peteremail.com')
  await page.selectOption('select#garden', '1')
  await Promise.all([
    page.waitForNavigation(),
    await page.click('button', { force: true })
  ])
  expect(await page.url()).toBe('http://localhost:3000/garden')
  await page.screenshot({ path: imgpath + 'registersuccess.png' })
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(page.close())
    }, 2000)
  })
})

test('Login', async () => {
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.goto('localhost:3000')
  await page.click('text=Sign in')
  expect(await page.url()).toBe('http://localhost:3000/signin')
  await page.fill('#username', 'member')
  await page.fill('#password', 'member')
  await page.click('button', { force: true })
  await page.screenshot({ path: imgpath + 'signinsuccess.png' })
  expect(await page.url()).toBe('http://localhost:3000/garden')
  await page.close()
})

test('Login & Logout', async () => {
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.goto('localhost:3000')
  await page.click('text=Sign in')
  expect(await page.url()).toBe('http://localhost:3000/signin')
  await page.fill('#username', 'member')
  await page.fill('#password', 'member')
  await page.click('button', { force: true })
  expect(await page.url()).toBe('http://localhost:3000/garden')
  await page.click('text=Log out')
  await page.screenshot({ path: imgpath + 'logoutsuccess.png' })
  expect(await page.url()).toBe('http://localhost:3000/')
  await page.close()
})

test('Login & volunteer', async () => {
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.goto('localhost:3000')
  await page.click('text=Sign in')
  expect(await page.url()).toBe('http://localhost:3000/signin')
  await page.fill('#username', 'member')
  await page.fill('#password', 'member')
  await page.click('button', { force: true })
  expect(await page.url()).toBe('http://localhost:3000/garden')
  await page.click('text=Volunteer')
  expect(await page.content()).toMatch('Un-Volunteer')
  await page.screenshot({ path: imgpath + 'volunteersuccess.png' })
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(page.close())
    }, 2000)
  })
})
test('Login & volunteer then logout, relogin and un-volunteer', async () => {
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.goto('localhost:3000')
  await page.click('text=Sign in')
  expect(await page.url()).toBe('http://localhost:3000/signin')
  await page.fill('#username', 'member')
  await page.fill('#password', 'member')
  await page.click('button', { force: true })
  expect(await page.url()).toBe('http://localhost:3000/garden')
  await page.click('text=Volunteer')
  expect(await page.content()).toMatch('Un-Volunteer')
  await page.click('text=Log out')
  await page.click('text=Sign in')
  expect(await page.url()).toBe('http://localhost:3000/signin')
  await page.fill('#username', 'member')
  await page.fill('#password', 'member')
  await page.click('button', { force: true })
  expect(await page.url()).toBe('http://localhost:3000/garden')
  await page.click('text=Un-Volunteer')
  expect(await page.content()).toMatch('Volunteer')
  await page.screenshot({ path: imgpath + 'un-volunteersuccess.png' })
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(page.close())
    }, 2000)
  })
})

// ADMIN TESTS

test('Login as admin', async () => {
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.goto('localhost:3000')
  await page.click('text=Sign in')
  expect(await page.url()).toBe('http://localhost:3000/signin')
  await page.fill('#username', 'admin')
  await page.fill('#password', 'admin')
  await page.click('button', { force: true })
  expect(await page.url()).toBe('http://localhost:3000/garden')
  await page.screenshot({ path: imgpath + 'adminsigninsuccess.png' })
  page.close()
})

test('Admin can login and add event', async () => {
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.goto('localhost:3000')
  await page.click('text=Sign in')
  expect(await page.url()).toBe('http://localhost:3000/signin')
  await page.fill('#username', 'admin')
  await page.fill('#password', 'admin')
  await page.click('button', { force: true })
  expect(await page.url()).toBe('http://localhost:3000/garden')
  await page.click('text=Add New Event')
  expect(await page.url()).toBe('http://localhost:3000/events/new')
  await page.fill('#title', 'Christmas Gardening!')
  await page.fill('[type=date]', '2021-12-25')
  await page.fill('[type=number]', '100')
  await page.fill('#description', "I don't want a lot for Christmas, there is just one thing I need, I don't care about the presents, underneath the Christmas tree, I just want you for my own, more than you could ever know, make my wish come true, all I want for Christmas is you")
  await page.click('button', { force: true })
  expect(await page.url()).toBe('http://localhost:3000/garden')
  await page.screenshot({ path: imgpath + 'eventadded.png', fullPage: true })
  expect(await page.content()).toMatch('Christmas Gardening!')
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(page.close())
    }, 2000)
  })
})

test('Admin can login and add event, then edit', async () => {
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.goto('localhost:3000')
  await page.click('text=Sign in')
  expect(await page.url()).toBe('http://localhost:3000/signin')
  await page.fill('#username', 'admin')
  await page.fill('#password', 'admin')
  await page.click('button', { force: true })
  expect(await page.url()).toBe('http://localhost:3000/garden')
  await page.click('text=Edit Event')
  await page.fill('#title', 'Come for a fun day out weeding!')
  await page.fill('[type=date]', '2020-08-28')
  await page.fill('[type=number]', '50')
  await page.fill('#description', 'Please come out and help us, we need alot more volunteers now on the new day.')
  await page.click('button', { force: true })
  expect(await page.url()).toBe('http://localhost:3000/garden')
  expect(await page.content()).toMatch('Come for a fun day out weeding!')
  await page.screenshot({ path: imgpath + 'eventedited.png', fullPage: true })

  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(page.close())
    }, 2000)
  })
})
