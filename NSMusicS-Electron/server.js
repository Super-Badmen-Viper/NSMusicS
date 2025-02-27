const http = require('http');
const Koa = require('koa');
const KoaRouter = require('koa-router');
const cors = require('@koa/cors');
const app = new Koa()
const router = new KoaRouter()
const bodyparser = require('koa-bodyparser');
const SERVER_PORT = 8686;
const { MongoClient, ObjectId } = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017')
router.post('/task/upsert', async (ctx, next) => {
  const db = client.db('task-manager')
  const collection = db.collection('task')
  const doc = ctx.request.body
  const { _id } = doc
  const result = await collection.updateOne(
    { _id: _id || ObjectId() },
    { $set: doc },
    { upsert: true }
  )
  ctx.body = {
    doc,
    result,
  }
})
router.get('/echo', (ctx, next) => {
  ctx.body = ctx
})

app.use(cors())
app.use(bodyparser())
app.use(router.routes())

const server = http.createServer(app.callback())
server.listen(SERVER_PORT)
console.log(`Server running at http://localhost:${SERVER_PORT}`)