import { utilService } from "../services/util.service.js"

const { useState, useEffect, useRef } = React

export function BugSort({ sortBy, onSetSort }) {

    const [sortByToEdit, setSortByToEdit] = useState({ ...sortBy })
    // const onSetFilterDebounce = useRef(utilService.debounce(onSetFilter, 700))

    useEffect(() => {
        // onSetFilterDebounce.current(filterByToEdit)
        onSetSort(sortByToEdit)
    }, [sortByToEdit])

    function handleChange({ target }) {
        let { value } = target

        setSortByToEdit(prevSort => ({ ...prevSort, selector: value }))
    }

    function handleDirChange() {
        setSortByToEdit(prevSort => ({ ...prevSort, dir: (prevSort.dir === 1) ? -1 : 1 }))
    }

    return (
        <section className="bug-sort">
            <h2>Sort</h2>
            <div>
                <select onChange={handleChange}>
                    <option value="bugTitle">Title</option>
                    <option value="severity">Severity</option>
                    <option value="createdAt">Created At</option>
                </select>
                <button onClick={handleDirChange}>Dir</button>
            </div>
        </section>
    )
}