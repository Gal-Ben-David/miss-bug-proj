const { useState, useEffect } = React
const { Link, useParams } = ReactRouterDOM

import { userService } from '../services/user.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'
import { bugService } from '../services/bug.service.js'
import { BugList } from '../cmps/BugList.jsx'

export function UserDetails() {

    const [user, setUser] = useState(null)
    const [bugs, setBugs] = useState(null)
    const { userId } = useParams()

    useEffect(() => {
        userService.getById(userId)
            .then(user => {
                setUser(user)
                bugService.query()
                    .then(bugs => setBugs(bugs.filter(bug => bug.creator._id === userId)))
            })
            .catch(err => {
                showErrorMsg('Cannot load user')
            })
    }, [])

    if (!user) return <h1>loadings....</h1>
    return (
        user && <div>
            <h3>User Details 👤</h3>
            <h4>{user.fullname}</h4>
            <h5>id: {user._id}</h5>
            <h5>{bugs ? 'User Bugs' : 'No Bugs'}</h5>
            <pre>
                {bugs && bugs.length !== 0 &&
                    <BugList bugs={bugs} />
                }
            </pre>
            <Link to="/bug">Back</Link>
        </div>)

}