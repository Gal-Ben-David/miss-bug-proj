import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'
import { pdfService } from './services/pdf.service.js'

const app = express()
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())
// const bugs = JSON.parse(fs.readFileSync('data/bug.json', 'utf8'))

// app.get('/', (req, res) => res.send('Hello there'))


// app.get('/api/bug', (req, res) => {
//     res.send(bugs)
// })

// app.get('/api/bug/:bugId', (req, res) => {
//     const { bugId } = req.params
//     const bug = bugs.find(bug => bug._id === bugId)
//     if (bug) res.send(bug)
//     else res.status(404).send('Bug not found')
// })

//* READ LIST
app.get('/api/bug', (req, res) => {

    console.log('req.query:', req.query)

    const { title = '', description = '', severity = '0', selector = '', dir = '1', pageIdx = '0' } = req.query

    const filterBy = {
        title,
        description,
        severity: +severity,
        pageIdx: +pageIdx
    }

    const sortBy = {
        selector,
        dir: +dir
    }

    bugService.query(filterBy, sortBy)
        .then(bugs => res.send(bugs))
        .catch(err => {
            loggerService.error('Cannot get bugs', err)
            res.status(400).send('Cannot get bugs')
        })
})

//* ADD
app.post('/api/bug', (req, res) => {
    const bugToSave = {
        title: req.body.title,
        description: req.body.description,
        severity: +req.body.severity,
        labels: req.body.labels,
        createdAt: Date.now()
    }

    console.log('Saving bug:', bugToSave)

    bugService.save(bugToSave)
        .then(savedBug => res.send(savedBug))
        .catch(err => {
            loggerService.error('Cannot save bug', err)
            res.status(500).send('Cannot save bug')
        })
})

// UPDATE 
app.put('/api/bug', (req, res) => {
    const bugToSave = {
        severity: +req.body.severity,
        _id: req.body._id
    }
    bugService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})

//*DOWNLOAD PDF
app.get('/api/bug/downloadPDF', (req, res) => {
    bugService.query()
        .then(bugs => {
            pdfService.buildBugsPDF(bugs)
            console.log('success: PDF created.')
        })
        .catch(err => {
            loggerService.error('Cannot get bugs', err)
            res.status(500).send('Cannot get bugs')
        })
})

//* READ
app.get('/api/bug/:bugId', (req, res) => {
    console.log('Read req.params:', req.params)
    const { bugId } = req.params
    let visitedBugs = req.cookies.visitedBugs || []

    if (!visitedBugs.includes(decodeURIComponent(bugId))) {
        visitedBugs.push(decodeURIComponent(bugId))
    }
    if (visitedBugs.length > 3) {
        console.log('You have reached the maximum number of viewings')
        return res.status(401).send('Wait for a bit')
    }
    res.cookie('visitedBugs', visitedBugs, { maxAge: 7000 })
    console.log('User visited at the following bugs:', visitedBugs)

    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('Cannot get bug', err)
            res.status(400).send('Cannot get bug')
        })
})

//* REMOVE
app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    bugService.remove(bugId)
        .then(() => res.send(`Bug ${bugId} removed successfully!`))
        .catch(err => {
            loggerService.error('Cannot remove bug', err)
            res.status(500).send('Cannot remove bug')
        })
})

app.listen(3030, () => console.log(`Server listening on port http://127.0.0.1:3030/`))