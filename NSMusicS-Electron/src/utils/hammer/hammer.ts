import type { App, DirectiveBinding } from "vue";
import Hammer from "hammerjs";

export const vHammer = {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
        const eventType = binding.arg || "doubletap"; // 默认为双击事件
        const handler = binding.value; // 回调函数

        const mc = new Hammer(el);
        mc.on(eventType, (event) => {
            handler(event); // 触发回调
        });
    },
};

export function setupHammerDirective(app: App) {
    app.directive("hammer", vHammer);
}