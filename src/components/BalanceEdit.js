import React, { Component } from 'react';

class BalanceEdit extends Component {

  constructor(props) {
    super(props);
    this.state = {
      balance: this.props.data || [],
      error: "",
    };
  }

  handleUpdate(e) {
    let [ccy, attr] = e.target.name.split("-");
    let balance = this.state.balance;
    balance = balance.map(r => {
      if (r.ccy === ccy) {
        r[attr] = Number(e.target.value);
      }
      return r;
    });
    this.setState({
      balance: balance,
      error: "",
    });
  }

  handleAddRow(e) {
    e.preventDefault();
    let ccy = window.prompt("通貨を入力してください。");
    if (!ccy || !ccy.trim().length) {
      this.setState({error: '通貨が空白です'});
      return;
    }
    ccy = ccy.trim().toUpperCase();
    let row = this.state.balance.filter((r) => r.ccy === ccy);
    if (row && row.length > 0) {
      this.setState({error: 'すでに行が存在します'});
      return;
    }
    let balance = this.state.balance;
    balance.push({
      ccy: ccy,
      amount: 0,
      priceJ: 0,
    });
    this.setState({balance: balance});
  }

  handleSave(e) {
    e.preventDefault();
    this.props.onEditBalance(this.state.balance);
  }

  handleDeleteRow(e) {
    e.preventDefault();
    let balance = this.state.balance;
    balance = balance.filter((r) => r.ccy !== e.target.name);
    this.setState({balance: balance});
  }

  renderBalance() {
    const balances = this.state.balance.map((row, index) => (
      <tr key={index}>
        <td>{row.ccy}</td>
        <td className="number-text">{Math.floor(row.amount * row.priceJ)}</td>
        <td><input type="text" defaultValue={row.amount} name={row.ccy+"-amount"} onChange={this.handleUpdate.bind(this)} /></td>
        <td><input type="text" defaultValue={row.priceJ} name={row.ccy+"-priceJ"} onChange={this.handleUpdate.bind(this)} /></td>
        <td>
          <button className="button" name={row.ccy} onClick={
            this.handleDeleteRow.bind(this)
          }>行削除</button>
        </td>
      </tr>
    ));
    return (
      <div>
        <div className="row">
          {this.props.year}/1/1時点
          <button className="button-primary flat-button u-pull-right" onClick={
            this.handleSave.bind(this)
          }>保存</button>
          <button className="button-primary flat-button u-pull-right" onClick={
            this.handleAddRow.bind(this)
          }>行追加</button>
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
               <th>行削除</th>
             </tr>
            </thead>
            <tbody>
             {balances}
            </tbody>
           </table>
        </div>
        <div className="row">
          <button className="button-primary flat-button u-pull-right" onClick={
            this.handleSave.bind(this)
          }>保存</button>
          <button className="button-primary flat-button u-pull-right" onClick={
            this.handleAddRow.bind(this)
          }>行追加</button>
        </div>
        {this.state.error &&
          <div className="row">
            <div className="red-text">
              {this.state.error}
            </div>
          </div>
        }
        <div className="horizontal-spacer-bottom"></div>
        <div className="horizontal-spacer-bottom"></div>
      </div>
    );
  }

  render() {
    return this.renderBalance();
  }
}

export default BalanceEdit;
