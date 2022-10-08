import './Calculator.css'

import React, { useEffect, useState } from 'react'

const regexp = /([-]?(\d+\.$|\d+\.\d+|\d+))+/

const ADD = '+'
const SUBTRACT = '-'
const DIVIDE = '÷'
const MULTIPLY = '×'

export const Calculator = (): JSX.Element => {
  const [value, setValue] = useState<string>('0')
  const [secondValue, setSecondValue] = useState<string | undefined>(undefined)
  const [modifier, setModifier] = useState<string | undefined>(undefined)

  useEffect(() => {
    document.addEventListener('keyup', backspaceListener)
  }, [])

  const backspaceListener = (event: KeyboardEvent) => {
    if (event.defaultPrevented) {
      return
    }

    const key = event.key || event.keyCode

    if (key === 'Delete' && value !== '0') {
      backspace()
    }
    event.stopPropagation()
  }

  const backspace = () => {
    setValue(value.length === 1 ? '0' : value.slice(0, value.length - 1))
  }

  const isNumber = (num: string): RegExpMatchArray | null => {
    return num.match(regexp)
  }

  const getNewNumber = (oldNumber: string | undefined, newChar: string) => {
    let match
    if (oldNumber === undefined || oldNumber === '0') {
      match = isNumber(newChar)
      if (match) {
        return newChar
      } else {
        return oldNumber
      }
    }
    match = isNumber(`${oldNumber}${newChar}`)
    if (match && match[0] === `${oldNumber}${newChar}`) {
      return match[0]
    } else {
      return oldNumber
    }
  }

  const appendNumber = (num: string) => {
    if (modifier) {
      setSecondValue(getNewNumber(secondValue, num))
    } else {
      setValue(getNewNumber(value, num)!)
    }
  }

  const setMod = (mod: string) => {
    if (secondValue) {
      calculate(mod)()
    } else {
      setModifier(mod)
      setSecondValue(undefined)
    }
  }

  const clearValues = () => {
    setValue('0')
    setModifier(undefined)
    setSecondValue(undefined)
  }

  const calculate = (nextModifier?: string) => (): void => {
    let newValue = parseFloat(value)
    if (modifier && !secondValue) {
      newValue = performOperation(newValue, newValue, mod)
    } else if (mod && secondValue) {
      newValue = performOperation(newValue, parseFloat(secondValue), mod)
    }
    setValue(newValue.toString())
    setModifier(nextModifier)
    setSecondValue(undefined)
  }

  const performOperation = (val1: number, val2: number, op: string): number => {
    return op === DIVIDE ? val1 / val2 : op === MULTIPLY ? val1 * val2 : op === SUBTRACT ? val1 - val2 : val1 + val2
  }

  const createNumericalButton = (number: string): JSX.Element => {
    return (
      <button className="calc-button" onClick={() => appendNumber(number)}>
        {number}
      </button>
    )
  }

  const createModifierButton = (mod: string): JSX.Element => {
    return (
      <button className="calc-button" onClick={() => setMod(mod)}>
        {mod}
      </button>
    )
  }

  const mod = modifier ? ` ${modifier}` : ''
  const secValue = secondValue ? ` ${secondValue}` : ''
  const displayString = `${value}${mod}${secValue}`

  return (
    <div className={'calc'}>
      <div className={'calc-background'}>
        <div style={{ margin: '10px' }}>
          <h2 className={'calc-value-display'}> {displayString} </h2>
          <div
            style={{
              display: 'flex',
              flex: '1 1 auto',
              flexDirection: 'column',
            }}
          >
            <div className="calc-row">
              <button className="calc-button" onClick={clearValues}>
                C
              </button>
              <button className="calc-button" onClick={backspace}>
                ⌫
              </button>
            </div>

            <div className="calc-row">
              {createNumericalButton('7')}
              {createNumericalButton('8')}
              {createNumericalButton('9')}
              {createModifierButton(DIVIDE)}
            </div>
            <div className="calc-row">
              {createNumericalButton('4')}
              {createNumericalButton('5')}
              {createNumericalButton('6')}
              {createModifierButton(MULTIPLY)}
            </div>
            <div className="calc-row">
              {createNumericalButton('1')}
              {createNumericalButton('2')}
              {createNumericalButton('3')}
              {createModifierButton(SUBTRACT)}
            </div>
            <div className="calc-row">
              {createNumericalButton('0')}
              {createNumericalButton('.')}
              <button className="calc-button" onClick={calculate()}>
                =
              </button>
              {createModifierButton(ADD)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
