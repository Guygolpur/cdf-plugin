import React, { useState, Fragment } from 'react';

import {
    EuiSuperDatePicker,
    EuiSpacer,
    EuiFormControlLayoutDelimited,
    EuiFormLabel,
    EuiPanel,
    EuiButtonEmpty,
} from '@elastic/eui';

export const DatePicker = ({
    selectedDateRangeHandlerMiddleware
}: any) => {
    const [recentlyUsedRanges, setRecentlyUsedRanges] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [start, setStart] = useState('now-30m');
    const [end, setEnd] = useState('now');
    const [isPaused, setIsPaused] = useState(true);
    const [refreshInterval, setRefreshInterval] = useState();

    const onTimeChange = ({ start, end }: any) => {
        const recentlyUsedRange = recentlyUsedRanges.filter((recentlyUsedRange) => {
            const isDuplicate = recentlyUsedRange.start === start && recentlyUsedRange.end === end;
            return !isDuplicate;
        });
        recentlyUsedRange.unshift({ start, end });
        setStart(start)
        setEnd(end)
        setRecentlyUsedRanges(
            recentlyUsedRange.length > 10
                ? recentlyUsedRange.slice(0, 9)
                : recentlyUsedRange
        );
        setIsLoading(true);
        startLoading();
        selectedDateRangeHandlerMiddleware({start, end});

    };

    const onRefresh = ({ start, end, refreshInterval }: any) => {
        return new Promise((resolve) => {
            setTimeout(resolve, 100);
        }).then(() => {
            console.log(start, end, refreshInterval);
        });
    };

    const onStartInputChange = (e: any) => {
        setStart(e.target.value);
    };

    const onEndInputChange = (e: any) => {
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

    const renderTimeRange = () => {
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
            </Fragment>
        );
    };

    return (
        <>
            <EuiPanel>
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
                    showUpdateButton={false}
                // isDisabled={props.disabled}
                />
                <EuiSpacer />
                {renderTimeRange()}
            </EuiPanel>
        </>
    );
};