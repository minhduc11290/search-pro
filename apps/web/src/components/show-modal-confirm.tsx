import { modals } from '@mantine/modals';
import { Text } from '@mantine/core';
import { ConfirmDialogProps } from '../@types/confirm-dialog-props';

const openModal = ({ title, content, onClose, onOk }: ConfirmDialogProps) => modals.openConfirmModal({
    title: title,
    children: (
        <Text size="sm">
            {content}
        </Text>
    ),
    labels: { confirm: 'Yes', cancel: 'Cancel' },
    onCancel: () => {
        onClose;
    },
    onConfirm: () => onOk,
});
export {
    openModal
}