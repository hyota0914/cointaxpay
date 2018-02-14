import React, { Component } from 'react';
import formatDate from '../lib/format-date';

class PlTotal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sort: "desc",
    };
    this.sortData("desc");
  }

  sortData(order) {
    if (!this.props.data || !this.props.data.history) {
      return;
    }
    if (order === "desc") {
      this.props.data.history.sort((a, b) => (
        a.date.getTime() > b.date.getTime() ? -1 : 1
      ));
    } else {
      this.props.data.history.sort((a, b) => (
        a.date.getTime() < b.date.getTime() ? -1 : 1
      ));
    }
  }

  handleSortByDate(e) {
    e.preventDefault();
    this.setState({sort: e.target.name});
    this.sortData(e.target.name);
  }

  renderPl() {
    const plList = this.props.data.history.map((row, index) => (
      <tr key={index}>
        <td>
          {formatDate(row.date, 'YYYY/MM/DD')}
        </td>
        {row.pl === 0 ?
          <td className="number-text">{row.pl}</td> : row.pl > 0 ?
          <td className="red-text number-text">+{row.pl}</td> :
          <td className="green-text number-text">{row.pl}</td>
        }
        {row.total === 0 ?
          <td className="number-text">{row.total}</td> : row.total > 0 ?
          <td className="red-text number-text">+{row.total}</td> :
          <td className="green-text number-text">{row.total}</td>
        }
      </tr>
    ));
    return (
      <div>
        <div className="row">
          <button className="button float-button sort-button" name="desc" onClick={
            this.handleSortByDate.bind(this)
          }>日付降順</button>
          <button className="button float-button sort-button" name="asc" onClick={
            this.handleSortByDate.bind(this)
          }>日付昇順</button>
        </div>
        <div className="horizontal-spacer-opaque"></div>
        <div className="overflow-table">
          <table className="u-full-width blueTable">
            <thead>
             <tr>
               <th>日付</th>
               <th>損益(円)</th>
               <th>累計損益(円)</th>
             </tr>
            </thead>
            <tbody>
             {plList}
            </tbody>
           </table>
        </div>
      </div>
    );
  }

  render() {
    if (!this.props.data || !this.props.data.history) {
      return (
        <div>
        データがありません。損益計算を先に実行してください。
        </div>
      );
    }
    return this.renderPl();
  }
}

export default PlTotal;
