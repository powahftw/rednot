import {
  increaseTimesBlocked,
  loadSettings,
  MessageType,
  SupportedSettingsKeyValue,
} from './utils';

const REDDIT_HOME_URLS = [
  'reddit.com',
  'reddit.com/top',
  'reddit.com/r/all',
  'reddit.com/r/popular',
];

const REDIRECT_TO = 'https://www.google.com';

const SELECTOR_TO_BLOCK = ['body > div.content'];
const CSS_ID = '_rednot';
const STYLE_EL = `
  <style id='${CSS_ID}' type='text/css'>
     ${SELECTOR_TO_BLOCK.join(', ')}{ display: none; !important }
  </style>`;

const changeRedditContentVisibility = (shouldBeVisible?: boolean) => {
  if (!shouldBeVisible) {
    document.head.insertAdjacentHTML('beforebegin', STYLE_EL);
  } else {
    document.getElementById(CSS_ID)?.remove();
  }
};

const checkSettingsAndMaybeReplaceContent = async () => {
  const settings = (await loadSettings()) as SupportedSettingsKeyValue;
  if (!settings.enable) {
    changeRedditContentVisibility(true);
    return;
  }

  const currentUrl = window.location.href.split(/[?#]/)[0].replace(/\/+$/, '');
  const userOnHomePage = REDDIT_HOME_URLS.some((homeUrl) => currentUrl.endsWith(homeUrl));

  if (settings.onlyHome && !userOnHomePage) {
    changeRedditContentVisibility(true);
    return;
  }

  await increaseTimesBlocked();
  if (settings.redirectOnBlock) {
    window.location.replace(REDIRECT_TO);
    return;
  }

  changeRedditContentVisibility(false);
};

chrome.runtime.onMessage.addListener((message) => {
  if (message === MessageType.UpdateSettings) {
    checkSettingsAndMaybeReplaceContent();
  }
});

checkSettingsAndMaybeReplaceContent();
