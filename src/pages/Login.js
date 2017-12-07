import React from 'react'
import GoogleLogin from 'react-google-login'

import canUseDom from 'can-use-dom'

import { VOXUS_TASKS_CLIENT_ID, host, headers } from '../components/api'

import Flex from '../components/Flex'

const noop = function(){}

export default class Login extends React.Component {

    componentDidMount() {
        if (canUseDom) {
            document.cookie = "jwt="
            localStorage.removeItem('e')
        }
    }

    onLoginSuccess(res) {
        console.log(res)
        document.cookie = "jwt=" + res.accessToken
        const { profileObj } = res
        const body = {
            name_t: profileObj.name,
            pic: profileObj.imageUrl,
            email: profileObj.email
        }
        localStorage.setItem('e', body.email)
        fetch(`${host}/api/user`, { method: 'POST', headers, body: JSON.stringify(body) })
            .then(() => {
                window.location.assign('/')
            })
    }

    onLoginError(res) {
        console.log(res)
    }

    render() {
        return (
            <div className="main flex-col center-a center-b">
                <Flex.Row style={{ marginBottom: '120px' }}>
                    <img src={require("../assets/logo.png")} style={{ transform: 'scale(1.5)' }}/>
                    <span style={{ fontSize: '48px', marginLeft: '56px', paddingLeft: '14px', borderLeft: '1px solid #444' }}>
                        Tasks
                    </span>
                </Flex.Row>
                {
                    canUseDom && (
                        <GoogleLogin clientId={VOXUS_TASKS_CLIENT_ID}
                            buttonText="Entrar"
                            onRequest={noop}
                            onSuccess={this.onLoginSuccess.bind(this)}
                            onFailure={this.onLoginError.bind(this)} />
                    )
                }
            </div>
        )
    }
}