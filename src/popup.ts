import {
  loadSettings,
  updateSettings,
  SupportedSettingsKeyValue,
  SupportedSettingsNames,
  MessageType,
  getTimesBlocked,
} from './utils';

chrome.runtime.onMessage.addListener((message) => {
  if (message === MessageType.UpdateContent) {
    updatePopupContent();
  }
});

const updatePopupContent = async () => {
  const timesBlocked = await getTimesBlocked();
  document.getElementById('timesBlocked').innerText = timesBlocked.toString();
};

window.onload = async () => {
  const showSettingsButton = document.getElementById('showSettings') as HTMLButtonElement;
  const settingsWrapper = document.getElementsByClassName('settingsSide')[0] as HTMLInputElement;
  const checkboxes = document.querySelectorAll('input[type=checkbox]');
  const root = document.getElementById('root') as HTMLDivElement;

  let timer: number;
  const secToHold = 2.5;
  showSettingsButton.addEventListener('mousedown', () => {
    timer = setTimeout(() => {
      root.classList.add('editSettings');
    }, secToHold * 1000);
  });
  showSettingsButton.addEventListener('mouseup', () => {
    clearTimeout(timer);
  });

  settingsWrapper.addEventListener('change', async () => {
    const settings = Object.fromEntries(
      Array.from(checkboxes)
        .filter((node) => SupportedSettingsNames.includes(node.getAttribute('name')))
        .map((node: HTMLInputElement) => [node.getAttribute('name'), node.checked])
    ) as SupportedSettingsKeyValue;

    await updateSettings(settings);
  });

  await updatePopupContent();
  // Load settings on Start.
  const settings = await loadSettings();
  Object.keys(settings)
    .filter((key) => SupportedSettingsNames.includes(key))
    .forEach((key) => {
      const checkBox = document.querySelector(`[name='${key}']`) as HTMLInputElement;
      if (checkBox != null) {
        checkBox.checked = settings[key];
      }
    });
};
