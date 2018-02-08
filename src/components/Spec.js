import React from 'react';

const Spec = () => {
  return (
    <div className="container">
      <div>
        <div className="landing-header">
          <h1>計算ロジック</h1>
        </div>
        <div className="u-full-width">
          原価計算方法を下記に示します。
        </div>
        <div className="row landing-spacer"></div>
        <div className="row">
          <div className="landing-topic-header">
            <h2>取得単価の計算</h2>
          </div>
          <div className="u-full-width">
            購入時に総平均法にて単価を計算します。売却時は単価を変更しません。
          </div>
        </div>
        <div className="row landing-spacer"></div>
        <div className="row">
          <div className="landing-topic-header">
            <h2>仮想通貨同士の売買</h2>
          </div>
          <div className="u-full-width">
            支払った方の仮想通貨について、当日の時価から損益を算出します。その際に使用する時価は、コインチェックが公開している日別の終値を利用します。
          </div>
        </div>
        <div className="row landing-spacer"></div>
        <div className="row">
          <div className="landing-topic-header">
            <h2>対応期間</h2>
          </div>
          <div className="u-full-width">
            現時点では2017年1月〜2017年12月のみ損益算出が可能です。
          </div>
        </div>
        <div className="row landing-spacer"></div>
        <div className="row">
          <div className="landing-topic-header">
            <h2>端数処理</h2>
          </div>
          <div className="u-full-width">
            損益(円)は小数点以下を切り捨てします。
          </div>
        </div>
      </div>
    </div>
  );
}

export default Spec;
