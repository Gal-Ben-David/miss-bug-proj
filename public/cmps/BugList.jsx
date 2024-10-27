const { Link } = ReactRouterDOM

import { BugPreview } from './BugPreview.jsx'
import { BugDetails } from '../pages/BugDetails.jsx'

export function BugList({ bugs, onRemoveBug, onEditBug }) {

    if (!bugs) return <div>Loading...</div>
    return (
        <ul className="bug-list">
            {bugs.map((bug) => (
                <li className="bug-preview" key={bug._id}>
                    <BugPreview bug={bug} />
                    <Link to={`/bug/${bug._id}`}>Details</Link>
                    <div>
                        <button onClick={() => onRemoveBug(bug._id)}><i className="fa-solid fa-trash"></i></button>
                        <button onClick={() => onEditBug(bug)}><i className="fa-regular fa-pen-to-square"></i></button>
                    </div>
                </li>
            ))
            }
        </ul >
    )
}
