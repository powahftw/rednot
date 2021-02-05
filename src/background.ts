import { BlockedTimesKey, MessageType } from './utils';

/** Listen to changes in the settings and update the relevant tabs.  */
chrome.storage.onChanged.addListener((changes) => {
  if (BlockedTimesKey in changes) {
    return; // Don't send a message on counter updates.
  }
  chrome.tabs.query({}, (tabs) => {
    for (let tab of tabs) {
      chrome.tabs.sendMessage(tab.id, MessageType.UpdateSettings);
    }
  });
});
