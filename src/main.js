import { simulateContribution } from './contract-simulation.js';

const checkButton = document.querySelector('#check-button');
const amountInput = document.querySelector('#contribution');
const result = document.querySelector('#result');

const formatAmount = (amount) => new Intl.NumberFormat('en', { maximumFractionDigits: 0 }).format(amount);

function showResult({ title, body, kind = 'success', commitment = '' }) {
  result.hidden = false;
  result.className = `result-panel ${kind}`;
  result.innerHTML = `<div class="result-mark">${kind === 'success' ? '✓' : '!'}</div><div class="result-copy"><strong>${title}</strong><span>${body}</span>${commitment ? `<code>Compact commitment · ${commitment.slice(0, 12)}…${commitment.slice(-6)}</code>` : ''}</div>`;
}

checkButton.addEventListener('click', () => {
  const amount = Number(amountInput.value.replace(/[\s,]/g, ''));
  if (!Number.isSafeInteger(amount) || amount < 0) {
    showResult({ title: 'Enter a valid amount', body: 'Use a whole number to preview this cycle.', kind: 'error' });
    amountInput.focus();
    return;
  }

  checkButton.disabled = true;
  checkButton.innerHTML = '<span class="spinner"></span> Executing Compact circuits';
  try {
    const outcome = simulateContribution(amount);
    amountInput.value = '';
    amountInput.placeholder = 'Hidden after check';
    checkButton.innerHTML = '<span>✓</span> Claim accepted by contract simulation';
    showResult({
      title: 'The Compact contract accepted this claim',
      body: `The compiled registration, receipt, and claim circuits ran in this browser. The ${formatAmount(outcome.minimumContribution)}-unit rule passed. No ZK proof was generated or sent to a network.`,
      commitment: outcome.commitment,
    });
  } catch (error) {
    checkButton.innerHTML = '<span>↻</span> Reset to try another scenario';
    showResult({
      title: 'The Compact contract rejected this claim',
      body: `${error.message} The failed claim did not update the simulated public ledger.`,
      kind: 'error',
    });
  }
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
  result.hidden = true;
  amountInput.value = '15000';
  amountInput.placeholder = '';
  checkButton.disabled = false;
  checkButton.innerHTML = '<span>◈</span> Check eligibility privately <span class="button-arrow">↗</span>';
  amountInput.focus();
});
