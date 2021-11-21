import React, { useState, useEffect, Fragment } from 'react';

import {
    EuiSpacer,
    EuiFormControlLayoutDelimited,
    EuiFormLabel,
    EuiButtonEmpty,
    EuiCallOut,
} from '@elastic/eui';
//
export const DatePicker = ({
    selectedDateRangeHandlerMiddleware, sendValidity
}: any) => {

    const [start, setStart] = useState('now-30m');
    const [end, setEnd] = useState('now');
    const [isStartValid, setIsStartValid] = useState(true);
    const [isEndValid, setIsEndValid] = useState(true);

    useEffect(() => {
        if (isStartValid && isEndValid) { sendPickedRanges() }
        sendValidity(isStartValid && isEndValid)
    }, [isStartValid, isEndValid, start, end])

    const onStartInputChange = (e: any) => {
        setStart(e.target.value);
        let isValid = isDateValid(e.target.value)
        setIsStartValid(isValid)
    };

    const onEndInputChange = (e: any) => {
        setEnd(e.target.value);
        let isValid = isDateValid(e.target.value)
        setIsEndValid(isValid)
    };

    const sendPickedRanges = () => {
        selectedDateRangeHandlerMiddleware({ start, end })
    }

    const isDateValid = (startInput: any) => {
        let removeSpaces = startInput.replace(/\s/g, '');
        let isSlash = false;
        if (removeSpaces.startsWith("now") && (removeSpaces.endsWith("y") || removeSpaces.endsWith("M") || removeSpaces.endsWith("w") || removeSpaces.endsWith("d") || removeSpaces.endsWith("h") || removeSpaces.endsWith("H") || removeSpaces.endsWith("m") || removeSpaces.endsWith("s"))) {
            removeSpaces = removeSpaces.replace('now', '');
            let seperator = removeSpaces[0]
            if (removeSpaces.length == 0) { return true }
            switch (seperator) {
                case '-': case '+':
                    removeSpaces = removeSpaces.replace(seperator, '');
                    break;
                case '/':
                    isSlash = true;
                    removeSpaces = removeSpaces.replace(seperator, '');
                    break;
                default:
                    return false;
            }
            if (isSlash && (removeSpaces.startsWith("y") || removeSpaces.startsWith("M") || removeSpaces.startsWith("w") || removeSpaces.startsWith("d") || removeSpaces.startsWith("h") || removeSpaces.startsWith("H") || removeSpaces.startsWith("m") || removeSpaces.startsWith("s"))) {
                return true
            }
            if (!isSlash && !isNaN(removeSpaces[0])) {
                while (!isNaN(removeSpaces[0])) {
                    removeSpaces = removeSpaces.replace(removeSpaces[0], '');
                }
                if (removeSpaces.length == 1 && (removeSpaces.startsWith("y") || removeSpaces.startsWith("M") || removeSpaces.startsWith("w") || removeSpaces.startsWith("d") || removeSpaces.startsWith("h") || removeSpaces.startsWith("H") || removeSpaces.startsWith("m") || removeSpaces.startsWith("s"))) {
                    return true
                }
            }
        }
        return false
    };

    return (
        <Fragment>
            <EuiButtonEmpty flush="right" href="https://www.elastic.co/guide/en/elasticsearch/reference/7.12/common-options.html#date-math" target="_blank" size="xs">
                Acceptable date formats
            </EuiButtonEmpty>
            <EuiSpacer size="xs" />
            <EuiFormControlLayoutDelimited
                prepend={<EuiFormLabel>Range</EuiFormLabel>}
                startControl={
                    <input
                        onChange={onStartInputChange}
                        type="text"
                        value={start}
                        placeholder="start"
                        className="euiFieldText"
                        required={isStartValid}
                    />
                }
                endControl={
                    <input
                        onChange={onEndInputChange}
                        type="text"
                        placeholder="end"
                        value={end}
                        className="euiFieldText"
                        required={isEndValid}
                    />
                }
            />

            <EuiSpacer size="m" />

            {!(isEndValid && isStartValid) && <EuiCallOut title="Invalid range input" color="warning" iconType="help">
                <p>
                    Examples: <br></br>
                    now<br></br>
                    now-1d<br></br>
                    now+24h<br></br>
                    now/d
                </p>
            </EuiCallOut>
            }
        </Fragment>
    );
};
