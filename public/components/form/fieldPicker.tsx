import React, { useEffect, Fragment, useState } from 'react';

import {
    EuiFormRow,
    EuiSelect,
} from '@elastic/eui';

interface FieldPickerComponentProps {
    label: string;
    fullWidth: boolean;
    options: any[],
    value: string;
    onFieldChange(e: any): any;
}

export function FieldPicker(props: FieldPickerComponentProps) {
    return (
        <Fragment>
            <EuiFormRow label={props.label} fullWidth={props.fullWidth} >
                <EuiSelect
                    options={
                        props.options
                    }
                    value={props.value}
                    fullWidth={props.fullWidth}
                    onChange={(e) => props.onFieldChange(e)
                    }
                />
            </EuiFormRow>
        </Fragment>
    )
}
