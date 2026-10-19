const MINIMUM = 15000;
const VAULT_KEY = 'roundveil.demo.receipt.v1';
const checkButton = document.querySelector('#check-button');
const amountInput = document.querySelector('#contribution');
const result = document.querySelector('#result');

const formatAmount = (amount) => new Intl.NumberFormat('en', { maximumFractionDigits: 0 }).format(amount);
const bytesToHex = (bytes) => [...new Uint8Array(bytes)].map((n) => n.toString(16).padStart(2, '0')).join('');

async function sha256(text) {
  return bytesToHex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)));
}

function showResult({ title, body, kind = 'success', commitment = '' }) {
  result.hidden = false;
  result.className = `result-panel ${kind}`;
  result.innerHTML = `<div class="result-mark">${kind === 'success' ? '✓' : '!'}</div><div class="result-copy"><strong>${title}</strong><span>${body}</span>${commitment ? `<code>Local commitment · ${commitment.slice(0, 12)}…${commitment.slice(-6)}</code>` : ''}</div>`;
}

checkButton.addEventListener('click', async () => {
  const amount = Number(amountInput.value.replace(/[\s,]/g, ''));
  if (!Number.isSafeInteger(amount) || amount < 0) {
    showResult({ title: 'Enter a valid amount', body: 'Use a whole number to preview this cycle.', kind: 'error' });
    amountInput.focus();
    return;
  }
  if (amount < MINIMUM) {
    showResult({ title: 'This contribution does not meet the rule', body: `The minimum is ${formatAmount(MINIMUM)} units. The amount stays in this browser.`, kind: 'error' });
    return;
  }

  checkButton.disabled = true;
  checkButton.innerHTML = '<span class="spinner"></span> Preparing local preview';
  const salt = bytesToHex(crypto.getRandomValues(new Uint8Array(32)));
  const commitment = await sha256(`roundveil-v1|cycle-08|${amount}|${salt}`);
  const receipt = { cycle: '08', amount, salt, commitment, createdAt: new Date().toISOString() };
  localStorage.setItem(VAULT_KEY, JSON.stringify(receipt));
  amountInput.value = '';
  amountInput.placeholder = 'Hidden after check';
  checkButton.disabled = false;
  checkButton.innerHTML = '<span>◈</span> Check eligibility privately <span class="button-arrow">↗</span>';
  showResult({ title: 'You meet the contribution rule', body: 'The amount was cleared from the field and saved with a random salt in this browser only. No network call was made.', commitment });
});

document.querySelector('#privacy-details').addEventListener('click', (event) => {
  const detail = document.querySelector('#ledger-detail');
  detail.hidden = !detail.hidden;
  event.currentTarget.setAttribute('aria-expanded', String(!detail.hidden));
});

document.querySelector('#activity-toggle').addEventListener('click', (event) => {
  const extra = document.querySelector('.extra-activity');
  extra.hidden = !extra.hidden;
  event.currentTarget.innerHTML = extra.hidden ? 'See all <span>↗</span>' : 'Show less <span>↖</span>';
});

document.querySelector('#reset-demo').addEventListener('click', () => {
  localStorage.removeItem(VAULT_KEY);
  result.hidden = true;
  amountInput.value = '15000';
  amountInput.placeholder = '';
  amountInput.focus();
});
