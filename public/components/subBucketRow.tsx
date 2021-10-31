import React, { useState, useEffect, Fragment } from 'react';
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
    isIndexSelected, isXAxisFieldSelected, selectedSplitLinesTermsFieldHandler,
    onGeneralValChange, selectedSplitLinesHistogramField, onSplitedSeperateBucketChange,
    selectSplitLinesMinimumInterval, numberFieldArr, selectedDateRangeHandler,
    dateFieldArr, selectSplitLinesAggregation, selectedSplitLinesDateHistogramField,
    selectedSplitLinesDateRangeField, setDateRangeStart, setDateRangeEnd,
    onSplitedShowMissingValuesChange, cleanSubBucketArrayBuffer
}: any) => {

    const [ids, setIds] = useState<any>([]);
    const [globalCounter, setGlobalCounter] = useState(0);

    useEffect(() => {
        console.log('ids useEffect: ', ids)
    }, [ids])

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
                            selectIDtoRemove={extraAction}
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
