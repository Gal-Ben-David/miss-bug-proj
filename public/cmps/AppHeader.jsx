
import { UserMsg } from './UserMsg.jsx'
import { LoginSignup } from '../cmps/LoginSignup.jsx'
import { userService } from '../services/user.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'

const { Link, NavLink } = ReactRouterDOM
const { useEffect, useState } = React
const { useNavigate } = ReactRouter

export function AppHeader() {
    const navigate = useNavigate()
    const [user, setUser] = useState(userService.getLoggedinUser())

    function onLogout() {
        userService.logout()
            .then(() => {
                onSetUser(null)
                navigate("/bug")
            })
            .catch(err => showErrorMsg('OOPs try again'))
    }

    function onSetUser(user) {
        setUser(user)
    }

    useEffect(() => {
        // component did mount when dependancy array is empty
    }, [])

    return (
        <header className='container'>
            <UserMsg />
            <nav>
                <NavLink to="/">Home</NavLink> |<NavLink to="/bug">Bugs</NavLink> |
                <NavLink to="/about">About</NavLink>
                {user && user.isAdmin && <NavLink to="/users">User List</NavLink>}
            </nav>

            {user ? (
                <section>
                    <Link to={`/user/${user._id}`}>Hello {user.fullname}</Link>
                    <button onClick={onLogout}>Logout</button>
                </section>
            ) : (
                <section>
                    <LoginSignup onSetUser={onSetUser} />
                </section>
            )}
        </header>
    )
}
