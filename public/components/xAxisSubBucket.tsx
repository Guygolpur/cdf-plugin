
// import React, { Fragment } from 'react';

// import {
//     EuiFormRow,
//     EuiSelect,
//     EuiSwitch,
//     EuiPanel,
//     EuiSpacer,
//     EuiCard,
//     EuiFlexItem,
//     EuiAccordion,
//     EuiFieldNumber,
//     EuiText,
//     EuiFieldText,
//     EuiCollapsibleNavGroup,
//     EuiTextArea,
//     EuiIconTip,
// } from '@elastic/eui';

// import { htmlIdGenerator } from '@elastic/eui/lib/services';
// import axios from 'axios';
// import { AddSubBucket } from '../components/addSubBucket';
// import { VisEditorOptionsProps } from 'src/plugins/visualizations/public';

// // import * as data from 'src/plugins/data/public';

// const idPrefix = htmlIdGenerator()();

// interface CounterParams {
//     isUpdate: boolean;
//     AxisExtents: boolean;
//     aggregation: string;
//     field: string;
//     min_interval: number;
//     isEmptyBucket: boolean;
//     isExtendBounds: boolean;
//     handleNoResults: boolean;
//     customLabel: string;
//     advancedValue: string;
//     jsonInput: string;
//     // timeFilterInput: data.SavedQueryTimeFilter;
//     timeFilterFromInput: string;
//     timeFilterToInput: string;
//   }

// export class XAxisSubBucket extends React.Component<VisEditorOptionsProps<CounterParams>> {
//     constructor(props: any) {
//         super(props);
//         this.state = {
//             checkboxIdToSelectedMap: { [`${idPrefix}0`]: true },
//             value: 100,
//             isShowBucket: false,
//             isShowBounds: false,
//             advancedValue: '',
//             jsonInput: '',
//             aggregationArr: [],
//         };
//     }

//     componentDidMount() {
//         this.getIndicesMapping()
//             .then(response => {
//                 const obj = response.data['arc-samples-20210623'].mappings.properties
//                 let objNode
//                 let fieldOptions: any[] = []
//                 Object.entries(obj).forEach(([key, value]) => {
//                     if (value.type === 'integer' || value.type === 'double' || value.type === 'long') {
//                         objNode = { 'value': key, 'text': key };
//                         fieldOptions.push(objNode)
//                     }
//                 })
//                 this.setState({ aggregationArr: fieldOptions })
//             })
//             .catch(error => { console.log('err: ', error) })
//     }

//     getIndicesMapping = () => {
//         return axios({
//             url: 'http://localhost:9200/arc-*/_mapping',
//             method: 'GET',
//         })
//     }

//     onAggregationChange = (e: any) => {
//         this.props.setValue('aggregation', e.target.value);
//     }

//     onFieldChange = (e: any) => {
//         this.props.setValue('field', e.target.value);
//     }

//     onMinIntervalChange = (e: any) => {
//         this.props.setValue('min_interval', e.target.value);
//     }

//     onChange = (optionId: any) => {
//         const newCheckboxIdToSelectedMap = {
//             ...this.state.checkboxIdToSelectedMap,
//             ...{
//                 [optionId]: !this.state.checkboxIdToSelectedMap[optionId],
//             },
//         };
//         this.setState({ checkboxIdToSelectedMap: newCheckboxIdToSelectedMap })
//     };

//     onShowBucketChange = () => {
//         this.props.setValue('isEmptyBucket', !this.props.stateParams.isEmptyBucket);
//         this.setState(prevState => ({
//             isShowBucket: !prevState.isShowBucket
//         }));
//     };

//     onShowBoundsChange = () => {
//         this.props.setValue('isExtendBounds', !this.props.stateParams.isExtendBounds);
//         this.setState(prevState => ({
//             isShowBounds: !prevState.isShowBounds
//         }));
//     };

//     onCustomLabelChange = (e: any) => {
//         this.props.setValue('customLabel', e.target.value);
//     };

//     onAdvanceChange = (e: any) => {
//         this.props.setValue('advancedValue', e.target.value);
//         this.setState({ advancedValue: e.target.value })
//     };

