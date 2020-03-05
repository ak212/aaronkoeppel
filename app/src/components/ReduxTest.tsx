import React, { Dispatch } from 'react'
import { connect } from 'react-redux'
import { Action } from 'redux'

import { nameActions, nameSelectors } from '../reducers/Name'
import { State as RootState } from '../reducers/Root'

interface Props {
   name: string
   onNameChange(name: string): void
}

class ReduxTest extends React.Component<Props> {
   constructor(props: Props) {
      super(props)
   }

   private setName = (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.onNameChange(event.target.value)
   }

   public render = () => {
      return (
         <div>
            <h1>Hello {this.props.name}</h1>
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
