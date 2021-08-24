import React, { useState, Fragment } from 'react';

import {
    EuiSuperDatePicker,
    EuiSpacer,
    EuiFormControlLayoutDelimited,
    EuiFormLabel,
    EuiPanel,
    EuiFormRow
} from '@elastic/eui';

export function DatePicker() {
    const [recentlyUsedRanges, setRecentlyUsedRanges] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [start, setStart] = useState('now-30m');
    const [end, setEnd] = useState('now');
    const [isPaused, setIsPaused] = useState(true);
    const [refreshInterval, setRefreshInterval] = useState();

    const onTimeChange = ({ start, end }: any) => {
        const recentlyUsedRange = recentlyUsedRanges.filter((recentlyUsedRange) => {
            const isDuplicate =
                recentlyUsedRange.start === start && recentlyUsedRange.end === end;
            return !isDuplicate;
        });
        recentlyUsedRange.unshift({ start, end });
        setStart(start);
        setEnd(end);
        setRecentlyUsedRanges(
            recentlyUsedRange.length > 10
                ? recentlyUsedRange.slice(0, 9)
                : recentlyUsedRange
        );
        setIsLoading(true);
        startLoading();
    };

    const onRefresh = ({ start, end, refreshInterval }: any) => {
        return new Promise((resolve) => {
            setTimeout(resolve, 100);
        }).then(() => {
            console.log(start, end, refreshInterval);
        });
    };

    const onStartInputChange = (e) => {
        setStart(e.target.value);
    };

    const onEndInputChange = (e) => {
        setEnd(e.target.value);
    };

    const startLoading = () => {
        setTimeout(stopLoading, 1000);
    };

    const stopLoading = () => {
        setIsLoading(false);
    };

    const onRefreshChange = ({ isPaused, refreshInterval }: any) => {
        setIsPaused(isPaused);
        setRefreshInterval(refreshInterval);
    };

    const errors = [
        "Here's an example of an error",
        'You might have more than one error, so pass an array.',
    ];

    const renderTimeRange = () => {
        return (
            <Fragment>
                <EuiPanel paddingSize="m">
                    <EuiSpacer />

                    <EuiFormControlLayoutDelimited
                        prepend={<EuiFormLabel>Range</EuiFormLabel>}
                        startControl={
                            <input
                                onChange={onStartInputChange}
                                type="text"
                                value={start}
                                placeholder="start"
                                className="euiFieldText"
                            />
                        }
                        endControl={
                            <input
                                onChange={onEndInputChange}
                                type="text"
                                placeholder="end"
                                value={end}
                                className="euiFieldText"
                            />
                        }
                    />

                </EuiPanel>
            </Fragment>
        );
    };

    return (
        <>
            <EuiSuperDatePicker
                isLoading={isLoading}
                start={start}
                end={end}
                onTimeChange={onTimeChange}
                onRefresh={onRefresh}
                isPaused={isPaused}
                refreshInterval={refreshInterval}
                onRefreshChange={onRefreshChange}
                recentlyUsedRanges={recentlyUsedRanges}
            />
            <EuiSpacer />
            {renderTimeRange()}
        </>
    );
};