import React from 'react';

const Landing = () => (
  // TODO: Need to brush up landing page
  <div className="container">
    <div>
      <b>[説明]</b><br />
      各取引所の取引履歴を一括で登録し、税金計算のための損益を自動計算するツールです。<br />
      損益計算は総平均法で行います。<br />
    </div>
    <br />
    <div>
      <b>[利用料金]</b><br />
      無料です。
    </div>
    <br />
    <div>
      <b>[対応取引所]</b><br />
      ・Zaif<br/>
      ・Binance<br/>
      ・Coincheck<br/>
      ・Bitbank<br/>
    </div>
    <br />
    <div>
      <b>[計算方法]</b><br />
      総平均法にて損益を計算します。コイン同士の取引損益は下記のレートを用いて計算します。<br />
      ・コインチェックが公開している各コインの終値
    </div>
    <br />
    <div>
      <b>[注意]</b><br />
      Cointaxpay(β)はベータ版です。ご利用は自己責任でお願いいたします。<br />
      仮に本ソフトを利用することにより、何らかの損害が生じたとしても一切責任は負えません。<br />
      確定申告の際には、計算結果を十分ご確認ください。<br />
    </div>
  </div>
)

export default Landing;
