import React, { Dispatch } from 'react'

import {State as RootState} from '../reducers/Root'
import { nameSelectors, nameActions } from '../reducers/Name';
import { Action } from 'redux';
import { connect } from 'react-redux'

class ReduxTest extends React.Component {
    private setName = () => {

    }

  public render = () => {
    return (
        <div>
            <h1>Hello</h1>
            <input onChange={this.setName} />

        </div>
    )
  }
}

const mapStateToProps = (state: RootState) => {
    return {
        name: nameSelectors.getName(state)
    }
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
    onNameChange(name: string) {
        dispatch(nameActions.setName(name))
    }
})

export const ConnectedReduxTest = connect(mapStateToProps, mapDispatchToProps)(ReduxTest)
