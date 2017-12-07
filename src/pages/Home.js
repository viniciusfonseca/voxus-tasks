import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Flex from '../components/Flex'
import Queue from '../components/Queue'

import { host, headers } from '../components/api'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {
  Paper, Dialog, FlatButton,
  TextField, RaisedButton, Slider,
  IconButton
} from 'material-ui'

export class Home extends Component {
  static fetchData(store, match, req) {
    const email = store.getState().user.email
    return fetch(`${host}/api/user`, { method: 'POST', headers, body: JSON.stringify({ email }) }).then(r => r.text()).then(user => {
      console.log('user',user)
      store.dispatch({ type: 'SET_USER_INFO', ...JSON.parse(user) })
    })
    .then(() => {
      return fetch(`${host}/api/queues`).then(r => r.json())
        .then(queues => {
          store.dispatch({ type: 'QUEUES_POPULATE', queues })
        })
    })
  }

  constructor(props) {
    super(props)

    this.state = {
      openQueueModal: false,
      openTaskModal: false,
      queue: {},
      task: {},
      submittingQueue: false,
      submittingTask: false
    }
  }

  onShowModalQueue(queue = {}) {
    this.setState({
      openQueueModal: true,
      queue
    })
  }

  onShowModalTask(task = { priority: 1, files: [] }, queue) {
    task.id_queue   = task.id_queue   || queue._id
    task.id_creator = task.id_creator || this.props.user._id
    task.status_c   = 0
    this.setState({
      openTaskModal: true,
      task
    })
  }

  submitQueue() {
    const { queue } = this.state
    fetch(`${host}/api/queues`, {
      method: queue._id ? 'PUT' : 'POST',
      headers,
      body: JSON.stringify(Object.assign({}, queue, { id_user: this.props.user._id }))
    })
      .then(r => !queue._id ? r.json() : {})
      .then((res) => {
        this.setState({ openQueueModal: false })
        this.props.dispatch({
          type: queue._id ? 'QUEUE_UPDATE' : 'QUEUE_ADD',
          queue: Object.assign(queue, res)
        })
      })
  }

  submitTask() {
    const { task } = this.state
    fetch(`${host}/api/tasks`, {
      method: task._id ? 'PUT' : 'POST',
      headers,
      body: JSON.stringify(Object.assign({}, task, { id_user: this.props.user._id }))
    })
      .then(r => !task._id ? r.json() : {})
      .then((res) => {
        this.setState({ openTaskModal: false })
        this.props.dispatch({
          type: this.state.task._id ? 'QUEUE_UPDATE_TASK' : 'QUEUE_ADD_TASK',
          task: Object.assign(task, res)
        })
      })
  }

  onDeleteQueue(queue) {
    fetch(`${host}/api/queues/${queue._id}`, { method: 'DELETE' })
      .then(res => {
        if (res.ok)
        this.props.dispatch({
          type: 'QUEUE_REMOVE',
          queue
        })
      })
  }

  onDeleteTask(task) {
    fetch(`${host}/api/queues/${task._id}`, { method: 'DELETE' })
      .then(res => {
        if (res.ok)
        this.props.dispatch({
          type: 'QUEUE_TASK_DELETE',
          task
        })
      })
  }

  renderQueueModal() {
    return (
      <Dialog open={this.state.openQueueModal}
        title={this.state.queue._id ? "Editar fila" : "Criar fila"}
        onRequestClose={() => this.setState({ openQueueModal: false })}
        actions={[
          <FlatButton label="Concluído" onClick={() => this.submitQueue()} />
        ]}>
        <form action="javascript:void(0)" onSubmit={() => this.submitQueue()}>
          <TextField fullWidth floatingLabelText="Nome da fila" defaultValue={this.state.queue.name_t} onChange={(e,v) => this.setState({ queue: Object.assign({}, this.state.queue, { name_t: v }) })} />
        </form>
      </Dialog>
    )
  }

  handleFileUpload(e) {
    const files = Array.from(e.target.files)

    Promise.all(
      files.map(file => new Promise(resolve => {
        const reader = new FileReader()
        reader.onload = function(evt) {
          resolve({
            filename_t: file.name,
            data: evt.target.result,
            timestamp_t: +new Date()
          })
        }
        reader.readAsDataURL(file)
      }))
    )
    .then(files => {
      this.setState({
        task: Object.assign({}, this.state.task, {
          files: (this.state.task.files || []).concat(files)
        })
      })
    })
  }

  handleFileDelete(file, id_task) {
    if (file.link) {
      fetch(`${host}/api/files`, { headers, method: 'DELETE', body: JSON.stringify({ ...file, id_task: this.state.task._id }) })
        .then(() => {
          this.props.dispatch({
            type: 'QUEUE_TASK_UPDATE',
            task: Object.assign({}, this.state.task, {
              files: this.state.task.files.filter(iterfile => iterfile.timestamp_t !== file.timestamp_t)
            })
          })
        })
    }
    else {
      this.setState({
        task: Object.assign({}, this.state.task, {
          files: this.state.task.files.filter(iterfile => iterfile.timestamp_t !== file.timestamp_t)
        })
      })
    }
  }

