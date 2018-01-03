const CoinMarketCap         = require('coinmarketcap-api'),
      client                = new CoinMarketCap(),
      snoowrap              = require('snoowrap');

const r = new snoowrap({
  userAgent: 'useragent',
  clientId: 'client_id',
  clientSecret: 'client_secret',
  username: 'username',
  password: 'password'
});

/* global variables */
let subreddit = 'navcoin';
let btc;
let usd;

function getDescription() {
  if (!usd || !btc) {
    return;
  }

  r.getSubreddit(subreddit).getSettings().description.then((description) => {
    description = description.replace(/(USD: \$)(.*)/, "$1" + usd);
    description = description.replace(/(BTC: )(.*)/, "$1" + btc);

    postDescription(description);
  }).catch(console.error);
}

function postDescription(description) {
  r.getSubreddit(subreddit).editSettings({description}).then(console.error);
}

/* fetch Nav Coin BTC and USD values */
function getNav() {
  return client.getTicker({limit: 1, currency: 'nav-coin'}).then((res) => {
    btc = res[0].price_btc;
    usd = res[0].price_usd;
    usd = usd.substr(0,5);
  }).catch(console.error);
}

getNav().then(getDescription);

/* update prices every 10 minutes */
setInterval(() => { getNav().then(getDescription); }, 1000 * 60 * 15);