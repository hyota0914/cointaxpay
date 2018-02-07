import React from 'react';

const Contribute = () => {
  return (
    <div className="container">
      <div>
        <div className="landing-header">
          <h1>寄付</h1>
        </div>
        <div className="u-full-width">
          サーバ維持と今後の開発の励みのため、少額でも寄付いただければ幸いです。
        </div>
        <div className="row landing-spacer"></div>
        <div className="row">
          <div className="landing-topic-header">
            <h2>ビットコイン寄付先</h2>
          </div>
          <div className="row landing-spacer"></div>
          <div className="u-full-width">
            <img src="/images/contribute_btc.png" className="qr-code" /><br />
            <a href="bitcoin:1KQFVSYz7nJXKAPTRjEpS7Uuq5GnMaijhk">bitcoin:1KQFVSYz7nJXKAPTRjEpS7Uuq5GnMaijhk</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contribute;