  download(link) {
    window.open(link)
  }

  renderTaskModal() {
    return (
      <Dialog open={this.state.openTaskModal}
        autoScrollBodyContent
        title={this.state.task._id ? "Editar tarefa" : "Criar tarefa"}
        onRequestClose={() => this.setState({ openTaskModal: false })}
        actions={[
          <FlatButton label="Concluído" onClick={() => this.submitTask()} />
        ]}>
        <form action="javascript:void(0)" onSubmit={() => this.submitTask()}>
          {
            this.state.task.author_id && (
              <Flex.Row style={{ marginTop: '20px' }}>
                Tarefa criada por { this.state.task.author_name }
              </Flex.Row>
            )
          }
          {
            this.state.task.status_c === 2 && (
              <Flex.Row style={{ marginTop: '20px' }}>
                Tarefa completada por { this.state.task.completer_name }
              </Flex.Row>
            )
          }
          <TextField fullWidth floatingLabelText="Nome da tarefa"
            defaultValue={this.state.task.description_t}
            onChange={(e,description_t) => this.setState({ task: Object.assign({}, this.state.task, { description_t }) })} />

          <TextField fullWidth multiLine floatingLabelText="Detalhes" floatingLabelFixed rows={4}
            defaultValue={this.state.task.details}
            onChange={(e,details) => this.setState({ task: Object.assign({}, this.state.task, { details }) })} />

          <p> Prioridade: { this.state.task.priority }</p>
          <Slider style={{ margin: '0px 10px' }} step={1} min={1} max={5}
            defaultValue={ this.state.task.priority }
            onChange={(e,priority) => this.setState({ task: Object.assign({}, this.state.task, { priority }) })}/>

          <p> Anexos </p>
          <div className="upload-btn-wrapper">
            <RaisedButton label="Enviar arquivo" />
            <input type="file"
              onChange={this.handleFileUpload.bind(this)} />
          </div>
          {
            (this.state.task.files || []).map((file, i) => (
              <div key={'file-'+i} style={{ padding: '7px', margin: '5px' }}>
                { file.filename_t }
                { file.link && <FlatButton style={{ marginLeft: '14px' }} label="DOWNLOAD" onClick={() => this.download(file.link)} /> }
                <FlatButton style={{ marginLeft: '14px' }} label="EXCLUIR" onClick={() => this.handleFileDelete(file)} />
              </div>
            ))
          }
        </form>
      </Dialog>
    )
  }

  onDoneTask(task) {
    fetch(`${host}/api/tasks/${task._id}/done`, {
      headers,
      method: 'POST',
      body: JSON.stringify({
        id_completer: this.props.user._id
      })
    })
    .then(() => {
      this.props.dispatch({
        type: 'QUEUE_UPDATE_TASK',
        task: Object.assign({}, task, { status_c: 2 }),
      })
    })
  }

  onUndoneTask(task) {
    fetch(`${host}/api/tasks/${task._id}/undone`, {
      headers,
      method: 'POST',
      body: JSON.stringify({
        id_completer: this.props.user._id
      })
    })
    .then(() => {
      this.props.dispatch({
        type: 'QUEUE_UPDATE_TASK',
        task: Object.assign({}, task, { status_c: 0 }),
      })
    })
  }

  render() {
    return (
      <MuiThemeProvider>
        <div className="main flex-col stretch">
          <Flex.Row className="upper-nav">
            <div className="res-img logo2" />
            <Flex.Column flex centerA style={{ fontSize: '20px', alignSelf: 'center', marginLeft: '7px', paddingLeft: '8px', color: '#fff', borderLeft: '2px solid #fff', fontWeight: 'bold' }}>Tasks</Flex.Column>
            <Flex.Column centerA>
              <FlatButton style={{ color: '#FFF' }} label="+ Nova Fila" onClick={() => this.setState({ openQueueModal: true, queue: {} })} />
            </Flex.Column>
            <Flex.Column style={{ marginLeft: '10px' }} centerA>
              <FlatButton style={{ color: '#FFF' }} label="Sair" onClick={() => window.location.assign('/login')} />
            </Flex.Column>
          </Flex.Row>
          {
            this.renderQueueModal()
          }
          {
            this.renderTaskModal()
          }
          <div style={{ flex: 1, overflowY: 'auto' }}>
          {
            this.props.queues.map(queue => (
              <div key={'q-'+queue._id} style={{ display: 'inline-block', width: '50%', padding: '20px', float: 'left' }}>
                <Paper style={{ width: '100%', height: '360px' }}>
                  <Queue queue={queue} dispatch={this.props.dispatch}
                    onRequestEdit={() => this.setState({})}
                    onShowModalQueue={this.onShowModalQueue.bind(this)}
                    onDeleteQueue={this.onDeleteQueue.bind(this)}
                    onDeleteTask={this.onDeleteTask.bind(this)}
                    onShowModalTask={this.onShowModalTask.bind(this)}
                    onDoneTask={this.onDoneTask.bind(this)}
                    onUndoneTask={this.onUndoneTask.bind(this)} />
                </Paper>
              </div>
            ))
          }
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withRouter(connect(({ queues, user }) => ({ queues, user }))(Home));
