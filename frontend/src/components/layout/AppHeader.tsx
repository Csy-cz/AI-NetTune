import { NavLink } from "react-router-dom";
import logoUrl from "../../assets/logo.svg";
import logoDarkUrl from "../../assets/logo-dark.svg";
import ThemeToggle from "./ThemeToggle";
import "./AppHeader.css";

const navigation = [
  { to: "/", label: "首页" },
  { to: "/workbench", label: "网络工作台" },
  { to: "/history", label: "分析记录" },
];

export default function AppHeader() {
  return (
    <header className="ain-header">
      <div className="ain-header-inner">
        <NavLink
          to="/"
          className="ain-brand"
          aria-label="NetScope 首页"
        >
          {/* 品牌图标改用用户提供的图形（三节点拓扑 + 辐射弧），与浏览器标签页 favicon 同源。
              深色主题下原图标是深藏青、落在深色页头上不可见，因此同时挂一枚浅色字形版本，
              由 CSS（theme-dark.css）切换：纯样式切换首帧即正确，且打印时自动回落到深色字形版。 */}
          <img className="ain-brand-icon ain-brand-icon--light" src={logoUrl} alt="" aria-hidden="true" />
          <img className="ain-brand-icon ain-brand-icon--dark" src={logoDarkUrl} alt="" aria-hidden="true" />

          <span>
            <strong>NetScope</strong>
            {/* 平台名称按两行展示，与左侧 NetScope 品牌共同组成完整名称。 */}
            <small>校园无线网络监测、<br />研判与优化处置平台</small>
          </span>
        </NavLink>

        <nav className="ain-nav" aria-label="主导航">
          {navigation.map(item => (
            <NavLink key={item.to} to={item.to} end>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <ThemeToggle />

        <span className="ain-header-status">
          <i aria-hidden="true" />
          智能交互 · 多维可视化
        </span>
      </div>
    </header>
  );
}
