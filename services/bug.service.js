import fs from 'fs'
import { utilService } from './util.service.js'

const bugs = utilService.readJsonFile('data/bug.json')
const PAGE_SIZE = 3

export const bugService = {
    query,
    getById,
    remove,
    save
}

function query(filterBy = {}, sortBy = {}) {
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
                bugs = bugs.filter(bug => bug.labels.includes(filterBy.label.toLowerCase()))
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
            if (filterBy.pageIdx !== undefined) {

                const startIdx = +filterBy.pageIdx * PAGE_SIZE // 0,3,6
                bugs = bugs.slice(startIdx, startIdx + PAGE_SIZE)
            }
            return bugs
        })
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('Cannot find bug', bugId)
    return Promise.resolve(bug)
}

function remove(bugId, loggedInUser) {
    const bugIdx = bugs.findIndex(bug => bug._id === bugId)
    if (bugIdx === -1) return Promise.reject('Cannot find bug', bugId)

    const bug = bugs[bugIdx]
    if (!loggedInUser.isAdmin &&
        bug.creator._id !== loggedInUser._id) {
        return Promise.reject('Not your bug')
    }

    bugs.splice(bugIdx, 1)
    return _saveBugsToFile()
}

function save(bugToSave, loggedInUser) {
    if (bugToSave._id) {
        const bugIdx = bugs.findIndex(bug => bug._id === bugToSave._id)
        if (!loggedInUser.isAdmin &&
            bugToSave.creator._id !== loggedInUser._id) {
            return Promise.reject('Not your bug')
        }
        bugs[bugIdx] = { ...bugs[bugIdx], ...bugToSave }
    } else {
        bugToSave._id = utilService.makeId()
        bugToSave.creator = loggedInUser
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