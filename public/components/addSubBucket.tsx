import React, { Fragment } from 'react';

import {
    EuiFlexItem,
    EuiFlexGroup,
    EuiPanel,
    EuiSpacer,
    EuiText,
    EuiAccordion,
    EuiFormRow,
    EuiSelect,
    EuiComboBox,
    EuiSwitch,
    EuiFieldText,
    EuiCollapsibleNavGroup,
    EuiIconTip,
    EuiTextArea,
    EuiFieldNumber,
} from '@elastic/eui';
import { DatePicker } from './form/datePicker';

export const AddSubBucket = ({
    stateParams, splitedAggregationArr, selectedSplitLinesTermsField,
    isIndexSelected, isXAxisFieldSelected, selectedSplitLinesTermsFieldHandler,
    onGeneralValChange, onSplitedSeperateBucketChange, onSplitedShowMissingValuesChange,
    numberFieldArr, selectedSplitLinesHistogramField, selectedSplitLinesHistogramFieldHandler,
    dateFieldArr, selectedSplitLinesDateHistogramField, selectedSplitLinesDateHistogramFieldHandler,
    selectedSplitLinesDateRangeField, selectedSplitLinesDateRangeFieldHandler, setDateRangeStart,
    setDateRangeEnd, cleanFieldSplitLines
}: any) => {
    let splitedSubAggregationContent;
    if (stateParams.splitedAggregation == 'terms') {
        splitedSubAggregationContent = <>
            <EuiFormRow label="Field" fullWidth>
                <EuiComboBox
                    singleSelection={{ asPlainText: true }}
                    placeholder="Search"
                    options={splitedAggregationArr}
                    selectedOptions={selectedSplitLinesTermsField}
                    onChange={selectedSplitLinesTermsFieldHandler}
                    isClearable={true}
                    data-test-subj="splitLinesTermsField"
                    fullWidth
                    isDisabled={!(isIndexSelected && isXAxisFieldSelected)}
                    isInvalid={!(selectedSplitLinesTermsField.length > 0)}
                />
            </EuiFormRow>

            <EuiSpacer size="m" />

            <EuiFlexGroup style={{ maxWidth: 800 }}>
                <EuiFlexItem>
                    <EuiFormRow label="Order" >
                        <EuiSelect
                            options={[
                                { value: 'Descending', text: 'Descending' },
                                { value: 'Ascending', text: 'Ascending' },
                            ]}
                            onChange={(e) => onGeneralValChange(e, 'splitedOrder')}
                            disabled={!(isIndexSelected && isXAxisFieldSelected)}
                        />
                    </EuiFormRow>
                </EuiFlexItem>

            </EuiFlexGroup>

            <EuiSpacer size="s" />

            <EuiFormRow fullWidth hasChildLabel={false}>
                <EuiSwitch
                    label="Group other values in seperate bucket"
                    name="switch"
                    checked={stateParams.isSplitedSeperateBucket}
                    onChange={onSplitedSeperateBucketChange}
                    disabled={!(isIndexSelected && isXAxisFieldSelected)}
                />
            </EuiFormRow>

            <EuiSpacer size="s" />

            <EuiFormRow fullWidth hasChildLabel={false}>
                <EuiSwitch
                    label="Show missing values"
                    name="switch"
                    checked={stateParams.isSplitedShowMissingValues}
                    onChange={onSplitedShowMissingValuesChange}
                    disabled={!(isIndexSelected && isXAxisFieldSelected)}
                />
            </EuiFormRow>

            <EuiSpacer size="s" />

            <EuiFormRow label="Custom label" fullWidth onChange={(e: any) => onGeneralValChange(e, 'splitedCustomLabel')}>
                <EuiFieldText
                    name="first"
                    fullWidth
                    disabled={!(isIndexSelected && isXAxisFieldSelected)}
                />
            </EuiFormRow>

            <EuiCollapsibleNavGroup
                data-test-subj="ADVANCED"
                background="light"
                title="Advanced"
                arrowDisplay="left"
                isCollapsible={true}
                initialIsOpen={false}>
                <EuiText style={{ display: "inline" }} onChange={(e) => onGeneralValChange(e, 'jsonInput')} >
                    <dl className="eui-definitionListReverse" style={{ display: "inline" }}>
                        <dt style={{ display: "inline" }}>JSON input</dt>
                    </dl>
                </EuiText>
                <EuiIconTip
                    aria-label="Warning"
                    size="m"
                    type="alert"
                    color="black"
                    content="Any JSON formatted properties you add here will be marged with the elasticsearch aggregation definition for this section. For example 'shard_size' on a terms aggregation."
                />
                <EuiText size="s" color="subdued">
                    <EuiTextArea
                        aria-label="Use aria labels when no actual label is in use"
                        value={stateParams.advancedValue}
                        onChange={(e) => onGeneralValChange(e, 'advancedValue')}
                        disabled={!(isIndexSelected && isXAxisFieldSelected)}
                    />
                </EuiText>
            </EuiCollapsibleNavGroup>
        </>
    }
    else if (stateParams.splitedAggregation == 'histogram') {
        splitedSubAggregationContent = <>
            <EuiFormRow label="Field" fullWidth>
                <EuiComboBox
                    singleSelection={{ asPlainText: true }}
                    placeholder="Search"
                    options={numberFieldArr}
                    selectedOptions={selectedSplitLinesHistogramField}
                    onChange={selectedSplitLinesHistogramFieldHandler}
                    isClearable={true}
                    data-test-subj="selectedSplitLinesHistogramField"
                    fullWidth
                    isDisabled={!(isIndexSelected && isXAxisFieldSelected)}
                    isInvalid={!(selectedSplitLinesHistogramField.length > 0)}
                />
            </EuiFormRow>

            <EuiSpacer size="m" />

            <EuiText size="xs">
                <p>
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
                </p>
            </EuiText>

            <EuiSpacer size="xs" />

            <EuiFormRow fullWidth>
                <EuiFieldNumber
                    placeholder={'1'}
                    min={1}
                    onChange={(e) => onGeneralValChange(e, 'splitedHistogramMinInterval')}
                    disabled={!(isIndexSelected && isXAxisFieldSelected)}
                />
            </EuiFormRow>

            <EuiSpacer size="m" />

            <EuiFormRow fullWidth hasChildLabel={false}>
                <EuiSwitch
                    label="Show empty bucket"
                    name="switch"
                    checked={stateParams.isSplitedSeperateBucket}
                    onChange={onSplitedSeperateBucketChange}
                    disabled={!(isIndexSelected && isXAxisFieldSelected)}
                />
            </EuiFormRow>

            <EuiSpacer size="s" />

            <EuiFormRow fullWidth hasChildLabel={false}>
                <EuiSwitch
                    label="Extend bounds"
                    name="switch"
                    checked={stateParams.isSplitedShowMissingValues}
                    onChange={onSplitedShowMissingValuesChange}
                    disabled={!(isIndexSelected && isXAxisFieldSelected)}
                />
            </EuiFormRow>

            <EuiSpacer size="s" />

            <EuiFormRow label="Custom label" fullWidth onChange={(e: any) => onGeneralValChange(e, 'splitedCustomLabel')}>
                <EuiFieldText
                    name="first"
                    fullWidth
                    disabled={!(isIndexSelected && isXAxisFieldSelected)}
                />
            </EuiFormRow>

            <EuiCollapsibleNavGroup
                data-test-subj="ADVANCED"
                background="light"
                title="Advanced"
                arrowDisplay="left"
                isCollapsible={true}
                initialIsOpen={false}>
                <EuiText style={{ display: "inline" }} onChange={(e) => onGeneralValChange(e, 'jsonInput')}  >
                    <dl className="eui-definitionListReverse" style={{ display: "inline" }}>
                        <dt style={{ display: "inline" }}>JSON input</dt>
                    </dl>
                </EuiText>
                <EuiIconTip
                    aria-label="Warning"
                    size="m"
                    type="iInCircle"
                    color="black"
                    content="Any JSON formatted properties you add here will be marged with the elasticsearch aggregation definition for this section. For example 'shard_size' on a terms aggregation."
                />
                <EuiText size="s" color="subdued">
                    <EuiTextArea
                        aria-label="Use aria labels when no actual label is in use"
                        value={stateParams.advancedValue}
                        onChange={(e) => onGeneralValChange(e, 'advancedValue')}
                        disabled={!(isIndexSelected && isXAxisFieldSelected)}
                    />
                </EuiText>
            </EuiCollapsibleNavGroup>
        </>
    }
    else if (stateParams.splitedAggregation == 'date_histogram') {
        splitedSubAggregationContent = <>
            <EuiFormRow label="Field" fullWidth>
                <EuiComboBox
                    singleSelection={{ asPlainText: true }}
                    placeholder="Search"
                    options={dateFieldArr}
                    selectedOptions={selectedSplitLinesDateHistogramField}
                    onChange={selectedSplitLinesDateHistogramFieldHandler}
                    isClearable={true}
                    data-test-subj="splitLinesDateHistogramField"
                    fullWidth
                    isDisabled={!(isIndexSelected && isXAxisFieldSelected)}
                    isInvalid={!(selectedSplitLinesDateHistogramField.length > 0)}
                />
            </EuiFormRow>

            <EuiSpacer size="m" />

            <EuiFormRow label="Minimum interval" fullWidth>
                <EuiSelect
                    options={[
                        { value: 'minute', text: 'Minute' },
                        { value: '1h', text: 'Hourly' },
                        { value: '1d', text: 'Daily' },
                        { value: '1w', text: 'Weekly' },
                        { value: 'month', text: 'Monthly' },
                        { value: '1y', text: 'Yearly' },
                    ]}
                    fullWidth
                    onChange={(e: any) => onGeneralValChange(e, 'splitedDateHistogramMinInterval')}
                    disabled={!(isIndexSelected && isXAxisFieldSelected)}
                />
            </EuiFormRow>

            <EuiSpacer size="m" />

            <EuiFormRow fullWidth hasChildLabel={false}>
                <EuiSwitch
                    label="Drop partial buckets"
                    name="switch"
                    checked={stateParams.isSplitedSeperateBucket}
                    onChange={onSplitedSeperateBucketChange}
                    disabled={!(isIndexSelected && isXAxisFieldSelected)}
                />
            </EuiFormRow>

            <EuiSpacer size="s" />

            <EuiSpacer size="s" />

            <EuiFormRow label="Custom label" fullWidth onChange={(e: any) => onGeneralValChange(e, 'splitedCustomLabel')}>
                <EuiFieldText name="first" fullWidth disabled={!(isIndexSelected && isXAxisFieldSelected)} />
            </EuiFormRow>

            <EuiCollapsibleNavGroup
                data-test-subj="ADVANCED"
                background="light"
                title="Advanced"
                arrowDisplay="left"
                isCollapsible={true}
                initialIsOpen={false}>
                <EuiText style={{ display: "inline" }} onChange={(e) => onGeneralValChange(e, 'jsonInput')}  >
                    <dl className="eui-definitionListReverse" style={{ display: "inline" }}>
                        <dt style={{ display: "inline" }}>JSON input</dt>
                    </dl>
                </EuiText>
                <EuiIconTip
                    aria-label="Warning"
                    size="m"
                    type="alert"
                    color="black"
                    content="Any JSON formatted properties you add here will be marged with the elasticsearch aggregation definition for this section. For example 'shard_size' on a terms aggregation."
                />
                <EuiText size="s" color="subdued">
                    <EuiTextArea
                        aria-label="Use aria labels when no actual label is in use"
                        value={stateParams.advancedValue}
                        onChange={(e) => onGeneralValChange(e, 'advancedValue')}
                        disabled={!(isIndexSelected && isXAxisFieldSelected)}
                    />
                </EuiText>
            </EuiCollapsibleNavGroup>
        </>
    }
    else if (stateParams.splitedAggregation == 'date_range') {
        splitedSubAggregationContent = <>
            <EuiFormRow label="Field" fullWidth>
                <EuiComboBox
                    singleSelection={{ asPlainText: true }}
                    placeholder="Search"
                    options={dateFieldArr}
                    selectedOptions={selectedSplitLinesDateRangeField}
                    onChange={selectedSplitLinesDateRangeFieldHandler}
                    isClearable={true}
                    data-test-subj="splitLinesDateRangeField"
                    fullWidth
                    isDisabled={!(isIndexSelected && isXAxisFieldSelected)}
                    isInvalid={!(selectedSplitLinesDateRangeField.length > 0)}
                />
            </EuiFormRow>

            <EuiSpacer size="m" />

            < DatePicker disabled={!(isIndexSelected && isXAxisFieldSelected)} start={stateParams.dateRangeStart} end={stateParams.dateRangeEnd} setStart={setDateRangeStart} setEnd={setDateRangeEnd} />

            <EuiSpacer size="m" />

            <EuiFormRow label="Custom label" fullWidth onChange={(e: any) => onGeneralValChange(e, 'splitedCustomLabel')}>
                <EuiFieldText name="first" fullWidth disabled={!(isIndexSelected && isXAxisFieldSelected)} />
            </EuiFormRow>

            <EuiCollapsibleNavGroup
                data-test-subj="ADVANCED"
                background="light"
                title="Advanced"
                arrowDisplay="left"
                isCollapsible={true}
                initialIsOpen={false}>
                <EuiText style={{ display: "inline" }} onChange={(e) => onGeneralValChange(e, 'jsonInput')} >
                    <dl className="eui-definitionListReverse" style={{ display: "inline" }}>
                        <dt style={{ display: "inline" }}>JSON input</dt>
                    </dl>
                </EuiText>
                <EuiIconTip
                    aria-label="Warning"
                    size="m"
                    type="alert"
                    color="black"
                    content="Any JSON formatted properties you add here will be marged with the elasticsearch aggregation definition for this section. For example 'shard_size' on a terms aggregation."
                />
                <EuiText size="s" color="subdued">
                    <EuiTextArea
                        aria-label="Use aria labels when no actual label is in use"
                        value={stateParams.advancedValue}
                        onChange={(e) => onGeneralValChange(e, 'advancedValue')}
                        disabled={!(isIndexSelected && isXAxisFieldSelected)}
                    />
                </EuiText>
            </EuiCollapsibleNavGroup>
        </>
    }

    return (
        <Fragment>
            {/* <EuiAccordion id="accordionSplit" buttonContent={`Split lines`}> */}
            {/* <EuiPanel style={{ maxWidth: '100%' }}> */}

            <EuiFormRow label="Sub aggregation" fullWidth>
                <EuiSelect
                    options={[
                        { value: 'terms', text: 'Terms' },
                        { value: 'date_histogram', text: 'Date Histogram' },
                        { value: 'date_range', text: 'Date Range' },
                        { value: 'histogram', text: 'Histogram' },
                    ]}
                    onChange={(e) => cleanFieldSplitLines(e)}
                    fullWidth
                    disabled={!(isIndexSelected && isXAxisFieldSelected)}
                />
            </EuiFormRow>

            {splitedSubAggregationContent}

            {/* </EuiPanel> */}
            {/* </EuiAccordion> */}
        </Fragment>
    );
};
