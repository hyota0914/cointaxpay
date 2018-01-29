import React, { Component } from 'react';

class SelectExchange extends Component {
  render() {
    const list = this.props.exchanges.map((v, k) => (
      <button className="button float-button" onClick={(e) => {
        e.preventDefault();
        this.props.onSelectExchange(v);
      }} key={k} >
        {v}
      </button>
    ));
    return (
      <div>
        <div className="row">アップロードする取引履歴の取引所を選択してください</div>
        {list}
      </div>
    );
  }
}

export default SelectExchange;
