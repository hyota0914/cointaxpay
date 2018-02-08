import React, { Component } from 'react';
import formatDate from '../lib/format-date';

class Balance extends Component {

  renderBalance() {
    this.props.data.sort((a, b) => {
      return a.amount*a.priceJ > b.amount*b.priceJ ? -1 : 1;
    });
    const balances = this.props.data.map((row, index) => (
      <tr key={index}>
        <td> {row.ccy} </td>
        <td className="number-text">{Math.floor(row.amount * row.priceJ)}</td>
        <td className="number-text">{row.amount}</td>
        <td className="number-text">{row.priceJ}</td>
      </tr>
    ));
    return (
      <div>
        <div className="row">
          {this.props.year}/12/31時点
        </div>
        <div className="horizontal-spacer-opaque"></div>
        <div className="overflow-table">
          <table className="u-full-width blueTable">
            <thead>
             <tr>
               <th>通貨</th>
               <th>残高(円)</th>
               <th>残高</th>
               <th>平均原価(円)</th>
             </tr>
            </thead>
            <tbody>
             {balances}
            </tbody>
           </table>
        </div>
        <div className="horizontal-spacer-bottom"></div>
      </div>
    );
  }

  render() {
    if (!this.props.data || !this.props.data.length) {
      return (
        <div>
        データがありません。損益計算を先に実行してください。
        </div>
      );
    }
    return this.renderBalance();
  }
}

export default Balance;
