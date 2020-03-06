import './ReduxTest.css'

import React, { Dispatch } from 'react'
import { connect } from 'react-redux'
import { returntypeof } from 'react-redux-typescript'
import { Action } from 'redux'

import { nameActions, nameSelectors } from '../reducers/Name'
import { State as RootState } from '../reducers/Root'

const mapStateToProps = (state: RootState) => ({
   name: nameSelectors.getName(state),
   isAaron: nameSelectors.isNameAaron(state)
})

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
   onNameChange(name: string) {
      dispatch(nameActions.setName(name))
   }
})

const stateProps = returntypeof(mapStateToProps)
const distachProps = returntypeof(mapDispatchToProps)
type Props = typeof stateProps & typeof distachProps

class ReduxTest extends React.Component<Props> {
   private setName = (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.onNameChange(event.target.value)
   }

   public render = () => {
      return (
         <div>
            <h1 className={`${this.props.isAaron ? "isAaron" : "isNotAaron"}`}>
               Hello {this.props.name}
            </h1>
            <input onChange={this.setName} />
         </div>
      )
   }
}

export const ConnectedReduxTest = connect(mapStateToProps, mapDispatchToProps)(ReduxTest)
