import express, { request, response } from 'express';
import data from './data.json' assert { type: "json"};
import { readablePrice } from './helpers/cookie-views.js'
import mongoose from 'mongoose'
import 'dotenv/config'

//  const cookies = [
//   {name: "Strawberryry", slug: "strawberryry",priceInCents: 420, isInStock: true},
//   {name: "Mangogo", slug: "mangogo",priceInCents: 1234, isInStock: true},
//   { name: "Cakeke", slug: "cakeke",priceInCents: 999, isInStock: false}
//  ]
//

const app = express()
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
const hostname = '127.0.0.1';
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('💽 Database connected'))
  .catch(error => console.error(error))
  const cookieSchema = new mongoose.Schema({
    slug: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    priceInCents: { type: Number, required: true }, 
    isInStock: { type: Boolean, default: true, required: true }
  })
  
const Cookie = mongoose.model('Cookie', cookieSchema)

// const usersRouter = require('./controllers/users')

// // ...

// app.use('/api/users', usersRouter)


// cookies.forEach(cookie => {
//     '<li>' + cookie + '</li>'
//   })

app.get('/',(request, response) => {
    const numberOfCookiesInStock = 40
    response.render('index', {
        numberOfCookiesInStock: numberOfCookiesInStock,
        nameOfThePage: "Cookieshop",
        numberOfCookiesSold: 69420
    })
})

app.get('/cookies', async (request, response) => {
    try{
    const cookies = await Cookie.find({priceInCents: { $gte: 2 }}).exec()
    response.render('cookies/index', {
        cookies: cookies,
        readablePrice: readablePrice
    })
    }catch(error) {
        console.error(error)
        response.render('cookies/index', { 
            cookies: [],
            readablePrice: readablePrice
          })
    }
  })

  app.post('/cookies', async (request, response) => {
    try {
        console.log(request.body)
      const cookie = new Cookie({
        slug: request.body.slug,
        name: request.body.name,
        priceInCents: request.body.priceInCents
      })
      await cookie.save()
  
      response.send('Cookie Created')
    }catch (error) {
      console.error(error)
      response.send('Error: The cookie could not be created.')
    }
  })

app.get('/cookies/new', (request, response) => {
    response.render('cookies/new')
  })

  app.get('/cookies/:slug', async (request, response) => {
    try {
      const slug = request.params.slug
      const cookie = await Cookie.findOne({ slug: slug }).exec()
      if(!cookie) throw new Error('Cookie not found')
  
      response.render('cookies/show', { 
        cookie: cookie,
        readablePrice: readablePrice
      })
    }catch(error) {
      console.error(error)
      response.status(404).send('Could not find the cookie you\'re looking for.')
    }
  })

  app.post('/cookies/:slug', async (request, response) => {
    try {
        const cookie = await Cookie.findOneAndUpdate(
            { slug: request.params.slug }, 
            request.body,
            { new: true }
          )
      
        response.redirect(`/cookies/${cookie.slug}`)
    }catch (error) {
      console.error(error)
      response.send('Error: The cookie could not be update.')
    }
  })

  app.get('/cookies/:slug/edit', async (request, response) => {
    try {
      const slug = request.params.slug
      const cookie = await Cookie.findOne({ slug: slug }).exec()
      if(!cookie) throw new Error('Elemnt Cookie not found')
  
      response.render('cookies/edit', { cookie: cookie })
    }catch(error) {
      console.error(error)
      response.status(404).send('Could not find the cookie you\'re looking for.')
    }
  })

  app.get('/cookies/:slug/delete', async (request, response) => {
  try {
    await Cookie.findOneAndDelete({ slug: request.params.slug })
    
    response.redirect('cookies')
  }catch (error) {
    console.error(error)
    response.send('Error: No cookie was deleted.')
  }
})


app.get('/coolpage', (request, response) => {
    response.send( 'hello '+ data.description)
  })


  app.get('/about',(request, response) => {
    const numberOfCookiesInStock = 40
    response.render('about', {
        numberOfCookiesInStock: numberOfCookiesInStock,
        nameOfThePage: "Cookieshop",
        numberOfCookiesSold: 69420
        //!!! connect to database to show how many elements I currently have (Ideas)
    })
})



  app.get('/api/v1/cookies', (request, response) => {
    response.json({
      cookies: [
        { name: 'Chocolate Chip', price: 3.50 },
        { name: 'Banana', price: 3.00 }
      ]
    })
  })

  app.get('/test',(request, response) => {
    const numberOfCookiesInStock = 40
    response.render('test', {
        numberOfCookiesInStock: numberOfCookiesInStock,
        nameOfThePage: "Cookieshop",
        numberOfCookiesSold: 69420
    })
})


  // app.get('/articles/:id', (request, response) => {
//     const articlesId = request.params.id
  
//     response.send(`Wow this here: ${articlesId} is pretty cool now we need actual content for that `)
//   })



app.listen(process.env.PORT, () => {
  console.log(`👋 Started server on port ${process.env.PORT}`)
})