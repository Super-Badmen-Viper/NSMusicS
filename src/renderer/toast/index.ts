import { defineComponent, ref } from 'vue';
import { NNotificationProvider, useNotification } from 'naive-ui';

// 定义组件
export default defineComponent({
  name: 'ToastComponent',
  setup() {
    // 使用 Naive UI 的通知提供者和钩子
    const notification = useNotification();

    // showToast 函数用于显示 toast 消息
    const showToast = (props: { type?: 'success' | 'error' | 'warning' | 'info'; message: string }) => {
      const type = props.type || 'info';
      const colorMap = {
        success: 'success',
        error: 'error',
        warning: 'warning',
        info: 'info',
      };

      notification[type]({
        title: '标题',
        content: props.message,
        duration: type === 'error' ? 5000 : 2000, // 错误消息显示时间更长
      });
    };

    // 定义不同类型消息的快捷方法
    const error = (message: string) => showToast({ type: 'error', message });
    const info = (message: string) => showToast({ type: 'info', message });
    const success = (message: string) => showToast({ type: 'success', message });
    const warning = (message: string) => showToast({ type: 'warning', message });

    // 清理通知的函数
    const clean = () => notification.closeAll();

    // 返回组件的公开方法
    return {
      showToast,
      error,
      info,
      success,
      warning,
      clean,
    };
  },
});