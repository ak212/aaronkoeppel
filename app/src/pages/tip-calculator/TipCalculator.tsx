import Button from '@mui/material/Button'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import uniqueId from 'lodash/uniqueId'
import React from 'react'

interface State {
  activeStep: number
  people: string[]
  numberOfPeople: number
}

class TipCalculator extends React.Component<{}, State> {
  public constructor() {
    super({})
    this.state = {
      activeStep: 0,
      people: [],
      numberOfPeople: 1
    }
  }

  private getStepContent = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return (
          <div
            style={{
              display: 'flex',
              flex: '1 1 auto',
              flexDirection: 'column',
              paddingBottom: '10%'
            }}
          >
            {this.getTextField()}
            <Button
              variant="contained"
              color="primary" /* className={classes.button} */
              onClick={this.addPerson}
              style={{
                width: 150,
                justifyContent: 'center',
                textAlign: 'center'
              }}
            >
              Add Party
            </Button>
          </div>
        )
      case 1:
        return 'What is an ad group anyways?'
      case 2:
        return 'This is the bit I really care about!'
      default:
        return 'Uknown stepIndex'
    }
  }

  private addPerson = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    this.setState(prevState => {
      return {
        numberOfPeople: prevState.numberOfPeople + 1
      }
    })
  }

  private getTextField = () => {
    return (
      <TextField
        id="filled-name"
        label="Name"
        // className={classes.textField}
        margin="normal"
        variant="filled"
      />
    )
  }

  private handleNext = () => {
    this.setState(prevState => {
      return {
        activeStep: prevState.activeStep + 1
      }
    })
  }

  private handleBack = () => {
    this.setState(prevState => {
      return {
        activeStep: prevState.activeStep - 1
      }
    })
  }

  private handleReset = () => {
    this.setState(prevState => {
      return {
        activeStep: 0
      }
    })
  }

  private getSteps = () => {
    return ['Add People', 'Add Menu Items', 'Divide It Up']
  }

  public render = () => {
    const steps = this.getSteps()

    return (
      <div /* className={style.root} */>
        <Stepper activeStep={this.state.activeStep} alternativeLabel>
          {steps.map(label => (
            <Step key={uniqueId()}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <div>
          {this.state.activeStep === steps.length ? (
            <div>
              <Typography /* className={styles.instructions} */>All steps completed</Typography>
              <Button onClick={this.handleReset}>Reset</Button>
            </div>
          ) : (
            <div>
              <Typography /* className={styles.instructions} */>
                {this.getStepContent(this.state.activeStep)}
              </Typography>
              <div>
                <Button
                  disabled={this.state.activeStep === 0}
                  onClick={this.handleBack}
                  /* className={useStyles().backButton} */
                >
                  Back
                </Button>
                <Button variant="contained" color="primary" onClick={this.handleNext}>
                  {this.state.activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default TipCalculator
