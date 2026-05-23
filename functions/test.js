const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
  })

app.get('/test', (req, res) => {
    res.send('Hello World2!')
  })

app.listen(port, () => {
  console.log(`Examples app listening on port ${port}`)
})