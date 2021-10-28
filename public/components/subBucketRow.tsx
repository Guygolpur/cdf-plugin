import React, { useState, useEffect, Fragment } from 'react';
import {
    EuiSpacer,
    EuiText,
    EuiButton,
    EuiAccordion,
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

    const [ids, setIds] = useState([]);
    const [globalCounter, setGlobalCounter] = useState(0);

    useEffect(() => {
        console.log('ids useEffect: ', ids)
    }, [ids])

    const deleteHandeler = (removeId: any) => {
        setIds((ids) => ids.filter((id) => id != removeId));
        cleanSubBucketArrayBuffer(removeId)
    };

    const addHandeler = () => {
        setIds((ids) => [...ids, `${globalCounter}`]);
        setGlobalCounter(globalCounter + 1)
    };

    const extraAction = (id: any) => (
        <EuiButtonIcon
            iconType="cross"
            color="danger"
            aria-label="Delete"
            onClick={() => deleteHandeler(id)}
        />
    );

    return (

        <EuiText size="s">
            <EuiSpacer size="s" />
            {ids.map((id) => (
                <Fragment
                    key={id}
                >
                    <EuiAccordion id="accordionSplit" buttonContent={`Split lines`} initialIsOpen={true} extraAction={extraAction(id)} className="euiAccordionForm">
                        <EuiPanel style={{ maxWidth: '100%' }}>
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

                            <EuiSpacer size="m" />
                            <hr
                                style={{
                                    color: '#C0C0C0',
                                    backgroundColor: '#C0C0C0',
                                    height: 5
                                }}
                            />
                        </EuiPanel>
                    </EuiAccordion>
                    <EuiSpacer size="xl" />
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
