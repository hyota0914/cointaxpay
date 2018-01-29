import React, { Component } from 'react';

class SelectYear extends Component {
  render() {
    const list = (() => {
      const list = [];
      for (let i = 2010; i <= 2018; ++i) {
        list.push(
          <button className="button float-button" onClick={(e) => {
            e.preventDefault();
            this.props.onSelectYear(i);
          }} key={i}>
            {String(i)}
          </button>);
      }
      return list;
    })();
    return (
      <div>
        <div className="row">編集する取引履歴の年度を選択してください</div>
        {list}
      </div>
    );
  }
}

export default SelectYear;
