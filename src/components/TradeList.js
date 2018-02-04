import React, { Component } from 'react';
import formatDate from '../lib/format-date';

class TradeList extends Component {

  renderTradeList() {
    const tradeList = this.props.data.map((trade, index) => {
      let detail = [];
      let key = 0;
      if (this.props.type === "pl-detail") {
        let className = "number-text number-text";
        detail.push(trade.baseBeforeBalance ?
          <td key={++key} className={className}>{
            trade.baseBeforeBalance.amount}</td> :
          <td key={++key} className={className}></td>
        );
        detail.push(trade.baseBeforeBalance ?
          <td key={++key} className={className}>{
            trade.baseBeforeBalance.priceJpy}</td> :
          <td key={++key} className={className}></td>
        );
        detail.push(trade.counterAfterBalance ?
          <td key={++key} className={className}>{
            trade.counterAfterBalance.amount}</td> :
          <td key={++key} className={className}></td>
        );
        detail.push(trade.counterAfterBalance ?
          <td key={++key} className={className}>{
            trade.counterAfterBalance.priceJpy}</td> :
          <td key={++key} className={className}></td>
        );
        detail.push(trade.counterBeforeBalance ?
          <td key={++key} className={className}>{
            trade.counterBeforeBalance.amount}</td> :
          <td key={++key} className={className}></td>
        );
        detail.push(trade.counterBeforeBalance ?
          <td key={++key} className={className}>{
            trade.counterBeforeBalance.priceJpy}</td> :
          <td key={++key} className={className}></td>
        );
        detail.push(
          <td key={++key} className={className}>{
            trade.counterCcyMarketPrice
          }</td>
        );
      }

      return (
        <tr key={index}>
          <td className="date-text">{formatDate(new Date(trade['tradeDate']), 'YYYY/MM/DD hh:mm:ss')}</td>
          <td>{trade.side === "B" ?
            <span className="red-text">BUY</span> :
            <span className="green-text">SELL</span>
          }</td>
          <td>{trade.baseCcy}</td>
          <td>{trade.counterCcy}</td>
          <td className="number-text">{trade.price}</td>
          <td className="number-text">{trade.amount}</td>
          <td className="number-text">{trade.total}</td>
          <td>{trade.ex}</td>
          {Number(trade.pl) === 0 ?
            <td className="number-text">{trade.pl}</td> : trade.pl < 0 ?
            <td className="red-text number-text">{trade.pl}</td> :
            <td className="green-text number-text">{trade.pl}</td>
          }
          {trade.baseAfterBalance ?
            <td className="number-text">{trade.baseAfterBalance.amount}</td> :
            <td className="number-text"></td>
          }
          {trade.baseAfterBalance ?
            <td className="number-text">{trade.baseAfterBalance.priceJpy}</td> :
            <td className="number-text"></td>
          }
          {detail}
        </tr>);
    });
    return (
      <div className="overflow-table">
        <table className="u-full-width blueTable">
          <thead>
           <tr>
             <th>取引日付</th>
             <th>売/買</th>
             <th>主軸通貨</th>
             <th>決済通貨</th>
             <th>価格</th>
             <th>数量</th>
             <th>合計</th>
             <th>取引所</th>
             <th>損益</th>
             <th>取引後残高</th>
             <th>取引後平均原価</th>
             {this.props.type === "pl-detail" &&
               <th>取引前残高</th>
             }
             {this.props.type === "pl-detail" &&
               <th>取引前平均単価</th>
             }
             {this.props.type === "pl-detail" &&
               <th>取引後残高(決済側)</th>
             }
             {this.props.type === "pl-detail" &&
               <th>取引後平均単価(決済側)</th>
             }
             {this.props.type === "pl-detail" &&
               <th>取引前残高(決済側)</th>
             }
             {this.props.type === "pl-detail" &&
               <th>取引前平均単価(決済側)</th>
             }
             {this.props.type === "pl-detail" &&
               <th>決済通貨単価(円)</th>
             }
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
