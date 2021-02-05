const BlockedTimesKey = 'blockedTimes' as const;
const SupportedSettingsName = ['enable', 'onlyHome', 'redirectOnBlock'] as const;
const SupportedSettingsNames = Array.from(SupportedSettingsName) as [string];

type SupportedSettings = typeof SupportedSettingsName[number];
type SupportedSettingsKeyValue = { [key in SupportedSettings]: boolean };

type SettingKeyValue = { [key: string]: boolean };

enum MessageType {
  UpdateSettings,
  UpdateContent,
}

const loadSettings = async (): Promise<SettingKeyValue> => {
  return new Promise((resolve) => {
    chrome.storage.sync.get(null, (options) => {
      resolve(options);
    });
  });
};

const updateSettings = async (settings: SupportedSettingsKeyValue): Promise<void> => {
  return new Promise((resolve) => {
    chrome.storage.sync.set(settings, () => {
      resolve();
    });
  });
};

const getTimesBlocked = async (): Promise<number> => {
  const blockedTimes = await new Promise((resolve) => {
    chrome.storage.sync.get({ [BlockedTimesKey]: 0 }, (blockedTimes) => {
      resolve(blockedTimes[BlockedTimesKey]);
    });
  });
  return blockedTimes as number;
};

const increaseTimesBlocked = async (): Promise<void> => {
  const previouslyBlockedTimes = await getTimesBlocked();
  await new Promise((resolve) => {
    chrome.storage.sync.set({ [BlockedTimesKey]: previouslyBlockedTimes + 1 }, () => {
      resolve(0);
    });
  });
  chrome.runtime.sendMessage(MessageType.UpdateContent);
};

export {
  loadSettings,
  updateSettings,
  SettingKeyValue,
  SupportedSettingsKeyValue,
  SupportedSettings,
  SupportedSettingsNames,
  getTimesBlocked,
  increaseTimesBlocked,
  MessageType,
  BlockedTimesKey,
};
