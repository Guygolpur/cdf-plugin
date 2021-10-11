import React, { useState, useEffect } from 'react';
import { htmlIdGenerator } from '@elastic/eui';
import {
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
    selectedSplitLinesDateRangeField,
    setDateRangeStart, setDateRangeEnd
}: any) => {

    const [globalCounter, setGlobalCounter] = useState(1);
    const [ids, setIds] = useState(['0']);
    const growingAccordianDescriptionId = htmlIdGenerator()();
    const listId = htmlIdGenerator()();

    useEffect(() => {
        console.log('ids useEffect: ', ids)
    }, [ids])


    const deleteHandeler = (removeId: any) => {
        // debugger
        console.log('removeId: ', removeId)
        setIds((ids) => ids.filter((id) => id != removeId));
        setGlobalCounter(Math.max(0, globalCounter))
        console.log('ids remove: ', ids)
    };

    const addHandeler = () => {
        debugger
        setIds((ids) => [...ids, `${globalCounter}`]);
        setGlobalCounter(globalCounter + 1)
        console.log('ids: ', ids)
    };

    //here X2
    return (
        <EuiText size="s">
            <EuiSpacer size="s" />
            {ids.map((id) => (
                <>
                    <AddSubBucket
                        counter={parseInt(id)}
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
                        setDateRangeStart={setDateRangeStart}
                        setDateRangeEnd={setDateRangeEnd}

                        onGeneralValChange={(e: any, valName: any) => onGeneralValChange(e, valName)}
                    />

                    <EuiButton
                        size="s"
                        iconType="minusInCircleFilled"
                        aria-controls={id}
                        aria-describedby={id}
                        onClick={() => deleteHandeler(parseInt(id) - 1)}
                        isDisabled={globalCounter === 1}
                        fullWidth
                    >
                        Remove last Split lines Bucket {parseInt(id) - 1}
                    </EuiButton>
                    <EuiSpacer size="m" />
                    <hr
                        style={{
                            color: '#C0C0C0',
                            backgroundColor: '#C0C0C0',
                            height: 5
                        }}
                    />
                    <EuiSpacer size="xl" />
                </>
            ))}
            <div style={{ textAlign: 'center' }}>
                <EuiButton
                    size="s"
                    iconType="plusInCircleFilled"
                    onClick={addHandeler}
                    aria-controls={listId}
                    aria-describedby={growingAccordianDescriptionId}
                >
                    Add Split lines
                </EuiButton>{' '}
                <EuiSpacer size="s" />
            </div>
        </EuiText>
    );
};
