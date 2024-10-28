
import { userService } from '../services/user.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { bugService } from '../services/bug.service.js'

const { useState, useEffect } = React

export function UserIndex() {
    const [users, setUsers] = useState(null)

    useEffect(() => {
        loadUsers()
    }, [])

    function loadUsers() {
        userService.query()
            .then(setUsers)
            .catch(err => {
                console.log('err:', err)
            })
    }

    function onRemoveUser(userId) {
        bugService.query()
            .then(bugs => {
                const hasBugs = bugs.some(bug => bug.creator._id === userId)
                if (hasBugs) {
                    console.log('This user has bugs and cannot be removed')
                    showErrorMsg('This user has bugs and cannot be removed')
                    return
                }
                return userService
                    .remove(userId)
                    .then(() => {
                        console.log('Deleted Successfully!')
                        const usersToUpdate = users.filter((user) => user._id !== userId)
                        setUsers(usersToUpdate)
                        showSuccessMsg('User removed')
                    })
            })
            .catch((err) => {
                console.log('Error from onRemoveUser ->', err)
                showErrorMsg('Cannot remove user')
            })
    }

    if (!users) return <div>Loading...</div>

    return (

        <div>
            {users.map(user =>
                <pre key={user._id}>
                    <span>{user.fullname}</span>
                    <span>{user.username}</span>
                    <span>{user._id}</span>
                    <button onClick={() => onRemoveUser(user._id)}><i className="fa-solid fa-trash"></i></button>
                </pre>
            )}
        </div>

    )
}