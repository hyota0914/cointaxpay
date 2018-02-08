import React, { Component } from 'react';
import formatDate from '../lib/format-date';

class TradeList extends Component {

  renderTradeList() {
    const tradeList = this.props.data.map((trade, index) => {
      // 取引日付
      // 売/買
      // 主軸通貨
      // 決済通貨
      // 価格
      // 数量
      // 合計
      // 手数料
      // 手数料通貨
      // ボーナス
      // ボーナス通貨
      // 取引所
      // 損益
      // 取引後残高
      // 取引後平均原価
      let key = 0;
      let detail = [
        <td key={key++} className="date-text">{formatDate(new Date(trade['tradeDate']), 'YYYY/MM/DD hh:mm:ss')}</td>,
        <td key={key++}>{trade.side === "B" ?
          <span className="red-text">BUY</span> :
          <span className="green-text">SELL</span>
        }</td>,
        <td key={key++}>{trade.baseCcy}</td>,
        <td key={key++}>{trade.counterCcy}</td>,
        <td key={key++} className="number-text">{trade.price}</td>,
        <td key={key++} className="number-text">{trade.amount}</td>,
        <td key={key++} className="number-text">{trade.total}</td>,
        <td key={key++} className="number-text">{trade.fee}</td>,
        <td key={key++}>{trade.feeCcy}</td>,
        <td key={key++} className="number-text">{trade.bonus}</td>,
        <td key={key++}>{trade.bonusCcy}</td>,
        <td key={key++}>{trade.ex}</td>,
      ];

      if (trade.pl && trade.pl.balanceAfter) {
        detail = [detail, ...[
          <td key={key++} className={
            trade.pl.pl === 0 ? "number-text" : trade.pl.pl > 0 ? "red-text number-text" : "green-text number-text" 
          }>{trade.pl.pl > 0 && "+"}{trade.pl.pl}</td>,
          <td key={key++} className="number-text">{trade.pl.balanceAfter.baseCcy.amount}</td>,
          <td key={key++} className="number-text">{trade.pl.balanceAfter.baseCcy.priceJ}</td>,
        ]];
      } else {
        detail = [detail, ...[
          <td key={key++}></td>,
          <td key={key++}></td>,
          <td key={key++}></td>,
        ]];
      }
      
      if (this.props.type === "pl-detail") {
        if (trade.pl && trade.pl.balanceAfter) {
          // 取引前残高
          // 取引前平均原価
          // 取引後残高(決済側)
          // 取引後平均原価(決済側)
          // 取引前残高(決済側)
          // 取引前平均原価(決済側)
          // 売却通貨レート(円換算)
          let className = "number-text number-text";
          detail = [detail, ...[
            <td key={key++} className={className}>{trade.pl.balanceBefore.baseCcy.amount}</td>,
            <td key={key++} className={className}>{trade.pl.balanceBefore.baseCcy.priceJ}</td>,
            <td key={key++} className={className}>{trade.pl.balanceAfter.counterCcy.amount}</td>,
            <td key={key++} className={className}>{trade.pl.balanceAfter.counterCcy.priceJ}</td>,
            <td key={key++} className={className}>{trade.pl.balanceBefore.counterCcy.amount}</td>,
            <td key={key++} className={className}>{trade.pl.balanceBefore.counterCcy.priceJ}</td>,
            <td key={key++} className={className}>{trade.pl.rate}</td>,
          ]];
        } else {
          detail = [detail, ...[
            <td key={key++}></td>,
            <td key={key++}></td>,
            <td key={key++}></td>,
            <td key={key++}></td>,
            <td key={key++}></td>,
            <td key={key++}></td>,
            <td key={key++}></td>,
          ]];
        }
      }

      return (
        <tr key={index}>
          {detail}
        </tr>);
    });

    let key = 0;
    let columns = [
      <th key={key++}>取引日付</th>,
      <th key={key++}>売/買</th>,
      <th key={key++}>主軸通貨</th>,
      <th key={key++}>決済通貨</th>,
      <th key={key++}>価格</th>,
      <th key={key++}>数量</th>,
      <th key={key++}>合計</th>,
      <th key={key++}>手数料</th>,
      <th key={key++}>手数料通貨</th>,
      <th key={key++}>ボーナス</th>,
      <th key={key++}>ボーナス通貨</th>,
      <th key={key++}>取引所</th>,
      <th key={key++}>損益</th>,
      <th key={key++}>取引後残高</th>,
      <th key={key++}>取引後平均原価</th>,
    ];

    if (this.props.type === 'pl-detail') {
      columns = [columns, ...[
        <th key={key++}>取引前残高</th>,
        <th key={key++}>取引前平均原価</th>,
        <th key={key++}>取引後残高(決済側)</th>,
        <th key={key++}>取引後平均原価(決済側)</th>,
        <th key={key++}>取引前残高(決済側)</th>,
        <th key={key++}>取引前平均原価(決済側)</th>,
        <th key={key++}>売却通貨レート(円換算)</th>,
      ]];
    }

    return (
      <div className="overflow-table">
        <table className="u-full-width blueTable">
          <thead>
           <tr>
            {columns}
           </tr>
          </thead>
          <tbody>
           {tradeList}
          </tbody>
         </table>
      </div>
    );
  }

  render() {
    if (!this.props.data || this.props.data.length === 0) {
      return (
        <div>
          取引が登録されていません
        </div>
      );
    }
    return this.renderTradeList();
  }
}

export default TradeList;
