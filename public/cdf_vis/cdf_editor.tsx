
import React, { Fragment } from 'react';

import {
  EuiCheckboxGroup,
  EuiComboBox,
  EuiFormRow,
  EuiFilePicker,
  EuiRange,
  EuiSelect,
  EuiSwitch,
  EuiPanel,
  EuiTabbedContent,
  EuiSpacer,
  EuiCard,
  EuiFlexGroup,
  EuiFlexItem,
  EuiAccordion,
  EuiButtonIcon,
  EuiFieldNumber,
  EuiTitle,
  EuiText,
  EuiIcon
} from '@elastic/eui';

import { VisEditorOptionsProps } from 'src/plugins/visualizations/public';

import { htmlIdGenerator } from '@elastic/eui/lib/services';

const idPrefix = htmlIdGenerator()();

interface CounterParams {
  counter: number;
  AxisExtents: boolean;
}

export class CDFEditor extends React.Component<VisEditorOptionsProps<CounterParams>> {
  constructor(props: any) {
    super(props);
    this.state = {
      checkboxIdToSelectedMap: { [`${idPrefix}0`]: true },
      panel_settings_cb: [
        {
          id: `${idPrefix}0`,
          label: 'X-Axis Lines',
        },
        {
          id: `${idPrefix}1`,
          label: 'Y-Axis Lines',
        }
      ],
      AxisExtents: false,
      comboBoxSelectionOptions: [],
      value: 100,
      isSwitchChecked: false,
      checkboxes: [
        {
          id: `${idPrefix}0`,
          label: 'Option one',
        },
        {
          id: `${idPrefix}1`,
          label: 'Option two is checked by default',
        },
        {
          id: `${idPrefix}2`,
          label: 'Option three',
        },
      ],
    };
  }

  onCounterChange = (ev: any) => {
    this.props.setValue('counter', parseInt(ev.target.value, 10));
  };

  onChange = (optionId: any) => {
    const newCheckboxIdToSelectedMap = {
      ...this.state.checkboxIdToSelectedMap,
      ...{
        [optionId]: !this.state.checkboxIdToSelectedMap[optionId],
      },
    };
    this.setState({ checkboxIdToSelectedMap: newCheckboxIdToSelectedMap })
  };

  onSetAxis = () => {
    this.setState(prevState => ({
      AxisExtents: !prevState.AxisExtents
    }));
  }

  onRangeChange = (e: any) => {
    this.setState({ value: e.target.value });
  };

  onSwitchChange = () => {
    this.setState(prevState => ({
      isSwitchChecked: !prevState.isSwitchChecked
    }));
  };

  onCheckboxChange = (optionId: any) => {
    const newCheckboxIdToSelectedMap = {
      ...this.state.checkboxIdToSelectedMap,
      ...{
        [optionId]: !this.state.checkboxIdToSelectedMap[optionId],
      },
    };
    this.setState({ newCheckboxIdToSelectedMap: newCheckboxIdToSelectedMap })
  };

  render() {

    let tabs = [
      {
        id: 'data',
        name: 'Data',
        content: (
          <Fragment>
            <EuiSpacer />
            <EuiPanel style={{ maxWidth: 400 }}>

              <EuiFormRow label="Select" display="rowCompressed">
                <EuiSelect
                  options={[
                    { value: 'option_one', text: 'Option one' },
                    { value: 'option_two', text: 'Option two' },
                    { value: 'option_three', text: 'Option three' },
                  ]}
                  compressed
                />
              </EuiFormRow>

              <EuiFormRow label="File picker" display="rowCompressed">
                <EuiFilePicker compressed display="default" />
              </EuiFormRow>

              <EuiFormRow label="Combobox" display="rowCompressed">
                <EuiComboBox
                  options={[
                    { label: 'Option one' },
                    { label: 'Option two' },
                    { label: 'Option three' },
                  ]}
                  compressed
                  selectedOptions={this.state.comboBoxSelectionOptions}
                  onChange={(comboBoxSelectionOptions: any) =>
                    this.setState({ comboBoxSelectionOptions: comboBoxSelectionOptions })
                  }
                />
              </EuiFormRow>

              <EuiFormRow label="Range" display="rowCompressed">
                <EuiRange
                  min={0}
                  max={100}
                  name="range"
                  id="range"
                  showInput
                  compressed
                  value={this.state.value}
                  onChange={this.onRangeChange}
                />
              </EuiFormRow>

              <EuiFormRow label="Switch" display="rowCompressed" hasChildLabel={false}>
                <EuiSwitch
                  label="Should we do this?"
                  name="switch"
                  checked={this.state.isSwitchChecked}
                  onChange={this.onSwitchChange}
                  compressed
                />
              </EuiFormRow>

              <EuiSpacer size="m" />

              <EuiCheckboxGroup
                options={this.state.checkboxes}
                idToSelectedMap={this.state.checkboxIdToSelectedMap}
                onChange={this.onCheckboxChange}
                legend={{
                  children: 'Checkboxes',
                }}
                compressed
              />
            </EuiPanel>
          </Fragment>
        ),
      },
      {
        id: 'metrix_axis',
        name: 'Metrix & Axis',
        content: (
          <Fragment>
            <EuiFlexGroup gutterSize="l">
              <EuiFlexItem>
                <EuiCard
                  textAlign="left"
                  title="X-Axis"
                  description={
                    <span>
                      <EuiSwitch label="Set Axis Extents" onChange={() => { this.onSetAxis() }} checked={this.state.AxisExtents} />
                    </span>
                  }></EuiCard>
              </EuiFlexItem>
            </EuiFlexGroup>
          </Fragment>
        ),
      },
      {
        id: 'panel_settings',
        name: 'Panel Settings',
        content: (
          <Fragment>
            <EuiFlexGroup gutterSize="l">
              <EuiFlexItem>
                <EuiCard
                  textAlign="left"
                  title="Settings"
                  description={
                    <span>
                      <EuiAccordion id="accordion1" buttonContent="Settings">
                        <EuiCheckboxGroup
                          options={this.state.panel_settings_cb}
                          idToSelectedMap={this.state.checkboxIdToSelectedMap}
                          onChange={(id) => this.onChange(id)}
                        />
                      </EuiAccordion>
                    </span>
                  }></EuiCard>
              </EuiFlexItem>
            </EuiFlexGroup>
          </Fragment>
        ),
      },
    ];

    return (
      // <EuiFormRow label="Counter">
      //   <EuiFieldNumber
      //     value={this.props.stateParams.counter}
      //     onChange={this.onCounterChange}
      //     step={1}
      //     data-test-subj="counterEditor"
      //   />
      <Fragment>
        <EuiTabbedContent
          tabs={tabs}
          initialSelectedTab={tabs[0]}
          autoFocus="selected"
          onTabClick={(tab) => {
            console.log('clicked tab', tab);
          }}
        />
      </Fragment>
      // </EuiFormRow>
    );
  }
}