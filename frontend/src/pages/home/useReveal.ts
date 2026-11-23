import { useEffect } from "react";

/**
 * 首页入场：元素进入视口后加 .in 类，交给 HomePage.css 播放轻量上浮。
 *
 * 只处理首页容器内的 [data-reveal]；减少动效或浏览器不支持
 * IntersectionObserver 时直接全部显示，避免内容停在 opacity:0。
 */
export default function useReveal() {
  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>(".ain-home [data-reveal]"));
    if (items.length === 0) return;

    const showAll = () => items.forEach(el => el.classList.add("in"));
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    if (reduceMotion || typeof IntersectionObserver === "undefined") {
      showAll();
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -40px 0px", threshold: 0.05 },
    );

    items.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}
