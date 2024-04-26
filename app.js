import express, { request, response } from 'express';
import data from './data.json' assert { type: "json"};
import { readableTime } from './helpers/timeInMinutes.js'
import mongoose from 'mongoose'
import 'dotenv/config'

const app = express()
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
const hostname = '127.0.0.1';
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('💽 Database connected'))
  .catch(error => console.error(error))
  const ideaSchema = new mongoose.Schema({
    slug: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true, minLength: 8 },
    timeInMinutes: { type: Number, required: true }, 
    status: { type: Boolean, default: true, required: true }
  })
  
const Idea = mongoose.model('Idea', ideaSchema)


app.get('/',(request, response) => {
    const numberOfIdeas = 3
    response.render('index', {
        numberOfIdeas: numberOfIdeas,
        nameOfThePage: "Ideationheaven",
        numberOfIdeasSold: 0
    })
})

app.get('/ideas', async (request, response) => {
    try{
    const ideas = await Idea.find({timeInMinutes: { $gte: 2 }}).exec()
    response.render('ideas/index', {
        ideas: ideas,
        readableTime: readableTime
    })
    }catch(error) {
        console.error(error)
        response.render('ideas/index', { 
            ideas: [],
            readableTime: readableTime
          })
    }
  })

  app.post('/ideas', async (request, response) => {
    try {
        console.log(request.body)
      const idea = new Idea({
        slug: request.body.slug,
        name: request.body.name,
        description: request.body.description,
        timeInMinutes: request.body.timeInMinutes
      })
      await idea.save()
  
      response.redirect('redirect')
    }catch (error) {
      console.error(error)
      response.render('error')
    }
  })

app.get('/ideas/new', (request, response) => {
    response.render('ideas/new')
    
  })

  app.get('/ideas/:slug', async (request, response) => {
    try {
      const slug = request.params.slug
      const idea = await Idea.findOne({ slug: slug }).exec()
      if(!idea) throw new Error('Idea not found')
  
      response.render('ideas/show', { 
        idea: idea,
        readableTime: readableTime
      })
    }catch(error) {
      console.error(error)
      response.status(404).redirect('Error')
    }
  })

  app.post('/ideas/:slug', async (request, response) => {
    try {
      const idea = await Idea.findOneAndUpdate(
        { slug: request.params.slug }, 
        request.body,
        { new: true }
      )
      
      response.redirect(`/ideas/${idea.slug}`)
    }catch (error) {
      console.error(error)
      response.render('error')
    }
  })



  app.get('/ideas/:slug/edit', async (request, response) => {
    try {
      const slug = request.params.slug
      const idea = await Idea.findOne({ slug: slug }).exec()
      if(!Idea) throw new Error('Idea not found')
  
      response.render('ideas/edit', { idea: idea })
    }catch(error) {
      console.error(error)
      response.status(404).render('error')
    }
  })
  

  app.get('/ideas/:slug/delete', async (request, response) => {
    try {
      await Idea.findOneAndDelete({ slug: request.params.slug })
      
      response.redirect('/ideas')
    }catch (error) {
      console.error(error)
      response.render('error')
      
    }
  })


app.get('/coolpage', (request, response) => {
    response.send( 'hello '+ data.description + ' with the both of you class ' + data.class)
  })


  app.get('/about',(request, response) => {
    const numberOfIdeas = 1
    response.render('about', {
        numberOfIdeas: numberOfIdeas,
        nameOfThePage: "Ideationheaven",
        timeSpend: "2 hours and 61 minutes"
    })
})

app.get('/error', (request, response) => {
  response.render('error')
})

app.get('/redirect', (request, response) => {
  response.render('redirect')
})



  app.get('/api/v1/ideas', (request, response) => {
    response.json({
      ideas: [
        { name: 'Jan', price: 3.50 },
        { name: 'Seif', time: 0.12}
      ]
    })
  })

  app.get('/test',(request, response) => {
    const numberOfIdeas = 40
    response.render('test', {
      numberOfIdeas: numberOfIdeas,
      nameOfThePage: "Ideationheaven",
      numberOfIdeasSold: 0
    })
})


app.listen(process.env.PORT, () => {
  console.log(`👋 Started server on port ${process.env.PORT}`)
})