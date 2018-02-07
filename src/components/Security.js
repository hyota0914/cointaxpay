import React from 'react';

const Security = () => {
  return (
    <div className="container">
      <div>
        <div className="landing-header">
          <h1>個人情報管理について</h1>
        </div>
        <div className="row">
          <div className="landing-topic-header">
            <h2>個人情報の利用目的</h2>
          </div>
        </div>
        <div className="row">
          <div className="twelve columns u-full-width">
            本ウェブサイトでは、ユーザ名やe-mailアドレスをご登録いただく必要がございますが、これらの個人情報はご提供いただく際の目的以外では利用いたしません。
            ユーザ様からお預かりしたe-mailアドレス等は頂いたご質問に対する回答として、電子メールの送付に利用いたします。
          </div>
        </div>
        <div className="row landing-spacer"></div>
        <div className="row">
          <div className="landing-topic-header">
            <h2>個人情報の第三者への開示・提供の禁止</h2>
          </div>
        </div>
        <div className="row landing-spacer"></div>
        <div className="row">
          <div className="twelve columns u-full-width">
            本ウェブサイトは、お客さまよりお預かりした個人情報を適切に管理し、個人情報を第三者に開示いたしません。<br />
          </div>
        </div>
        <div className="row landing-spacer"></div>
        <div className="row">
          <div className="landing-topic-header">
            <h2>個人情報の安全対策</h2>
          </div>
        </div>
        <div className="row">
          <div className="twelve columns u-full-width">
            本ウェブサイトに登録された取引履歴等は、Amazon Web Serviceのクラウドストレージに安全に保管されます。第三者がデータを読み取ることができないようセキュリティ設定を施しています。
          </div>
        </div>
        <div className="row landing-spacer"></div>
        <div className="row">
          <div className="landing-topic-header">
            <h2>個人情報に関するお問い合わせ先</h2>
          </div>
        </div>
        <div className="row">
          <div className="twelve columns u-full-width">
            お問い合わせはメールアドレス(cointaxpay@gmail.com)までメールください。
          </div>
        </div>
        <div className="row landing-spacer-bottom"></div>
      </div>
    </div>
  );
}

export default Security;
