export default (state = [], action) => {
    switch (action.type) {
        case 'QUEUES_POPULATE':
            return action.queues
        case 'QUEUE_ADD':
            const copyQueues = state.slice()
            const mainQueue = copyQueues.shift()
            return [mainQueue].concat(action.queue).concat(copyQueues)
        case 'QUEUE_UPDATE':
            return state.map(queue => queue._id !== action.queue._id ? queue : action.queue)
        case 'QUEUE_REMOVE':
            return state.filter(queue => queue._id !== action.queue._id)

        case 'QUEUE_POPULATE_TASK':
            return state.map(queue => queue._id !== action.id_queue ? queue : (
                Object.assign({}, queue, { tasks: action.tasks })
            ))
        case 'QUEUE_ADD_TASK':
            return state.map(queue => queue._id !== action.task.id_queue ? queue : (
                Object.assign({}, queue, { tasks: queue.tasks.concat(action.task) })
            ))
        case 'QUEUE_UPDATE_TASK':
            return state.map(queue => queue._id !== action.task.id_queue ? queue : (
                Object.assign({}, queue, { tasks: queue.tasks.map(task => task._id !== action.task._id ? task : action.task) })
            ))
        case 'QUEUE_DELETE_TASK':
            return state.map(queue => queue._id !== action.task.id_queue ? queue : (
                Object.assign({}, queue, { tasks: queue.tasks.filter(task => task._id !== action.task._id) })
            ))
        default:
            return state
    }
}