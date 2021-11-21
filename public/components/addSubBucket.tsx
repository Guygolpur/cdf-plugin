import React, { Fragment, useState, useEffect } from 'react';

import {
    EuiFlexItem,
    EuiFlexGroup,
    EuiSpacer,
    EuiText,
    EuiFormRow,
    EuiSelect,
    EuiComboBox,
    EuiSwitch,
    EuiFieldText,
    EuiIconTip,
    EuiFieldNumber,
    EuiAccordion,
    EuiButtonIcon,
} from '@elastic/eui';
import { DatePicker } from './form/datePicker';

export const AddSubBucket = ({
    counter, stateParams, splitedAggregationArr,
    isXAxisFieldSelected, selectedSplitLinesTermsFieldHandler,
    onGeneralValChange, onSplitedSeperateBucketChange, onSplitedShowMissingValuesChange,
    selectSplitLinesMinimumInterval, numberFieldArr, selectedDateRangeHandler,
    dateFieldArr, selectSplitLinesAggregation, selectIDtoRemove,
    ignoreSubBucketArrayBuffer, deleteHandeler, subBucketArray,
    selectSplitLinesTermsOrder, sendValidity
}: any) => {
    let splitedSubAggregationContent;

    const aggregationOptions = [
        { value: 'terms', text: 'Terms' },
        { value: 'date_histogram', text: 'Date Histogram' },
        { value: 'histogram', text: 'Histogram' },
        { value: 'date_range', text: 'Date Range' },
    ];

    const min_interval = [
        { value: '1m', text: 'Minute' },
        { value: '1h', text: 'Hourly' },
        { value: '1d', text: 'Daily' },
        { value: '1w', text: 'Weekly' },
        { value: '1M', text: 'Monthly' },
        { value: '1y', text: 'Yearly' },
    ]

    const order = [
        { value: 'desc', text: 'Descending' },
        { value: 'asc', text: 'Ascending' },
    ]


    const [selectedAggregationOptions, setAggregationSelected] = useState(subBucketArray[counter - 1] ? subBucketArray[counter - 1].agg : aggregationOptions[0].value);
    const [selectedFieldOptions, setFieldSelected] = useState<any>(subBucketArray[counter - 1] ? subBucketArray[counter - 1].field : []);
    const [selectedMinimumInterval, setMinimumIntervalSelected] = useState((!subBucketArray[counter - 1]) ? (min_interval[0].value) : ((subBucketArray[counter - 1].hasOwnProperty('min_interval')) ? (subBucketArray[counter - 1].min_interval) : (min_interval[0].value)));
    const [selectedTermsOrder, setSelectedTermsOrder] = useState((!subBucketArray[counter - 1]) ? (order[0].value) : ((subBucketArray[counter - 1].hasOwnProperty('order')) ? (subBucketArray[counter - 1].order) : (order[0].value)));

    const [isIgnore, setIsIgnore] = useState(true);
    // const [IdToIgnore, setIdToIgnore] = useState<any>([]);
    const [IdToIgnore, setIdToIgnore] = useState();

    useEffect(() => {
        if (IdToIgnore !== undefined) {
            ignoreSubBucketArrayBuffer(IdToIgnore, isIgnore)
        }
    }, [isIgnore])

    const onAggregationChange = (selected: any) => {
        setAggregationSelected(selected.target.value);
        setFieldSelected([]);
        setMinimumIntervalSelected(min_interval[0].value)
        selectSplitLinesAggregation(selected, counter);
    };
    const onFieldChange = (selected: any) => {
        setFieldSelected(selected);
        selectedSplitLinesTermsFieldHandler(selected, counter, selectedAggregationOptions);
    };
    const onGeneralMinimumIntervalChange = (selected: any) => {
        setMinimumIntervalSelected(selected.target.value);
        selectSplitLinesMinimumInterval(selected, counter);
    };

    const onTermsOrderChange = (selected: any) => {
        setSelectedTermsOrder(selected.target.value)
        selectSplitLinesTermsOrder(selected, counter);
    };

    const selectedDateRangeHandlerMiddleware = ({ start, end }: any) => {
        selectedDateRangeHandler({ start, end }, counter)
    }

    const ignoreHandeler = (removeId: any) => {
        // setIdToIgnore((ids: any) => ids.filter((id: any) => id != removeId));
        setIdToIgnore(removeId)
        setIsIgnore(!isIgnore);
    };

    const extraAction = (id: any, selectedAggregationOptions: any, selectedFieldOptions: any) => {
        selectIDtoRemove(id, selectedAggregationOptions, selectedFieldOptions)
        return (
            <div className="eui-textRight">
                {selectedFieldOptions.length > 0 ?
                    `${selectedAggregationOptions}: ${selectedFieldOptions[0].value}`
                    :
                    `${selectedAggregationOptions}`
                }

                <EuiButtonIcon
                    iconType={isIgnore ? 'eye' : 'eyeClosed'}
                    color="subdued"
                    aria-label="Ignore"
                    onClick={() => ignoreHandeler(id)}
                />

                <EuiButtonIcon
                    iconType="cross"
                    color="danger"
                    aria-label="Delete"
                    onClick={() => deleteHandeler(id)}
                />
            </div>
        )
    };

    if (selectedAggregationOptions == 'terms') {
        splitedSubAggregationContent = <>
            <EuiFormRow label="Field" fullWidth>
                <EuiComboBox
                    singleSelection={{ asPlainText: true }}
                    placeholder="Search"
                    options={splitedAggregationArr}
                    selectedOptions={selectedFieldOptions}
                    onChange={onFieldChange}
                    isClearable={true}
                    data-test-subj="splitLinesTermsField"
                    fullWidth
                    isDisabled={!(isXAxisFieldSelected)}
                    isInvalid={!(selectedFieldOptions.length > 0)}
                />
            </EuiFormRow>

            <EuiSpacer size="m" />

            <EuiFlexGroup >
                <EuiFlexItem>
                    <EuiFormRow label="Order" fullWidth>
                        <EuiSelect
                            options={order}
                            value={selectedTermsOrder}
                            onChange={(e): any => onTermsOrderChange(e)}
                            disabled={!(isXAxisFieldSelected)}
                            fullWidth
                        />
                    </EuiFormRow>
                </EuiFlexItem>

            </EuiFlexGroup>

            <EuiSpacer size="m" />

            <EuiFormRow fullWidth hasChildLabel={false}>
                <EuiSwitch
                    label="Group other values in seperate bucket"
                    name="switch"
                    checked={stateParams.isSplitedSeperateBucket}
                    onChange={onSplitedSeperateBucketChange}
                    disabled={!(isXAxisFieldSelected)}
                />
            </EuiFormRow>

            <EuiSpacer size="s" />

            <EuiFormRow fullWidth hasChildLabel={false}>
                <EuiSwitch
                    label="Show missing values"
                    name="switch"
                    checked={stateParams.isSplitedShowMissingValues}
                    onChange={onSplitedShowMissingValuesChange}
                    disabled={!(isXAxisFieldSelected)}
                />
            </EuiFormRow>

            <EuiSpacer size="s" />
        </>
    }
    else if (selectedAggregationOptions == 'date_histogram') {
        splitedSubAggregationContent = <>
            <EuiFormRow label="Field" fullWidth>
                <EuiComboBox
                    singleSelection={{ asPlainText: true }}
                    placeholder="Search"
                    options={dateFieldArr}
                    selectedOptions={selectedFieldOptions}
                    onChange={onFieldChange}
                    isClearable={true}
                    data-test-subj="splitLinesDateHistogramField"
                    fullWidth
                    isDisabled={!(isXAxisFieldSelected)}
                    isInvalid={!(selectedFieldOptions.length > 0)}
                />
            </EuiFormRow>

            <EuiSpacer size="m" />

            <EuiFormRow label="Interval" fullWidth>
                <EuiSelect
                    id="selectMinimumInterval"
                    options={min_interval}
                    value={selectedMinimumInterval}
                    onChange={(e: any) => onGeneralMinimumIntervalChange(e)}
                    fullWidth
                    disabled={!(isXAxisFieldSelected)}
                />
            </EuiFormRow>

            <EuiSpacer size="s" />
        </>
    }
    else if (selectedAggregationOptions == 'histogram') {
        splitedSubAggregationContent = <>
            <EuiFormRow label="Field" fullWidth>
                <EuiComboBox
                    singleSelection={{ asPlainText: true }}
                    placeholder="Search"
                    options={numberFieldArr}
                    selectedOptions={selectedFieldOptions}
                    onChange={onFieldChange}
                    isClearable={true}
                    data-test-subj="selectedSplitLinesHistogramField"
                    fullWidth
                    isDisabled={!(isXAxisFieldSelected)}
                    isInvalid={!(selectedFieldOptions.length > 0)}
                />
            </EuiFormRow>

            <EuiSpacer size="m" />

            <EuiText size="xs">
                <div>
                    <b>Minimum interval</b>
                    <EuiIconTip
                        type="iInCircle"
                        color="subdued"
                        content={
                            <span>
                                Interval will be automatically scaled in the event that the provided value creates more buckets than specified by Advanced Setting's histogram:maxBars
                            </span>
                        }
                        iconProps={{
                            className: 'eui-alignTop',
                        }}
                    />
                </div>
            </EuiText>

            <EuiSpacer size="xs" />

            <EuiFormRow fullWidth>
                <EuiFieldNumber
                    placeholder={selectedMinimumInterval == '1m' ? '1' : `${selectedMinimumInterval}`}
                    min={1}
                    onChange={(e: any) => onGeneralMinimumIntervalChange(e)}
                    disabled={!(isXAxisFieldSelected)}
                    fullWidth
                />
            </EuiFormRow>
        </>
    }
    else if (selectedAggregationOptions == 'date_range') {
        splitedSubAggregationContent = <>
            <EuiFormRow label="Field" fullWidth>
                <EuiComboBox
                    singleSelection={{ asPlainText: true }}
                    placeholder="Search"
                    options={dateFieldArr}
                    selectedOptions={selectedFieldOptions}
                    onChange={onFieldChange}
                    isClearable={true}
                    data-test-subj="splitLinesDateRangeField"
                    fullWidth
                    isDisabled={!(isXAxisFieldSelected)}
                    isInvalid={!(selectedFieldOptions.length > 0)}
                />
            </EuiFormRow>

            <EuiSpacer size="m" />

            {/* < DatePicker disabled={!(isIndexSelected && isXAxisFieldSelected)} start={stateParams.dateRangeStart} end={stateParams.dateRangeEnd} setStart={setDateRangeStart} setEnd={setDateRangeEnd} /> */}
            < DatePicker selectedDateRangeHandlerMiddleware={selectedDateRangeHandlerMiddleware} sendValidity={sendValidity}/>

            <EuiSpacer size="m" />

            <EuiFormRow label="Custom label" fullWidth onChange={(e: any) => onGeneralValChange(e, 'splitedCustomLabel')}>
                <EuiFieldText name="first" fullWidth disabled={!(isXAxisFieldSelected)} />
            </EuiFormRow>
        </>
    }

    return (
        <Fragment>
            <EuiAccordion id="accordionSplit" buttonContent={'Split lines '} initialIsOpen={true} extraAction={extraAction(counter, selectedAggregationOptions, selectedFieldOptions)} className="euiAccordionForm">

                <EuiFormRow label="Sub aggregation" fullWidth>
                    <EuiSelect
                        id="selectAggregation"
                        options={aggregationOptions}
                        value={selectedAggregationOptions}
                        onChange={(e) => onAggregationChange(e)}
                        fullWidth
                        disabled={!(isXAxisFieldSelected)}
                    />
                </EuiFormRow>

                {splitedSubAggregationContent}

                <EuiSpacer size="xl" />
            </EuiAccordion>
        </Fragment>
    );
};
