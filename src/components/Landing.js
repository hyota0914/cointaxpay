import React from 'react';

const Landing = () => {
  return (
    <div className="container">
      <div>
        <div className="landing-header">
          <img src="/images/logo_large.png" className="landing-logo" /><br />
        </div>
        <div className="u-full-width">
          Cointaxpay(β)は、仮想通貨の損益計算に困っている方々向けの損益計算アプリです。簡単操作で仮想通貨の年間利益・損失を計算できます。バグ報告、ご質問、ご要望がありましたら、お気軽に<a href="https://twitter.com/cointaxpay_jp" target="_blank" rel="noopener noreferrer">ツイッターアカウント</a>までDM等でお知らせください。
        </div>
        <div className="row landing-spacer"></div>
        <div className="row">
          <div className="landing-topic-header">
            <h2>機能と特徴</h2>
          </div>
        </div>
        <div className="row landing-spacer"></div>
      </div>
      <div className="row">
        <div className="six columns">
          <div className="landing-feature-header">
            <h3>取引履歴の一括インポート機能</h3>
          </div>
          <div>
            各取引所の取引履歴を一括で登録する機能です。現在Zaif、コインチェック、Bitbank、Binanceに対応しております。
          </div>
        </div>
        <div className="six columns">
          <div className="landing-feature-header">
            <h3>日次損益の計算機能</h3>
          </div>
          <div>
            取引登録後、年間の損益を日単位で計算する機能です。損益の計算には、コインチェック社が公開している日別終値を利用します。各通貨の取得原価は総平均法で計算します。
          </div>
        </div>
      </div>
      <div className="row landing-spacer"></div>
      <div className="row">
        <div className="six columns">
          <div className="landing-feature-header">
            <h3>計算結果のダウンロード機能</h3>
          </div>
          <div>
            損益計算結果をCSVファイルでダウンロードする機能です。Excelなどのスプレッドシートでの検算・修正などにご利用ください。
          </div>
        </div>
        <div className="six columns">
          <div className="landing-feature-header">
            <h3>利用料金</h3>
          </div>
          <div>
            利用料金は無料です。
          </div>
        </div>
      </div>
      <div className="row landing-spacer"></div>
      <div className="row">
        <div className="landing-topic-header">
          <h2>対応取引所</h2>
        </div>
      </div>
      <div className="row">
        <div className="twelve columns u-full-width">
          現時点でZaif, Coincheck, Bitbankに対応しています。
        </div>
      </div>
      <div className="row landing-spacer"></div>
      <div className="row">
        <div className="landing-topic-header">
          <h2>免責事項</h2>
        </div>
      </div>
      <div className="row">
        <div className="twelve columns u-full-width">
          Cointaxpay(β)は試作段階のアプリとなります。ご利用は自己責任でお願いいたします。本アプリを利用することにより、いかなる損害が生じたとしても当方は責任は負えません。確定申告の際には、計算結果を十分ご確認ください。
        </div>
      </div>
      <div className="row landing-spacer"></div>
      <div className="row">
        <div className="landing-topic-header">
          <h2>お問い合わせ</h2>
        </div>
      </div>
      <div className="row">
        <div className="twelve columns u-full-width">
          お問い合わせは<a href="https://twitter.com/cointaxpay_jp" target="_blank" rel="noopener noreferrer">ツイッターアカウント</a>にご連絡ください。または、メールアドレス(cointaxpay@gmail.com)までメールください。
        </div>
      </div>
      <div className="row landing-spacer-bottom"></div>
    </div>
  );
}

export default Landing;
