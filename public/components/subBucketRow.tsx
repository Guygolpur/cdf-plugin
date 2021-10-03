import React, { Fragment, useState } from 'react';
import { htmlIdGenerator } from '@elastic/eui';

import {
    EuiScreenReaderOnly,
    EuiSpacer,
    EuiText,
    EuiButton,
} from '@elastic/eui';
import { AddSubBucket } from './addSubBucket';


export const SubBucketRow = ({
    stateParams, splitedAggregationArr, selectedSplitLinesTermsField,
    isIndexSelected, isXAxisFieldSelected, selectedSplitLinesTermsFieldHandler,
    onGeneralValChange, selectedSplitLinesHistogramField, onSplitedSeperateBucketChange, onSplitedShowMissingValuesChange,
    selectSplitLinesMinimumInterval, numberFieldArr, selectedDateRangeHandler,
    dateFieldArr, selectSplitLinesAggregation, selectedSplitLinesDateHistogramField,
    selectedSplitLinesDateRangeField, selectedSplitLinesHistogramFieldHandler, selectedSplitLinesDateHistogramFieldHandler,
    selectedSplitLinesDateRangeFieldHandler, setDateRangeStart, setDateRangeEnd
}: any) => {

    const [globalCounter, setGlobalCounter] = useState(1);
    const rows = [];
    for (let i = 1; i <= globalCounter; i++) {
        rows.push(
            <AddSubBucket
                counter={i}
                stateParams={stateParams}
                splitedAggregationArr={splitedAggregationArr}
                selectedSplitLinesTermsField={selectedSplitLinesTermsField}
                isIndexSelected={isIndexSelected}
                isXAxisFieldSelected={isXAxisFieldSelected}
                numberFieldArr={numberFieldArr}
                dateFieldArr={dateFieldArr}
                selectedSplitLinesHistogramField={selectedSplitLinesHistogramField}
                selectedSplitLinesDateHistogramField={selectedSplitLinesDateHistogramField}
                selectedSplitLinesDateRangeField={selectedSplitLinesDateRangeField}

                selectSplitLinesAggregation={selectSplitLinesAggregation}
                selectedSplitLinesTermsFieldHandler={selectedSplitLinesTermsFieldHandler}
                selectSplitLinesMinimumInterval={selectSplitLinesMinimumInterval}
                selectedDateRangeHandler={selectedDateRangeHandler}

                onSplitedSeperateBucketChange={onSplitedSeperateBucketChange}
                onSplitedShowMissingValuesChange={onSplitedShowMissingValuesChange}
                selectedSplitLinesHistogramFieldHandler={selectedSplitLinesHistogramFieldHandler}
                selectedSplitLinesDateHistogramFieldHandler={selectedSplitLinesDateHistogramFieldHandler}
                selectedSplitLinesDateRangeFieldHandler={selectedSplitLinesDateRangeFieldHandler}
                setDateRangeStart={setDateRangeStart}
                setDateRangeEnd={setDateRangeEnd}

                onGeneralValChange={(e: any, valName: any) => onGeneralValChange(e, valName)}
            />
        );
    }

    const growingAccordianDescriptionId = htmlIdGenerator()();
    const listId = htmlIdGenerator()();
    return (
        <EuiText size="s">
            <EuiScreenReaderOnly>
                <div id={growingAccordianDescriptionId}>
                    Currently height is set to {globalCounter} items
                </div>
            </EuiScreenReaderOnly>
            <EuiSpacer size="s" />
            <ul id={listId}>{rows}</ul>
            <div>
                <EuiButton
                    size="s"
                    iconType="plusInCircleFilled"
                    onClick={() => setGlobalCounter(globalCounter + 1)}
                    aria-controls={listId}
                    aria-describedby={growingAccordianDescriptionId}
                    fullWidth
                >
                    Add Split lines
                </EuiButton>{' '}
                <EuiSpacer size="s" />
                <EuiButton
                    size="s"
                    iconType="minusInCircleFilled"
                    aria-controls={listId}
                    aria-describedby={growingAccordianDescriptionId}
                    onClick={() => setGlobalCounter(Math.max(0, globalCounter - 1))}
                    isDisabled={globalCounter === 1}
                    fullWidth
                >
                    Remove last Split lines Bucket
                </EuiButton>
            </div>
        </EuiText>
    );
};
