import "./ReplayControls.css";

/* 提问说明：只保留三条选择方式的要点与未来提问的核心约束，
   详细方法、适用边界统一以「预测预警」弹窗内的说明为准，避免长段落堆在面板里。 */
export default function TimeSelectionGuide({ historical }: { historical: boolean }) {
  return <div className="ain-time-guide" aria-label="分析时间选择说明">
    <div className="ain-time-guide-methods">
      <div><strong>分析当前</strong><p>先点“固定当前时刻”再提问，参考范围决定往前看多久。</p></div>
      <div><strong>直接问历史</strong><p>输入“分析01-01 14:00到15:00”，发送时自动固定起止。</p></div>
      <div><strong><a href="#ain-data-module">手动选历史 ↓</a></strong><p>在数据区拖双滑块选择起止时间，再提问。</p></div>
    </div>
    <p className="ain-time-guide-note">固定时刻不会暂停主时钟；明确写出起止时间时按你给的时间分析，其余按已选参考范围。</p>
    <div className="ain-time-guide-future">
      <p className="ain-time-guide-future-title">未来时刻／时间段怎么问</p>
      <div className="ain-time-guide-future-methods">
        <div><strong>预测未来时刻</strong><p>例如“预测30分钟后的网络状态，哪些AP可能异常？”</p></div>
        <div><strong>预测未来时段</strong><p>例如“预测未来30分钟的网络风险，说明时间及预防建议。”</p></div>
      </div>
      <p id="ain-forecast-pending">{historical ? "历史回顾期间不提供未来预测，需要预测请先返回当前。" : "提问未来会打开「预测预警」弹窗，以当前时刻为基准，只用基准及以前的数据；方法与适用范围以弹窗说明为准。"}</p>
    </div>
  </div>;
}
