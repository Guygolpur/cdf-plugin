import React, { useState, Fragment } from 'react';

import {
    EuiSpacer,
    EuiButton,
} from '@elastic/eui';
import { AddSubBucket } from './addSubBucket';


export const SubBucketHandler = ({
    stateParams, splitedAggregationArr, selectedSplitLinesTermsField,
    isIndexSelected, isXAxisFieldSelected, selectedSplitLinesTermsFieldHandler,
    onGeneralValChange, selectedSplitLinesHistogramField, onSplitedSeperateBucketChange, onSplitedShowMissingValuesChange,
    selectSplitLinesMinimumInterval, numberFieldArr, selectedDateRangeHandler,
    dateFieldArr, selectSplitLinesAggregation, selectedSplitLinesDateHistogramField,
    selectedSplitLinesDateRangeField,
    setDateRangeStart, setDateRangeEnd
}: any) => {


    function RemoveSplitLine({ deleteHandeler, id }: any) {
        return (
            <>
                <AddSubBucket
                    counter={id}
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
                    onClick={deleteHandeler}
                    fullWidth
                >
                    Remove Split lines
                </EuiButton>
                <EuiSpacer size="m" />
                <hr
                    style={{
                        color: '#C0C0C0',
                        backgroundColor: '#C0C0C0',
                        height: 4
                    }}
                />
                <EuiSpacer size="xl" />
            </>
        );
    }


    function SplitLine() {
        const [ids, setIds] = useState([]);
        const [globalCounter, setGlobalCounter] = useState(0);

        const addHandeler = () => {
            setIds((ids) => [...ids, `${globalCounter}`]);
            setGlobalCounter(globalCounter + 1)
        };

        const deleteHandeler = (removeId: any) => {
            setIds((ids) => ids.filter((id) => id !== removeId));
        }

        return (
            <div>
                {ids.map((id) => (
                    <RemoveSplitLine key={id} id={id} deleteHandeler={() => deleteHandeler(id)} />
                ))}

                <EuiButton
                    size="s"
                    iconType="plusInCircleFilled"
                    onClick={addHandeler}
                    fullWidth
                >
                    Add Split lines
                </EuiButton>{' '}
                <EuiSpacer size="s" />
            </div>
        );
    }

    return (
        <Fragment>
            <SplitLine />
        </Fragment>
    );
};
