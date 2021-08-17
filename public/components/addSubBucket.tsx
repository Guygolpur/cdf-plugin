import React, { useState } from 'react';

import {
    EuiButtonEmpty,
    EuiFlexItem,
    EuiFlexGroup,
    EuiMutationObserver,
    EuiPanel,
    EuiSpacer,
    EuiPopover,
    EuiButtonIcon,
    EuiText,
    EuiButton,
    EuiContextMenuItem,
    EuiContextMenuPanel,
    EuiPopoverTitle
} from '@elastic/eui';

export const AddSubBucket = () => {
    const [addedXAxisItems, setAddedXAxisItems] = useState([]);
    const [addedSplitedItems, setSplitedItems] = useState([]);

    const [isAddPopoverOpen, setIsAddPopoverOpen] = useState(false)
    const closeAddPopover = () => setIsAddPopoverOpen(false);

    const addXAxisItem = () => {
        setAddedXAxisItems([...addedXAxisItems, `X-Axis Item ${addedXAxisItems.length + 1}`]);
        closeAddPopover()
    };

    const addSplitedItem = () => {
        setSplitedItems([...addedSplitedItems, `Splited Item ${addedSplitedItems.length + 1}`]);
        closeAddPopover()
    };

    const onAddBucketButtonClick = () => {
        setIsAddPopoverOpen(!isAddPopoverOpen);
    };

    const closePopover = () => {
        setIsAddPopoverOpen(false);
    };

    const chooseAction = [
        <EuiContextMenuItem key="X-Axis" onClick={addXAxisItem}>
            X-Axis
        </EuiContextMenuItem>,
        <EuiContextMenuItem key="Split-lines" onClick={addSplitedItem}>
            Split-lines
        </EuiContextMenuItem>,
    ];

    const addBucketbutton = (
        <EuiButtonEmpty
            size="s"
            iconType="plusInCircleFilled"
            iconSide="left"
            onClick={onAddBucketButtonClick}
        >
            Add
        </EuiButtonEmpty>
    );

    return (
        <div>

            <EuiSpacer />
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                <EuiMutationObserver
                    observerOptions={{ subtree: true, attributes: true, childList: true }}
                    onMutation={null}>
                    {(mutationRef) => (
                        <div ref={mutationRef}>
                            <EuiSpacer />

                            <ul>
                                {addedXAxisItems.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                            <ul>
                                {addedSplitedItems.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                            <EuiSpacer size="s" />

                            <EuiPopover
                                id="smallContextMenuExample"
                                button={addBucketbutton}
                                isOpen={isAddPopoverOpen}
                                closePopover={closePopover}
                                panelPaddingSize="none"
                                anchorPosition="downLeft">
                                <EuiPopoverTitle>ADD SUB-BUCKET</EuiPopoverTitle>
                                <EuiContextMenuPanel size="m" items={chooseAction} />
                            </EuiPopover>
                        </div>
                    )}
                </EuiMutationObserver>
            </span>

        </div>
    );
};