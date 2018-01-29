import React, { Component } from 'react';
import EditDataStorage from '../lib/manage-cryptocoin-trade/EditDataStorage';
import TradeList from './TradeList';
import SelectYear from './SelectYear';
import ImportTrade from './ImportTrade';

const VIEWS = {
  TRADE_LIST  : 'trade-list',
  SELECT_YEAR : 'select-year',
  IMPORT_TRADE: 'import-trades',
}
const EDIT_DATA_STORAGE_KEY = 'TRADE_EDIT_DATA';
const DEFAULT_YEAR = '2017';

const sortTradeByDateDesc = (t1, t2) => t1['tradeDate'] < t2['tradeDate'];
const sortTradeByDateAsc = (t1, t2) => t1['tradeDate'] > t2['tradeDate'];

class EditTrades extends Component {

  constructor(props) {
    super(props);
    this.state = {
      view: VIEWS.TRADE_LIST,
      editData: null,
      year: DEFAULT_YEAR,
      success: null,
      error: null,
      tradeSorter: sortTradeByDateDesc,
      filterCondition: {
        ccy: null,
        month: null,
      },
    };
    EditDataStorage.fetchEditData(EDIT_DATA_STORAGE_KEY)
      .then((editData) => {
        if (!editData.year || !editData.trades
          || !Array.isArray(editData.trades)) {
          editData = Object.assign(editData, this.defaultData());
        }
        this.setState({
          editData: editData,
          year: editData.year,
        });
      });
  }

  defaultData() {
    return {
      year: this.state.year,
      trades: [],
    };
  }

  handleSwithView(e) {
    this.setState({
      view: e.target.name,
    });
  }

  handleSaveCloud(e) {
    // TODO:
  }

  handleLoadCloud(e) {
    // TODO:
  }

  handleClear(e) {
    e.preventDefault();
    if (window.confirm('編集中のデータをクリアしてよろしいですか？')) {
      let cleared = Object.assign(this.state.editData, this.defaultData());
      EditDataStorage.saveEditData(EDIT_DATA_STORAGE_KEY, this.state.editData)
        .then(() => {
          this.setState({
            editData: cleared,
            success: '編集中のデータを消去しました',
            view: VIEWS.TRADE_LIST,
          });
        })
        .catch((err) => {
          this.setState({error: 'データ保存に失敗しました'});
        });
     }
  }

  filterTradeList() {
    const editData = this.state.editData;
    const trades = editData.trades || [];
    const filterCondition = this.state.filterCondition;
    const filterMonth = filterCondition.month ? parseInt(filterCondition.month) : null;
    const filtered = trades.filter((t) => {
      if (filterCondition.ccy && (filterCondition.ccy !== t['baseCcy']
        && filterCondition.ccy !== t['counterCcy'])) {
          return false;
      }
      if (filterMonth && !isNaN(filterMonth)) {
        const tradeDate = new Date(t['tradeDate'])
        if (tradeDate.getMonth() + 1 !== filterMonth) {
          return false;
        }
      }
      return true;
    });
    return filtered;
  }

  handleSortByDate(e) {
    e.preventDefault();
    let sorter;
    if (e.target.name === "desc") {
      sorter = sortTradeByDateDesc;
    } else {
      sorter = sortTradeByDateAsc;
    }
    const editData = this.state.editData;
    editData.trades.sort(sorter);
    this.setState({
      editData: editData,
      tradeSorter: sorter,
    });
  }

  handleFilterChanged(e) {
    let filterCondition = this.state.filterCondition;
    if (e.target.name === 'ccy') {
      filterCondition.ccy = e.target.value;
    }
    else if (e.target.name === 'month') {
      filterCondition.month = e.target.value;
    }
    this.setState({filterCondition: filterCondition});
  }

  handleCalcProfitAndLoss(e) {
    if (window.confirm(`${this.state.year}年度の損益計算を行います。よろしいですか？`)) {
    }
  }

  onSelectYear(year) {
    const editData = this.state.editData;
    editData.year = year;
    this.setState({
      editData: editData,
      year: year,
      view: VIEWS.TRADE_LIST,
    });
  }

  onImportTrades(trades) {
    console.log(trades);
    let initial = this.state.editData.trades || [];
    let update = [...initial, ...trades];
    update.sort(this.state.tradeSorter);
    const editData = this.state.editData;
    editData.trades = update;
    this.setState({
      editData: editData,
    });
    EditDataStorage.saveEditData(EDIT_DATA_STORAGE_KEY, this.state.editData)
      .then(() => {
        this.setState({
          success: 'インポートしました',
          view: VIEWS.TRADE_LIST,
        });
      })
      .catch((err) => {
        this.setState({error: 'データ保存に失敗しました'});
      });
  }

  render() {
    if (!this.state.editData) {
      return <div>編集用の取引データを読み込み中です</div>;
    }

    const success = this.state.success;
    this.state.success = null;
    const error = this.state.error;
    this.state.error = null;
    return (
      <div>
        <div className="row">
          取引データ編集
          <select className="margin-left-10">
            <option>
            {this.state.year}年度
            </option>
          </select>
        </div>
        <div className="row">
          <button className="button float-button" name={VIEWS.TRADE_LIST} onClick={
            this.handleSwithView.bind(this)
          }>取引一覧</button>
          <button className="button float-button" name={VIEWS.IMPORT_TRADE} onClick={
            this.handleSwithView.bind(this)
          }>取引データ一括登録</button>
          <button className="button float-button" onClick={
            this.handleCalcProfitAndLoss.bind(this)
          }>損益計算</button>
          <button className="button float-button" name={VIEWS.SELECT_YEAR} onClick={
            this.handleSwithView.bind(this)
          }>年度切替え</button>
        </div>
        <div className="row">
          <button className="button-primary float-button" onClick={
            this.handleLoadCloud.bind(this)
          }>データ読込(Cloud)</button>
          <button className="button-primary float-button" onClick={
            this.handleSaveCloud.bind(this)
          }>データ保存(Cloud)</button>
          <button className="button float-button delete-button" onClick={
            this.handleClear.bind(this)
          }>編集データ消去(Local)</button>
        </div>
        {success &&
          <div className="row">
            <div className="green-text">
              {success}
            </div>
          </div>
        }
        {error &&
          <div className="row">
            <div className="red-text">
              {error}
            </div>
          </div>
        }
        {this.state.view === VIEWS.TRADE_LIST && (
          <div>
            <div className="row">
              <input className="filter-input" name="ccy" onChange={
                this.handleFilterChanged.bind(this)
              } placeholder="通貨" />
              <input className="filter-input" name="month" onChange= {
                this.handleFilterChanged.bind(this)
              } placeholder="月" />
              <button className="button float-button sort-button" name="desc" onClick={
                this.handleSortByDate.bind(this)
              }>日付降順</button>
              <button className="button float-button sort-button" name="asc" onClick={
                this.handleSortByDate.bind(this)
              }>日付昇順</button>
            </div>
            <TradeList data={this.filterTradeList(this.state.editData.trades)} />
          </div>
        )}
        {this.state.view === VIEWS.SELECT_YEAR && (
          <SelectYear onSelectYear={this.onSelectYear.bind(this)} />
        )}
        {this.state.view === VIEWS.IMPORT_TRADE && (
          <ImportTrade onImportTrades={this.onImportTrades.bind(this)} year={this.state.year} />
        )}
      </div>
    );
  }

}

export default EditTrades;

