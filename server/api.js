import UsersModel from './models/Users'
import TasksModel from './models/Tasks'
import QueuesModel from './models/Queues'
import FilesModel from './models/Files'

const AWS = require('aws-sdk')

AWS.config.update({
    accessKeyId: '',
    secretAccessKey: ''
})
const s3 = new AWS.S3()

function uploadAWSFile(file) {
    console.log(`upload '${file.filename_t}' to AWS...`)
    return new Promise((resolve) => {
        s3.upload({
            Bucket: 'voxus-tasks',
            Key: file.filename_t,
            Body: file.data,
            ACL: 'public-read'
        }, function(resp, resp0) {
            console.log(arguments)
            file.link = resp0.Location
            resolve(file)
        })    
    })
}

export default function(app) {

    app.post('/api/user', (req, res) => {
        UsersModel.fetch(req.body.email)
            .then(userArr => {
                const user = userArr.shift()
                if (!user) {
                    UsersModel.create(req.body || {})
                        .then(() => {
                            UsersModel.fetch(req.params.email)
                                .then(userArr => res.send(userArr[0]))
                        })
                    return
                }
                else {
                    res.send(user)
                }
            })
    })

    /* QUEUES */

    app.get('/api/queues', (req, res) => {
        QueuesModel.fetch()
            .then(results => res.send(results))
    })

    app.get('/api/queues/:id', (req, res) => {
        QueuesModel.fetch(req.params.id)
            .then(results => res.send(results))
    })

    app.post('/api/queues', (req, res) => {
        console.log('POST /api/queues', req.body)
        QueuesModel.insert(req.body)
            .then(_id => res.status(200).send({ _id }))
            .catch(e => res.status(500).send())
    })

    app.put('/api/queues', (req, res) => {
        QueuesModel.update(req.body)
            .then(status => res.status(status).send())
    })

    app.delete('/api/queues/:id', (req, res) => {
        QueuesModel.delete(req.params.id)
            .then(status => res.status(status).send())
    })

    /* TASKS */

    app.get('/api/tasks', (req, res) => {
        TasksModel.fetch(null, req.query.f)
            .then(results => res.send(results))
    })

    app.get('/api/tasks/:id', (req, res) => {
        TasksModel.fetch(req.params.id)
            .then(task => res.send(task))
    })

    app.post('/api/tasks/:id/done', (req, res) => {
        TasksModel.done(req.params.id, req.body.id_completer)
            .then(status => res.status(status).send())
    })

    app.post('/api/tasks/:id/undone', (req, res) => {
        TasksModel.undone(req.params.id)
            .then(status => res.status(status).send())
    })

    app.get('/api/tasks/:id/transfer/:id_queue', (req, res) => {
        TasksModel.transfer(req.params.id, req.params.id_queue)
            .then(status => res.status(status).send())
    })

    app.post('/api/tasks', (req, res) => {
        Promise.all(
            (req.body.files || [])
                .filter(file => !!file && !!file.data)
                .map(file => uploadAWSFile(file))
        ).then(() => {
            FilesModel.insert(req.body._id, )
            TasksModel.insert(req.body)
                .then(_id => res.status(200).send({ _id }))
                .catch(e => res.status(500).send())
        })
    })

    app.put('/api/tasks', (req, res) => {
        Promise.all(
            (req.body.files || [])
                .filter(file => !!file && !!file.data)
                .map(file => uploadAWSFile(file, file.filename_t, file.data))
        )
        .then(results => {
            return Promise.all(
                results.map((file) => FilesModel.insert(req.body._id, file.filename_t, file.timestamp_t, file.link))
            )
        })
        .then(() => {
            TasksModel.update(req.body)
                .then(status => res.status(status).send())
        })
    })

    app.delete('/api/tasks/:id', (req, res) => {
        TasksModel.delete(req.params.id)
            .then(status => res.status(status).send())
    })

    app.delete('/api/files', (req, res) => {
        FilesModel.delete(req.body.id_task, req.body.timestamp_t)
            .then(status => res.status(status).send())
    })
}