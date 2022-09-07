const router = require("express").Router()
const path = require("path")
const { randomFillSync } = require("crypto")
const os = require("os")
const fs = require("fs")

function random() {
    const buf = Buffer.alloc(16)
    let value = randomFillSync(buf).toString('hex')
    console.log(value)
    return value
}

//Uploads a new file to the network
router.post('/', async (req, res) => {
    const bb = req.busboy
    const filestring = random()
    let extension;
    bb.on('file', (name, file, info) => {
        const { filename } = info
        extension = filename.split(".")[1]
        const saveTo = path.join(`./assets/files/`, `${filestring}.${extension}`)
        file.pipe(fs.createWriteStream(saveTo))
    })
    bb.on('close', () => {
        res.writeHead(200, { 'Connection': 'close' })
        res.end(`file available at: http://localhost:7082/cdn/content/files/${filestring}.${extension}`)
    })
    req.pipe(bb)
})

//Gets a file from given ID
router.get('/:id', async (req, res) => {
    let id = req.params.id.toString()
    res.sendFile(path.resolve(`./assets/files/${id}`))
})

//Overwrites a file from given ID
router.post('/:id', async (req, res) => {
    const bb = req.busboy
    const filestring = req.params.id.toString()
    bb.on('file', (name, file, info) => {
        const { filename } = info
        extension = filename.split(".")[1]
        const saveTo = path.join(`./assets/files/`, `${filestring}`)
        file.pipe(fs.createWriteStream(saveTo))
    })
    bb.on('close', () => {
        res.writeHead(200, { 'Connection': 'close' })
        res.end(`file available at: http://localhost:7082/cdn/content/files/${filestring}`)
    })
    req.pipe(bb)
})

//Deletes a file from given ID
router.delete('/:id', async (req, res) => {
    let id = req.params.id.toString()
    const fileToDelete = path.resolve(`./assets/files/${id}`)
    fs.unlink(fileToDelete, (err) => {
        if (err) {
            console.error(err)
        }
    })
    res.end(`File has been deleted.`)
})

module.exports = router