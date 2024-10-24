import fs from 'fs'
import { utilService } from './util.service.js'

const bugs = utilService.readJsonFile('data/bug.json')

export const bugService = {
    query,
    getById,
    remove,
    save
}

function query(filterBy, sortBy) {
    return Promise.resolve(bugs)
        .then(bugs => {
            if (filterBy.title) {
                const regex = new RegExp(filterBy.title, 'i')
                bugs = bugs.filter(bug => regex.test(bug.title))
            }
            if (filterBy.severity) {
                bugs = bugs.filter(bug => bug.severity >= filterBy.severity)
            }
            if (filterBy.label) {
                bugs = bugs.filter(bug => bug.labels.includes(filterBy.label))
            }
            if (sortBy.selector === 'bugTitle') {
                bugs.sort((bug1, bug2) => bug1.title.toLowerCase().localeCompare(bug2.title.toLowerCase()) * sortBy.dir)
            }
            if (sortBy.selector === 'severity') {
                bugs.sort((bug1, bug2) => (bug1.severity - bug2.severity) * sortBy.dir)
            }
            if (sortBy.selector === 'createdAt') {
                bugs.sort((bug1, bug2) => (bug1.createdAt - bug2.createdAt) * sortBy.dir)
            }
            return bugs
        })
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('Cannot find bug', bugId)
    return Promise.resolve(bug)
}

function remove(bugId) {
    const bugIdx = bugs.findIndex(bug => bug._id === bugId)
    if (bugIdx < 0) return Promise.reject('Cannot find bug', bugId)
    bugs.splice(bugIdx, 1)
    return _saveBugsToFile()
}

function save(bugToSave) {
    if (bugToSave._id) {
        const bugIdx = bugs.findIndex(bug => bug._id === bugToSave._id)
        bugs[bugIdx] = { ...bugs[carIdx], ...bugToSave }
    } else {
        bugToSave._id = utilService.makeId()
        bugs.unshift(bugToSave)
    }

    return _saveBugsToFile().then(() => bugToSave)
}


function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 4)
        fs.writeFile('data/bug.json', data, (err) => {
            if (err) {
                return reject(err)
            }
            resolve()
        })
    })
}