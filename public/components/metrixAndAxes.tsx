import React from 'react';
import {
    EuiFlexItem,
    EuiSpacer,
    EuiFormRow,
    EuiFieldNumber,
    EuiSwitch,
    EuiFlexGroup,
    EuiCard
} from '@elastic/eui';

export const MetrixAndAxes = ({
    onGeneralValChange, onGeneralBoolValChange,
    isAxisExtents, xMin, xMax }: any
) => {
    return (
        <EuiFlexGroup gutterSize="l">
            <EuiFlexItem>
                <EuiCard
                    textAlign="left"
                    title="X-Axis"
                    description={
                        <span>
                            <EuiSwitch label="Set Axis Extents" onChange={() => { onGeneralBoolValChange('isAxisExtents') }} checked={isAxisExtents} />
                        </span>
                    }>
                    {isAxisExtents ?
                        <span>
                            <EuiFlexItem grow={false} style={{ width: '100%' }}>
                                <EuiFormRow label="Min">
                                    <EuiFieldNumber value={xMin} min={0} onChange={(e) => onGeneralValChange(e, 'xMin')} />
                                </EuiFormRow>
                            </EuiFlexItem>

                            <EuiSpacer size="s" />
                            <EuiFlexItem grow={false} style={{ width: '100%' }}>
                                <EuiFormRow label="Max">
                                    <EuiFieldNumber value={xMax} min={0} onChange={(e) => onGeneralValChange(e, 'xMax')} />
                                </EuiFormRow>
                            </EuiFlexItem>
                            <EuiSpacer size="s" />
                        </span>
                        :
                        null}
                </EuiCard>
            </EuiFlexItem>
        </EuiFlexGroup>
    );
};
