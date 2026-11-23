import { useMemo } from "react";
import { renderScene } from "./scene";
import type { SceneKey } from "./scene";

/**
 * 首页首屏的等距城市场景。
 *
 * 城市由 scene.js 程序化生成一段 SVG 字符串（楼宇、道路、AP/UE 链路都在里面），
 * 这里只负责挂载：key={scene} 会让 React 在切换场景时重建节点，
 * 从而重新播放 HomePage.css 里的 .scene-base / .spr 入场动画。
 */
export default function HomeScene({ scene, fast }: { scene: SceneKey; fast: boolean }) {
  const markup = useMemo(() => {
    try {
      return renderScene(scene);
    } catch (error) {
      // 场景只是首屏装饰：生成失败时保留文案与按钮，不让整个首页白屏。
      console.error("首页场景渲染失败，已降级为空场景。", error);
      return "";
    }
  }, [scene]);

  return (
    <div className="hp-hero-scene" aria-hidden="true">
      <svg
        key={scene}
        id="sceneSvg"
        className={fast ? "is-fast" : undefined}
        viewBox="20 30 1020 800"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="等距智能城市与基站、终端连接示意"
      >
        {/* 内容是本地生成器产出的静态 SVG 字符串，来源不受外部输入影响。 */}
        <g dangerouslySetInnerHTML={{ __html: markup }} />
      </svg>
    </div>
  );
}
