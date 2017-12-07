import React from 'react'
import Flex from './Flex'
import { host } from './api'

import canUseDom from 'can-use-dom'

import {
    AppBar, CircularProgress, FlatButton,
    IconButton, IconMenu, MenuItem,
    List, ListItem
} from 'material-ui'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

const sortByPriority = (a,b) => {
    if (!a || !b) return 0
    if ((a.priority || 1) < (b.priority || 1)) return 1
    if ((a.priority || 1) > (b.priority || 1)) return -1
    return 0
}

export default class Queue extends React.Component {

    constructor(props, context) {
        super(props, context)

        this.state = {
            loading: true,
            showCompleted: false
        }
    }

    fetchTasks() {
        return fetch(`${host}/api/tasks?f=${this.props.queue._id}`).then(r => r.json())
    }

    componentWillMount() {
        if (canUseDom) {
            this.fetchTasks()
                .then(tasks => {
                    this.setState({
                        loading: false 
                    })
                    this.props.dispatch({
                        type: 'QUEUE_POPULATE_TASK',
                        tasks,
                        id_queue: this.props.queue._id
                    })
                })
        }
    }
    
    render() {
        const Menu = (
            <IconMenu
                iconButtonElement={
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                }
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'top'}}>

                <MenuItem primaryText="Nova tarefa" onClick={() => this.props.onShowModalTask({ priority: 1, files: [] }, this.props.queue)} />
                <MenuItem primaryText={this.state.showCompleted? "Ocultar completas" : "Mostrar completadas"}
                    onClick={() => this.setState({ showCompleted: !this.state.showCompleted })} />
                {
                    this.props.queue._id !== 1 && (
                        <MenuItem primaryText="Editar fila" onClick={() => this.props.onShowModalQueue(this.props.queue)} />
                    )
                }
                {
                    this.props.queue._id !== 1 && (
                        <MenuItem primaryText="Excluir fila" onClick={() => this.props.onDeleteQueue(this.props.queue)} />
                    )
                }
            </IconMenu>
        )

        return (
            <div className="main">
                <AppBar title={this.props.queue.name_t}
                    showMenuIconButton={false}
                    iconElementRight={Menu} />
                {
                    this.state.loading ? <Flex.Row style={{padding:'18px'}} centerA> <CircularProgress /> </Flex.Row> : (
                        (this.props.queue.tasks || []).length === 0 ? (
                            <Flex.Row style={{margin:'18px'}} centerA><em>Não há tarefas nesta fila.</em></Flex.Row>
                        ): (
                            <List>
                            {
                                (this.props.queue.tasks || [])
                                .filter(task => this.state.showCompleted || (task.status_c === 0))
                                .sort(sortByPriority)
                                .map(task => (
                                    <ListItem key={'t-'+task._id}
                                        primaryText={task.description_t}
                                        onClick={() => this.props.onShowModalTask(task, this.props.queue)}
                                        leftAvatar={
                                            <div className="flex-row center-a center-b"
                                                style={{ backgroundColor: 'aliceblue', width: '40px', height: '40px', borderRadius: '50%', fontSize: '18px' }}>
                                                { task.priority }
                                            </div>
                                        }
                                        rightIconButton={(
                                            <IconMenu iconButtonElement={
                                                <IconButton>
                                                    <MoreVertIcon />
                                                </IconButton>
                                            }
                                            targetOrigin={{horizontal: 'right', vertical: 'top'}}
                                            anchorOrigin={{horizontal: 'right', vertical: 'top'}}>
                                                {
                                                    task.status_c !== 2 ? (
                                                        <MenuItem onClick={() => this.props.onDoneTask(task)}>
                                                            Completar
                                                        </MenuItem>
                                                    ): (
                                                        <MenuItem onClick={() => this.props.onUndoneTask(task)}>
                                                            Transferir para a fila
                                                        </MenuItem>
                                                    )
                                                }
                                                <MenuItem onClick={() => this.props.onDeleteTask(task)}>Excluir</MenuItem>
                                            </IconMenu>
                                        )}/>
                                ))
                            }
                            </List>
                        )
                    )
                }
            </div>
        )
    }
}