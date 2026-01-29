import DefaultTheme from "vitepress/theme";
import { useRoute } from "vitepress";
import imageViewer from "vitepress-plugin-image-viewer";
import "viewerjs/dist/viewer.min.css";
import './custom.css'
// 图片缩放
export default {
    ...DefaultTheme,
    setup() {
        // 获取路由
        const route = useRoute();
        // 使用
        imageViewer(route);
    },
};
