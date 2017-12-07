export default (state = {}, action) => {
    switch (action.type) {
        case 'RESET':
            return {}
        case 'SET_USER_INFO':
            const actionCopy = Object.assign({}, action)
            delete actionCopy.type
            return Object.assign({}, state, actionCopy)
        default:
            return state
    }
}