import { utilService } from "../services/util.service.js"

const { useState, useEffect, useRef } = React

export function BugFilter({ filterBy, onSetFilter }) {

    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })
    const onSetFilterDebounce = useRef(utilService.debounce(onSetFilter, 700))

    useEffect(() => {
        onSetFilterDebounce.current(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value
                break;

            case 'checkbox':
                value = target.checked
                break

            default:
                break;
        }

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilter(filterByToEdit)
    }

    const { title, severity } = filterByToEdit

    return (
        <section className="car-filter">
            <h2>Filter Our Bugs</h2>
            <form onSubmit={onSubmitFilter}>
                <label htmlFor="txt">Title</label>
                <input value={title} onChange={handleChange} name="title" type="text" id="txt" />

                <label htmlFor="severity">Severity</label>
                <input value={severity || ''} onChange={handleChange} name="severity" type="number" id="severity" />

                <button>Submit</button>
            </form>
        </section>
    )
}