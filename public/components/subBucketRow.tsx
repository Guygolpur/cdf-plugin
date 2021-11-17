import React, { useState, Fragment, useEffect } from 'react';
import {
    EuiSpacer,
    EuiText,
    EuiButton,
    EuiPanel,
    EuiButtonIcon,
} from '@elastic/eui';
import { AddSubBucket } from './addSubBucket';


export const SubBucketRow = ({
    stateParams, splitedAggregationArr, selectedSplitLinesTermsField,
    isXAxisFieldSelected, selectedSplitLinesTermsFieldHandler, splitedGlobalCounter,
    onGeneralValChange, selectedSplitLinesHistogramField, onSplitedSeperateBucketChange,
    selectSplitLinesMinimumInterval, numberFieldArr, selectedDateRangeHandler,
    dateFieldArr, selectSplitLinesAggregation, selectedSplitLinesDateHistogramField,
    selectedSplitLinesDateRangeField, setDateRangeStart, setDateRangeEnd,
    onSplitedShowMissingValuesChange, cleanSubBucketArrayBuffer, ignoreSubBucketArrayBuffer,
    splitedGlobalCounterHandler, splitedGlobalIds, splitedGlobalIdsHandler,
    subBucketArray, selectSplitLinesTermsOrder
}: any) => {

    const [ids, setIds] = useState<any>(JSON.parse(splitedGlobalIds));
    const [globalCounter, setGlobalCounter] = useState(splitedGlobalCounter);

    useEffect(() => {   // Stopped here, work with keeping split lines windows, aggregation, field, min_interval, Terms: Order.. need to support: Histogram: Show empty buckets, Date_Range: calendar
        console.log('-------------------------------------------')      // need also to make sure on refresh: dates + XAxis- field appears but not really selected.
        console.log('ids: ', ids)
        console.log('splitedGlobalIds: ', JSON.parse(splitedGlobalIds))
        console.log('-------------------------------------------')
        console.log('globalCounter: ', globalCounter)
        console.log('splitedGlobalCounter: ', splitedGlobalCounter)
        console.log('-------------------------------------------')
    }, [ids, globalCounter])

    useEffect(() => {
        splitedGlobalIdsHandler(JSON.stringify(ids))
    }, [ids])

    useEffect(() => {
        splitedGlobalCounterHandler(globalCounter)
    }, [globalCounter])

    const deleteHandeler = (removeId: any) => {
        setIds((ids: any) => ids.filter((id: any) => id != removeId));
        cleanSubBucketArrayBuffer(removeId)
    };

    const addHandeler = () => {
        setIds((ids: any) => [...ids, `${globalCounter}`]);
        setGlobalCounter(globalCounter + 1)
    };

    const extraAction = (id: any, selectedAggregationOptions: any, selectedFieldOptions: any) => (
        <div className="eui-textRight">
            {selectedFieldOptions.length > 0 ?
                `${selectedAggregationOptions}: ${selectedFieldOptions[0].value}`
                :
                `${selectedAggregationOptions}`
            }

            <EuiButtonIcon
                iconType="cross"
                color="danger"
                aria-label="Delete"
                onClick={() => deleteHandeler(id)}
            />
        </div>
    );

    return (

        <EuiText size="s">
            <EuiSpacer size="s" />
            {ids.map((id: any) => (
                <Fragment
                    key={id}
                >
                    <EuiPanel color="subdued">
                        <AddSubBucket
                            counter={parseInt(id)}
                            stateParams={stateParams}
                            splitedAggregationArr={splitedAggregationArr}
                            selectedSplitLinesTermsField={selectedSplitLinesTermsField}
                            isXAxisFieldSelected={isXAxisFieldSelected}
                            numberFieldArr={numberFieldArr}
                            dateFieldArr={dateFieldArr}
                            selectedSplitLinesHistogramField={selectedSplitLinesHistogramField}
                            selectedSplitLinesDateHistogramField={selectedSplitLinesDateHistogramField}
                            selectedSplitLinesDateRangeField={selectedSplitLinesDateRangeField}
                            selectSplitLinesAggregation={selectSplitLinesAggregation}
                            selectedSplitLinesTermsFieldHandler={selectedSplitLinesTermsFieldHandler}
                            selectSplitLinesMinimumInterval={selectSplitLinesMinimumInterval}
                            selectSplitLinesTermsOrder={selectSplitLinesTermsOrder}
                            selectedDateRangeHandler={selectedDateRangeHandler}
                            onSplitedSeperateBucketChange={onSplitedSeperateBucketChange}
                            onSplitedShowMissingValuesChange={onSplitedShowMissingValuesChange}
                            setDateRangeStart={setDateRangeStart}
                            setDateRangeEnd={setDateRangeEnd}
                            onGeneralValChange={(e: any, valName: any) => onGeneralValChange(e, valName)}
                            selectIDtoRemove={extraAction}
                            ignoreSubBucketArrayBuffer={ignoreSubBucketArrayBuffer}
                            deleteHandeler={deleteHandeler}
                            subBucketArray={JSON.parse(subBucketArray)}
                        />
                        <EuiSpacer size="m" />
                    </EuiPanel>
                    <EuiSpacer size="l" />
                </Fragment>
            ))}
            <div style={{ textAlign: 'center' }}>
                <EuiButton
                    size="s"
                    iconType="plusInCircleFilled"
                    onClick={addHandeler}
                >
                    Add Split lines
                </EuiButton>{' '}
                <EuiSpacer size="s" />
            </div>
        </EuiText>
    );
};