//     onJsonChange = (e: any) => {
//         this.setState({ jsonInput: e.target.value })
//         this.props.setValue('jsonInput', e.target.value);
//     };

//     render() {

//         return (
//             <Fragment>
//                 <EuiSpacer />
//                 <EuiFlexItem>
//                     <EuiCard
//                         layout="horizontal"
//                         titleSize="xs"
//                         title={'Buckets'}
//                         description=""
//                     >
//                         <EuiAccordion id="accordion1" buttonContent={`X-Axis ${this.props.stateParams.field}`}>
//                             <EuiPanel style={{ maxWidth: '100%' }}>

//                                 <EuiFormRow label="Aggregation" fullWidth>
//                                     <EuiSelect
//                                         options={[
//                                             { value: 'histogram', text: 'Histogram' },
//                                         ]}
//                                         onChange={(e) => this.onAggregationChange(e)}
//                                         fullWidth
//                                     />
//                                 </EuiFormRow>

//                                 <EuiFormRow label="Field" fullWidth>
//                                     <EuiSelect
//                                         options={
//                                             this.state.aggregationArr
//                                         }
//                                         value={this.props.stateParams.field}
//                                         fullWidth
//                                         onChange={(e: any) => this.onFieldChange(e)
//                                         }
//                                     />
//                                 </EuiFormRow>

//                                 <EuiSpacer size="s" />

//                                 <EuiFlexItem grow={false} style={{ width: '100%' }}>
//                                     <EuiFormRow label="Minimum interval">
//                                         <EuiFieldNumber placeholder={1} min={1} onChange={(e) => this.onMinIntervalChange(e)} />
//                                     </EuiFormRow>
//                                 </EuiFlexItem>

//                                 <EuiSpacer size="s" />

//                                 <EuiFormRow label="Switch" fullWidth hasChildLabel={false}>
//                                     <EuiSwitch
//                                         label="Show empty buckets"
//                                         name="switch"
//                                         checked={this.state.isShowBucket}
//                                         onChange={this.onShowBucketChange}
//                                     />
//                                 </EuiFormRow>

//                                 <EuiSpacer size="s" />

//                                 <EuiFormRow label="Switch" fullWidth hasChildLabel={false}>
//                                     <EuiSwitch
//                                         label="Extend bounds"
//                                         name="switch"
//                                         checked={this.state.isShowBounds}
//                                         onChange={this.onShowBoundsChange}
//                                     />
//                                 </EuiFormRow>

//                                 <EuiSpacer size="s" />

//                                 <EuiFormRow label="Custom label" fullWidth onChange={(e: any) => onCustomLabelChange(e)}>
//                                     <EuiFieldText name="first" fullWidth />
//                                 </EuiFormRow>

//                                 <EuiCollapsibleNavGroup
//                                     data-test-subj="ADVANCED"
//                                     background="light"
//                                     title="Advanced"
//                                     arrowDisplay="left"
//                                     isCollapsible={true}
//                                     initialIsOpen={false}>
//                                     <EuiText style={{ display: "inline" }} onChange={(e) => onJsonChange(e)} >
//                                         <dl className="eui-definitionListReverse" style={{ display: "inline" }}>
//                                             <dt style={{ display: "inline" }}>JSON input</dt>
//                                         </dl>
//                                     </EuiText>
//                                     <EuiIconTip
//                                         aria-label="Warning"
//                                         size="m"
//                                         type="alert"
//                                         color="black"
//                                         content="Any JSON formatted properties you add here will be marged with the elasticsearch aggregation definition for this section. For example 'shard_size' on a terms aggregation."
//                                     />
//                                     <EuiText size="s" color="subdued">
//                                         <EuiTextArea
//                                             aria-label="Use aria labels when no actual label is in use"
//                                             value={this.state.advancedValue}
//                                             onChange={(e) => this.onAdvanceChange(e)}
//                                         />
//                                     </EuiText>
//                                 </EuiCollapsibleNavGroup>

//                             </EuiPanel>
//                         </EuiAccordion>

//                         <EuiSpacer size="m" />

//                         <AddSubBucket />
//                     </EuiCard>
//                 </EuiFlexItem>
//             </Fragment >
//         );
//     }
// }

// //15/08  17:30