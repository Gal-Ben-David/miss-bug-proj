import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { BugFilter } from '../cmps/BugFilter.jsx'
import { BugSort } from '../cmps/BugSort.jsx'

const { useState, useEffect, useRef } = React
const { Link, useSearchParams } = ReactRouterDOM

export function BugIndex() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [bugs, setBugs] = useState(null)
    const [filterBy, setFilterBy] = useState(bugService.getFilterFromParams(searchParams))
    const [sortBy, setSortBy] = useState(bugService.getSortFromParams(searchParams))

    useEffect(() => {
        setSearchParams({ ...filterBy, ...sortBy })
        loadBugs()
    }, [filterBy, sortBy])

    function loadBugs() {
        bugService.query(filterBy, sortBy)
            .then(setBugs)
            .catch(err => {
                console.log('err:', err)
            })
    }

    function onSetFilter(filterBy) {
        console.log(filterBy)
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
    }

    function onSetSort(sortBy) {
        console.log(sortBy)
        setSortBy(prevSort => ({ ...prevSort, ...sortBy }))
    }

    function onChangePage(diff) {
        if (filterBy.pageIdx === undefined) return

        setFilterBy(prevFilter => {

            let nextPageIdx = +prevFilter.pageIdx + diff
            if (nextPageIdx < 0) nextPageIdx = 0

            return { ...prevFilter, pageIdx: nextPageIdx }
        })
    }

    function onRemoveBug(bugId) {
        bugService
            .remove(bugId)
            .then(() => {
                console.log('Deleted Successfully!')
                const bugsToUpdate = bugs.filter((bug) => bug._id !== bugId)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch((err) => {
                console.log('Error from onRemoveBug ->', err)
                showErrorMsg('Cannot remove bug')
            })
    }

    function onAddBug() {
        const bug = {
            title: prompt('Bug title?'),
            description: prompt('Bug description?'),
            severity: +prompt('Bug severity?'),
        }
        bugService
            .save(bug)
            .then((savedBug) => {
                console.log('Added Bug', savedBug)
                setBugs([...bugs, savedBug])
                showSuccessMsg('Bug added')
            })
            .catch((err) => {
                console.log('Error from onAddBug ->', err)
                showErrorMsg('Cannot add bug')
            })
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?')
        const bugToSave = { ...bug, severity }
        bugService
            .save(bugToSave)
            .then((savedBug) => {
                console.log('Updated Bug:', savedBug)
                const bugsToUpdate = bugs.map((currBug) =>
                    currBug._id === savedBug._id ? savedBug : currBug
                )
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug updated')
            })
            .catch((err) => {
                console.log('Error from onEditBug ->', err)
                showErrorMsg('Cannot update bug')
            })
    }

    return (
        <main>
            <section className='info-actions'>
                <h3>Bugs App</h3>
                <button onClick={onAddBug}>Add Bug ⛐</button>
            </section>
            <main>
                <BugFilter filterBy={filterBy} onSetFilter={onSetFilter} />
                <BugSort sortBy={sortBy} onSetSort={onSetSort} />
                <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
                <section>
                    <button onClick={() => onChangePage(-1)}>-</button>
                    {filterBy.pageIdx + 1}
                    <button onClick={() => onChangePage(1)}>+</button>
                </section>

                <button type='button' onClick={() => bugService.getPDF()}>Download PDF</button>
            </main>
        </main>
    )
}
