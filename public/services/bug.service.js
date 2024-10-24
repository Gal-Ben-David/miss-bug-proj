
import { utilService } from './util.service.js'

const STORAGE_KEY = 'bugDB'
const BASE_URL = '/api/bug/'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
    getEmptyBug,
    getFilterFromParams,
    getSortFromParams,
    getDefaultSort,
    getPDF
}


function query(filterBy = getDefaultFilter(), sortBy = getDefaultSort()) {
    return axios.get(BASE_URL, { params: { ...filterBy, ...sortBy } })
        .then(res => res.data)
    //         .then(bugs => {
    //             if (filterBy.title) {
    //                 const regExp = new RegExp(filterBy.title, 'i')
    //                 bugs = bugs.filter(bug => regExp.test(bug.title))
    //             }
    //             if (filterBy.severity) {
    //                 bugs = bugs.filter(bug => bug.severity >= filterBy.severity)
    //             }
    //             return bugs
    //         })
}
function getById(bugId) {
    return axios.get(BASE_URL + bugId)
        .then(res => res.data)
        .then(bug => _setNextPrevBugId(bug))
}

function remove(bugId) {
    return axios.get(BASE_URL + bugId + '/remove')
        .then(res => res.data)
}

function save(bug) {
    // const url = BASE_URL + 'save'
    // let queryParams = `?title=${bug.title}&description=${bug.description}&severity=${bug.severity}`
    // if (bug._id) queryParams += `&_id=${bug._id}`
    // return axios.get(url + queryParams).then(res => res.data)

    if (bug._id) {
        return axios.put(BASE_URL, bug).then(res => res.data)
    } else {
        return axios.post(BASE_URL, bug).then(res => res.data)
    }
}

function getEmptyBug(title = '', severity = 0, label = '') {
    return { title, severity, label }
}

function getDefaultFilter() {
    return { title: '', severity: 0, label: '' }
}

function getDefaultSort() {
    return { selector: '', dir: 1 }
}

function getFilterFromParams(searchParams = {}) {
    const defaultFilter = getDefaultFilter()
    return {
        title: searchParams.get('title') || defaultFilter.title,
        severity: searchParams.get('severity') || defaultFilter.severity,
        label: searchParams.get('label') || defaultFilter.label,
    }
}

function getSortFromParams(searchParams = {}) {
    const defaultSort = getDefaultSort()
    return {
        selector: searchParams.get('selector') || defaultSort.selector,
        dir: +searchParams.get('dir') || defaultSort.dir
    }
}

function getPDF() {
    return axios.get(BASE_URL + 'downloadPDF')
        .then(res => res.data)
        .then(() => {
            console.log('PDF!')
        })
}

function _setNextPrevBugId(bug) {
    return query().then((bugs) => {
        const bugIdx = bugs.findIndex((currBug) => currBug._id === bug._id)
        const nextBug = bugs[bugIdx + 1] ? bugs[bugIdx + 1] : bugs[0]
        const prevBug = bugs[bugIdx - 1] ? bugs[bugIdx - 1] : bugs[bugs.length - 1]
        bug.nextBugId = nextBug._id
        bug.prevBugId = prevBug._id
        return bug
    })
}
