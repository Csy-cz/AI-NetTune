/**
 * 场景生成器（scene.js）的类型声明。
 *
 * scene.js 是设计稿里的原文件：纯字符串生成 SVG，不依赖 DOM，
 * 只把最外层的 IIFE/window 挂载换成了 ESM 导出。这里补上最小类型，
 * 让首页组件有场景键与 caption 的类型提示；生成逻辑本身不参与 TS 检查。
 */
export type SceneKey = "campus" | "mall" | "traffic" | "park";

export declare const SCENE_META: Record<SceneKey, { caption: string }>;

export declare function renderScene(key: SceneKey): string;
