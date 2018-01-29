import React, { Component } from 'react';
import formatDate from '../lib/format-date';

class TradeList extends Component {

  renderTradeList() {
    const tradeList = this.props.data.map((trade, index) => {
      return (
        <tr key={index}>
          <td>{formatDate(new Date(trade['tradeDate']), 'YYYY/MM/DD hh:mm:ss')}</td>
          <td>{trade['side'] === "B" ?
            <span className="red-text">BUY</span> :
            <span className="green-text">SELL</span>
          }</td>
          <td>{trade['baseCcy']}</td>
          <td>{trade['counterCcy']}</td>
          <td>{trade['price']}</td>
          <td>{trade['amount']}</td>
          <td>{trade['total']}</td>
        </tr>);
    });
    return (
      <div className="container">
        <table className="u-full-width">
          <thead>
           <tr>
             <th>取引日付</th>
             <th>売/買</th>
             <th>主軸通貨</th>
             <th>決済通貨</th>
             <th>価格</th>
             <th>数量</th>
             <th>合計</th>
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
