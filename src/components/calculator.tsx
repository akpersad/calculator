import { useState } from "react"
import "./calculator.css"

const NUMBERS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
const OPERATIONS = ['+', '-', 'X', "÷"]
const EQUAL = '='
const CLEAR = 'AC'
const DECIMAL = '.'
const PLUS_MINUS = '+/-'
const PERCENT = '%'

export const Calculator = () => {
    const [displayedValue, setDisplayedValue] = useState('0');
    const [previousValue, setPreviousValue] = useState('');
    const [whichOperationClicked, setWhichOperationClicked] = useState('');
    const [operationLastClicked, setOperationLastClicked] = useState(false);

    const handleCalculation = (val1: string, val2: string, operation: string): string => {
        let calcHolder = 0;
        switch (operation) {
            case "+":
                calcHolder = parseFloat(val1) + parseFloat(val2);
                break;

            case "-":
                calcHolder = parseFloat(val1) - parseFloat(val2);
                break;

            case "X":
                calcHolder = parseFloat(val1) * parseFloat(val2);
                break;

            case "÷":
                calcHolder = parseFloat(val1) / parseFloat(val2);
                break;
            default:
                break;
        }
        return calcHolder.toString();
    }

    const handleButtonClick = (value: string, isOperationPress?: boolean) => {
        setDisplayedValue((prev) => {
            // Handle sign change
            if (value === PLUS_MINUS) {
                return (parseFloat(prev) * -1).toString();
            }

            if (value === PERCENT) {
                return (parseFloat(prev) * .01).toString();
            }

            // Handle Operation clicked flow
            // Handle operation change without additional input
            if (whichOperationClicked && isOperationPress && operationLastClicked) {
                setWhichOperationClicked(value);
                return prev;
            }

            // Handle equals button
            if (value === EQUAL) {
                // Handle divide by 0
                if (whichOperationClicked === "÷" && parseFloat(displayedValue) === 0) {
                    return prev;
                }

                if (previousValue && whichOperationClicked) {
                    const result = handleCalculation(previousValue, prev, whichOperationClicked);
                    setPreviousValue('');
                    setWhichOperationClicked('');
                    setOperationLastClicked(false);
                    return result;
                }
                return prev;
            }

            // Handle operation with previous value
            if (isOperationPress) {
                // TODO: refactor repeasted code. Functionality matches prompt
                if (whichOperationClicked === "÷" && parseFloat(displayedValue) === 0) {
                    return prev;
                }

                setOperationLastClicked(true)
                setWhichOperationClicked(value);
                if (previousValue && whichOperationClicked) {
                    const previousWithCalculation = handleCalculation(previousValue, prev, whichOperationClicked);
                    setPreviousValue(previousWithCalculation);
                    return previousWithCalculation;
                }
                setPreviousValue(prev)
                return prev;
            }


            // Handle initial 0 state
            if (prev === '0') {
                if (value === ".") {
                    return prev + value;
                }
                return value;
            }

            // Handle multiple decimal clicks
            if (value === DECIMAL && prev.includes(DECIMAL)) {
                return prev;
            }

            // Handle non-0 state
            if (operationLastClicked) {
                setOperationLastClicked(false);
                return value;
            }
            return prev + value;
        });
    }

    const handleClear = () => {
        setDisplayedValue('0');
        setPreviousValue('');
        setWhichOperationClicked('');
        setOperationLastClicked(false);
    }

    return (
        <div className="calculator">
            <h2 className="display">{displayedValue}</h2>
            <button onClick={() => handleClear()}>{CLEAR}</button>
            <button onClick={() => handleButtonClick(PLUS_MINUS)}>{PLUS_MINUS}</button>
            <button onClick={() => handleButtonClick(PERCENT)}>{PERCENT}</button>
            {NUMBERS.map(number => {
                return <button key={`1234-${number}`} onClick={() => handleButtonClick(number)}>
                    {number}
                </button>
            })}
            <button onClick={() => handleButtonClick(DECIMAL)}>{DECIMAL}</button>
            {OPERATIONS.map(operation => {
                return <button key={`2345-${operation}`} onClick={() => handleButtonClick(operation, true)}>{operation}</button>
            })}
            <button onClick={() => handleButtonClick(EQUAL, true)}>{EQUAL}</button>
        </div>
    )
}