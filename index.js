require("dotenv").config()
const express = require("express")
const busboy = require("connect-busboy")
const app = express()
const fileRoute = require("./routes/files")

app.use(express.urlencoded({ extended: true }))
app.use(busboy())
app.use(express.json())

app.use('/cdn/content/files', fileRoute)  //CDN for api.nuconcept.co.uk
app.get('/', (req, res) => {
    res.status(200).send()
})

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Listening on ${process.env.SERVER_PORT}`)
})