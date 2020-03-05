import './Calculator.css'

import React from 'react'

interface Props {}

interface State {
  value: string
  secondValue?: string
  modifier?: string
}

const regexp = /([-]?(\d+\.$|\d+\.\d+|\d+))+/

const ADD = "+"
const SUBTRACT = "-"
const DIVIDE = "÷"
const MULTIPLY = "×"

class Calculator extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props)
    this.state = {
      value: "0"
    }

    document.addEventListener("keyup", this.backspaceListener)
  }

  private backspaceListener = (event: any) => {
    if (event.defaultPrevented) {
      return
    }

    var key = event.key || event.keyCode

    if (key === "Delete" && this.state.value !== "0") {
      this.backspace()
    }
    event.stopPropagation()
  }

  private backspace = () => {
    this.setState(prevState => {
      return {
        value:
          prevState.value.length === 1
            ? "0"
            : prevState.value.slice(0, prevState.value.length - 1)
      }
    })
  }

  private isNumber = (num: string): RegExpMatchArray | null => {
    return num.match(regexp)
  }

  private getNewNumber = (oldNumber: string | undefined, newChar: string) => {
    let match
    if (oldNumber === undefined || oldNumber === "0") {
      match = this.isNumber(newChar)
      if (match) {
        return newChar
      } else {
        return oldNumber
      }
    }
    match = this.isNumber(`${oldNumber}${newChar}`)
    if (match && match[0] === `${oldNumber}${newChar}`) {
      return match[0]
    } else {
      return oldNumber
    }
  }

  private appendNumber = (num: string) => {
    if (this.state.modifier) {
      this.setState(prevState => {
        return {
          secondValue: this.getNewNumber(prevState.secondValue, num)
        }
      })
    } else {
      this.setState(prevState => {
        return {
          value: this.getNewNumber(prevState.value, num)!
        }
      })
    }
  }

  private setModifier = (modifier: string) => {
    if (this.state.secondValue) {
      this.calculate(modifier)()
    } else {
      this.setState({
        modifier,
        secondValue: undefined
      })
    }
  }

  private clearValues = () => {
    this.setState({
      value: "0",
      modifier: undefined,
      secondValue: undefined
    })
  }

  private calculate = (nextModifier?: string) => (): void => {
    this.setState(prevState => {
      let value = parseFloat(prevState.value)
      const mod = prevState.modifier
      if (mod && !prevState.secondValue) {
        value = this.performOperation(value, value, mod)
      } else if (mod && prevState.secondValue) {
        value = this.performOperation(
          value,
          parseFloat(prevState.secondValue),
          mod
        )
      }

      return {
        value: value.toString(),
        modifier: nextModifier,
        secondValue: undefined
      }
    })
  }

  private performOperation = (
    val1: number,
    val2: number,
    op: string
  ): number => {
    return op === DIVIDE
      ? val1 / val2
      : op === MULTIPLY
      ? val1 * val2
      : op === SUBTRACT
      ? val1 - val2
      : val1 + val2
  }

  private createNumericalButton = (number: string): JSX.Element => {
    return (
      <button className="calc-button" onClick={e => this.appendNumber(number)}>
        {number}
      </button>
    )
  }

  private createModifierButton = (mod: string): JSX.Element => {
    return (
      <button className="calc-button" onClick={e => this.setModifier(mod)}>
        {mod}
      </button>
    )
  }

  public render = () => {
    const mod = this.state.modifier ? ` ${this.state.modifier}` : ""
    const secondValue = this.state.secondValue
      ? ` ${this.state.secondValue}`
      : ""
    const displayString = `${this.state.value}${mod}${secondValue}`

    return (
      <div
        style={{
          width: "320px",
          display: "inline-block",
          marginTop: "5%"
        }}
      >
        <div
          style={{
            borderStyle: "solid",
            borderWidth: "4px",
            background: "#122030"
          }}
        >
          <div style={{ margin: "10px" }}>
            <h2
              style={{
                background: "white",
                height: "60px",
                fontSize: "44px",
                wordWrap: "break-word",
                overflow: "hidden",
                borderColor: "#FFFFFF",
                borderWidth: "5px"
              }}
            >
              {displayString}
            </h2>
            <div
              style={{
                display: "flex",
                flex: "1 1 auto",
                flexDirection: "column"
              }}
            >
              <div className="calc-row">
                <button className="calc-button" onClick={this.clearValues}>
                  C
                </button>
                <button className="calc-button" onClick={this.backspace}>
                  ⌫
                </button>
              </div>

              <div className="calc-row">
                {this.createNumericalButton("7")}
                {this.createNumericalButton("8")}
                {this.createNumericalButton("9")}
                {this.createModifierButton(DIVIDE)}
              </div>
              <div className="calc-row">
                {this.createNumericalButton("4")}
                {this.createNumericalButton("5")}
                {this.createNumericalButton("6")}
                {this.createModifierButton(MULTIPLY)}
              </div>
              <div className="calc-row">
                {this.createNumericalButton("1")}
                {this.createNumericalButton("2")}
                {this.createNumericalButton("3")}
                {this.createModifierButton(SUBTRACT)}
              </div>
              <div className="calc-row">
                {this.createNumericalButton("0")}
                {this.createNumericalButton(".")}
                <button className="calc-button" onClick={this.calculate()}>
                  =
                </button>
                {this.createModifierButton(ADD)}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Calculator
