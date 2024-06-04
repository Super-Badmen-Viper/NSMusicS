import { ref } from 'vue';
import type { NotificationProps as MantineNotificationProps } from '@mantine/notifications';
import {
    showNotification,
    updateNotification,
    hideNotification,
    cleanNotifications,
    cleanNotificationsQueue,
} from '@mantine/notifications';

interface NotificationProps extends MantineNotificationProps {
    type?: 'success' | 'error' | 'warning' | 'info';
}

const showToast = (props: NotificationProps) => {
    // 由于颜色和样式处理依赖于Mantine的实现，这里需要根据实际情况调整
    const color = ref('var(--primary-color)');
    const defaultTitle = ref('Info');
    const defaultDuration = ref(2000);

    switch (props.type) {
        case 'success':
            color.value = 'var(--success-color)';
            defaultTitle.value = 'Success';
            break;
        case 'warning':
            color.value = 'var(--warning-color)';
            defaultTitle.value = 'Warning';
            break;
        case 'error':
            color.value = 'var(--danger-color)';
            defaultDuration.value = 5000;
            defaultTitle.value = 'Error';
            break;
        case 'info':
            color.value = 'var(--primary-color)';
            defaultTitle.value = 'Info';
            break;
        default:
            break;
    }

    showNotification({
        autoClose: defaultDuration.value,
        // 需要根据Mantine的实际API调整样式对象
        styles: () => ({
            root: {
                '&::before': { backgroundColor: color.value },
            },
        }),
        title: defaultTitle.value,
        ...props,
    });
};

const toast = {
    clean: cleanNotifications,
    cleanQueue: cleanNotificationsQueue,
    error: (props: NotificationProps) => showToast({ type: 'error', ...props }),
    hide: hideNotification,
    info: (props: NotificationProps) => showToast({ type: 'info', ...props }),
    show: showToast,
    success: (props: NotificationProps) => showToast({ type: 'success', ...props }),
    update: updateNotification,
    warn: (props: NotificationProps) => showToast({ type: 'warning', ...props }),
};