import React from 'react'
import PropTypes from 'prop-types'

import './Flex.css'

const noop = function(){}

const Flex = {
    Row: props => (
        <div className={"flex-row"
            + (props.flex ? ' flex' : '')
            + (props.centerA ? ' center-a' : '')
            + (props.centerB ? ' center-b' : '')
            + (props.endA ? ' end-a' : '')
            + (props.stretch ? ' stretch' : '')
            + (props.className ? ' ' + props.className : '')
        } onClick={props.onClick || noop} style={props.style || {}}>
            { props.children }
        </div>
    ),
    Column: props => (
        <div className={"flex-col"
            + (props.flex ? ' flex' : '')
            + (props.centerA ? ' center-a' : '')
            + (props.centerB ? ' center-b' : '')
            + (props.endA ? ' end-a' : '')
            + (props.stretch ? ' stretch' : '')
            + (props.className ? ' ' + props.className : '')
        } onClick={props.onClick || noop} style={props.style || {}}>
            { props.children }
        </div>
    )
}

const types = {
    flex: PropTypes.bool,
    centerA: PropTypes.bool,
    centerB: PropTypes.bool
}

Flex.Row.propTypes    = Object.assign({}, types)
Flex.Column.propTypes = Object.assign({}, types)

export default Flex