import React, { Component } from 'react';
import EditDataStorage from '../lib/manage-edit-data/EditDataStorage';
import TradeList from './TradeList';
import SelectYear from './SelectYear';
import ImportTrade from './ImportTrade';
import calcProfitAndLoss from '../lib/calc-profit-and-loss/CalcProfitAndLoss';

const VIEWS = {
  TRADE_LIST: 'trade-list',
  SELECT_YEAR: 'select-year',
  IMPORT_TRADE: 'import-trades',
  PL_DETAIL: 'pl-detail',
}
const EDIT_DATA_STORAGE_KEY = 'TRADE_EDIT_DATA';
const DEFAULT_YEAR = '2017';
const COUNT_PER_PAGE = 30;

const sortTradeByDateDesc = (t1, t2) => { 
  const d1 = Date.parse(t1.tradeDate);
  const d2 = Date.parse(t2.tradeDate);
  if (d1 !== d2) {
    return d1>d2 ? -1 : 1;
  }
  const id1 = Number(t1.rowId);
  const id2 = Number(t2.rowId);
  return id1>id2 ? -1 : id1<id2 ? 1: 0;
};

const sortTradeByDateAsc = (t1, t2) => {
  const d1 = Date.parse(t1.tradeDate);
  const d2 = Date.parse(t2.tradeDate);
  if (d1 !== d2) {
    return d1<d2 ? -1 : 1;
  }
  const id1 = Number(t1.rowId);
  const id2 = Number(t2.rowId);
  return id1<id2 ? -1 : id1>id2 ? 1: 0;
};

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
      page: 0,
      filterCondition: {
        ccy: null,
        month: null,
        exchange: null,
      },
    };
    EditDataStorage.fetchEditData(EDIT_DATA_STORAGE_KEY)
      .then((editData) => {
        if (!editData.year || !editData.trades
          || !Array.isArray(editData.trades)) {
          editData = Object.assign(editData, this.defaultData());
        }
        editData.trades.sort(this.state.tradeSorter);
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
    const filterMonth = filterCondition.month ? parseInt(filterCondition.month, 10) : null;
    let exchangeReg;
    const filterCcy = filterCondition.ccy ? filterCondition.ccy.toUpperCase() : null;
    if (filterCondition.exchange) {
      exchangeReg = new RegExp(filterCondition.exchange.toUpperCase());
    }
    const filtered = trades.filter((t) => {
      if (filterCondition.ccy && (filterCcy !== t['baseCcy']
        && filterCcy !== t['counterCcy'])) {
          return false;
      }
      if (filterMonth && !isNaN(filterMonth)) {
        const tradeDate = new Date(t['tradeDate'])
        if (tradeDate.getMonth() + 1 !== filterMonth) {
          return false;
        }
      }
      if (filterCondition.exchange
        && !t['ex'].toUpperCase().match(exchangeReg)) {
          return false;
      }
      return true;
    });
    filtered.sort(this.state.tradeSorter);
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
    this.setState({tradeSorter: sorter});
  }

  handleFilterChanged(e) {
    let filterCondition = this.state.filterCondition;
    if (e.target.name === 'ccy') {
      filterCondition.ccy = e.target.value;
    }
    else if (e.target.name === 'month') {
      filterCondition.month = e.target.value;
    }
    else if (e.target.name === 'exchange') {
      filterCondition.exchange = e.target.value;
    }
    this.setState({filterCondition: filterCondition});
  }

  handleCalcProfitAndLoss(e) {
    if (window.confirm(`${this.state.year}年度の損益計算を行います。よろしいですか？`)) {
      try {
        let [tradesNew, balanceNew, totalProfitAndLoss] = calcProfitAndLoss(this.state.editData.trades, []);
        const editData = this.state.editData;
        editData.trades = tradesNew;
        EditDataStorage.saveEditData(EDIT_DATA_STORAGE_KEY, this.state.editData)
          .then(() => {
            this.setState({
              editData: editData,
              success: '計算完了しました。',
            });
          })
          .catch((err) => {
            this.setState({error: 'データ保存に失敗しました。:' + err.message});
          });
        console.log(this.state.editData.trades);
        console.log(balanceNew);
        console.log(totalProfitAndLoss);
      } catch (e) {
        this.setState({error: 'エラーが発生しました。:' + e.message});
        console.log(e);
      }
    }
  }

  handleSwitchPage(e) {
    e.preventDefault();
    this.setState({page: Number(e.target.name)});
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
    let initial = this.state.editData.trades || [];
    let maxId = initial.reduce((current, t) => (
      t.rowId > current ? t.rowId : current
    ), 0);
    const synonymCcy = [
      ['BCC', 'BCH'],
      ['NEM', 'XEM'],
    ];
    trades = trades.map((t) => {
      t.rowId = ++maxId;
      synonymCcy.forEach((s) => {
        if (t.baseCcy === s[0]) {
          t.baseCcy = s[1];
        }
        if (t.counterCcy === s[0]) {
          t.counterCcy = s[1];
        }
      });
      return t;
    });
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

  returnPagingComponentAndTrade() {
    let trades = this.filterTradeList(this.state.editData.trades);
    let maxPage = Math.trunc(trades.length / COUNT_PER_PAGE);
    this.state.page = Math.min(maxPage, this.state.page);
    trades = trades.slice(this.state.page * COUNT_PER_PAGE, 
      this.state.page * COUNT_PER_PAGE + COUNT_PER_PAGE);
    let start = Math.max(this.state.page - 3, 0);
    let end = Math.min(start + 6, maxPage);
    start = Math.max(end - 6, 0);
    let pages = [];
    pages.push(<button className="button float-button paging-button" key="s" name="0" onClick={
        this.handleSwitchPage.bind(this)
      }>&lt;&lt;</button>
    );
    for (let i = start; i <= end; ++i) {
      pages.push(i === this.state.page ? 
        <button className="button float-button paging-button paging-button-current" key={i} name={i} disabled>{i+1}</button>
        :
        <button className="button float-button paging-button" key={i} name={i} onClick={
          this.handleSwitchPage.bind(this)
        }>{i+1}</button>
      );
    }
    pages.push(<button className="button float-button paging-button" key="e" name={maxPage} onClick={
        this.handleSwitchPage.bind(this)
      }>&gt;&gt;</button>
    );
    return [trades, pages];
  }

  render() {
    if (!this.state.editData) {
      return <div>取引データを読み込み中です</div>;
    }
    let trades;
    let pages;
    if (this.state.view === VIEWS.TRADE_LIST || this.state.view === VIEWS.PL_DETAIL) {
      [trades, pages] = this.returnPagingComponentAndTrade();
    }
    const success = this.state.success;
    this.state.success = null;
    const error = this.state.error;
    this.state.error = null;
    return (
      <div className="container">
        <div className="row">
          取引データ編集
          <select className="margin-left-10">
            <option>
            {this.state.year}年度
            </option>
          </select>
        </div>
        <div className="row">
          <button className="button-important float-button" name={VIEWS.IMPORT_TRADE} onClick={
            this.handleSwithView.bind(this)
          }>取引データ一括登録</button>
          <button className="button float-button" name={VIEWS.TRADE_LIST} onClick={
            this.handleSwithView.bind(this)
          }>取引一覧</button>
          <button className="button float-button" onClick={
            this.handleCalcProfitAndLoss.bind(this)
          }>損益計算</button>
          <button className="button float-button" name={VIEWS.PL_DETAIL} onClick={
            this.handleSwithView.bind(this)
          }>損益詳細</button>
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
        {(this.state.view === VIEWS.TRADE_LIST || this.state.view === VIEWS.PL_DETAIL) && (
          <div>
            <div className="row">
              <input className="filter-input" name="ccy" onChange={
                this.handleFilterChanged.bind(this)
              } placeholder="通貨" />
              <input className="filter-input" name="month" onChange= {
                this.handleFilterChanged.bind(this)
              } placeholder="月" />
              <input className="filter-input" name="exchange" onChange= {
                this.handleFilterChanged.bind(this)
              } placeholder="取引所" />
              <button className="button float-button sort-button" name="desc" onClick={
                this.handleSortByDate.bind(this)
              }>日付降順</button>
              <button className="button float-button sort-button" name="asc" onClick={
                this.handleSortByDate.bind(this)
              }>日付昇順</button>
            </div>
            <div className="row">
              {pages}
            </div>
            {this.state.view === VIEWS.TRADE_LIST &&
              <TradeList data={trades} />}
            {this.state.view === VIEWS.PL_DETAIL &&
              <TradeList data={trades} type="pl-detail" />}
            <div className="row">
              {pages}
            </div>
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

