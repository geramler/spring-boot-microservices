// Base URL for the Spring Cloud Gateway
const GATEWAY_BASE = 'http://localhost:8072';

// Service prefixes (as routed by the gateway)
const ACCOUNTS_BASE = `${GATEWAY_BASE}/eazybank/accounts/api`;
const CARDS_BASE = `${GATEWAY_BASE}/eazybank/cards/api`;
const LOANS_BASE = `${GATEWAY_BASE}/eazybank/loans/api`;

/**
 * Makes an authenticated API call through the gateway.
 * Automatically attaches the Bearer token from the OIDC user.
 *
 * @param {string} url - Full API URL
 * @param {object} options - fetch options (method, body, headers)
 * @param {object} user - OIDC user object (provides access_token)
 * @returns {Promise<Response>}
 */
async function apiCall(url, options = {}, user) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (user?.access_token) {
    headers['Authorization'] = `Bearer ${user.access_token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response;
}

// ─── Accounts ──────────────────────────────────────────────

/**
 * Create a new customer account.
 * POST /eazybank/accounts/api/create
 */
export async function createAccount(user, { name, email, mobileNumber, accountType, branchAddress }) {
  const body = {
    name,
    email,
    mobileNumber,
    accountsDto: {
      accountType,
      branchAddress,
    },
  };

  const res = await apiCall(`${ACCOUNTS_BASE}/create`, {
    method: 'POST',
    body: JSON.stringify(body),
  }, user);

  return handleResponse(res);
}

/**
 * Fetch account details for a mobile number.
 * GET /eazybank/accounts/api/fetch?mobileNumber=...
 */
export async function fetchAccount(user, mobileNumber) {
  const res = await apiCall(
    `${ACCOUNTS_BASE}/fetch?mobileNumber=${encodeURIComponent(mobileNumber)}`,
    { method: 'GET' },
    user,
  );

  return handleResponse(res);
}

/**
 * Update account details.
 * PUT /eazybank/accounts/api/update
 */
export async function updateAccount(user, accountData) {
  const res = await apiCall(`${ACCOUNTS_BASE}/update`, {
    method: 'PUT',
    body: JSON.stringify(accountData),
  }, user);

  return handleResponse(res);
}

/**
 * Delete an account.
 * DELETE /eazybank/accounts/api/delete?mobileNumber=...
 */
export async function deleteAccount(user, mobileNumber) {
  const res = await apiCall(
    `${ACCOUNTS_BASE}/delete?mobileNumber=${encodeURIComponent(mobileNumber)}`,
    { method: 'DELETE' },
    user,
  );

  return handleResponse(res);
}

// ─── Cards ──────────────────────────────────────────────

/**
 * Create a card for a mobile number.
 * POST /eazybank/cards/api/create?mobileNumber=...
 */
export async function createCard(user, mobileNumber) {
  const res = await apiCall(
    `${CARDS_BASE}/create?mobileNumber=${encodeURIComponent(mobileNumber)}`,
    { method: 'POST' },
    user,
  );

  return handleResponse(res);
}

/**
 * Fetch card details for a mobile number.
 * GET /eazybank/cards/api/fetch?mobileNumber=...
 */
export async function fetchCard(user, mobileNumber) {
  const res = await apiCall(
    `${CARDS_BASE}/fetch?mobileNumber=${encodeURIComponent(mobileNumber)}`,
    { method: 'GET' },
    user,
  );

  return handleResponse(res);
}

/**
 * Update card details.
 * PUT /eazybank/cards/api/update
 */
export async function updateCard(user, cardData) {
  const res = await apiCall(`${CARDS_BASE}/update`, {
    method: 'PUT',
    body: JSON.stringify(cardData),
  }, user);

  return handleResponse(res);
}

/**
 * Delete a card.
 * DELETE /eazybank/cards/api/delete?mobileNumber=...
 */
export async function deleteCard(user, mobileNumber) {
  const res = await apiCall(
    `${CARDS_BASE}/delete?mobileNumber=${encodeURIComponent(mobileNumber)}`,
    { method: 'DELETE' },
    user,
  );

  return handleResponse(res);
}

// ─── Loans ──────────────────────────────────────────────

/**
 * Create a loan for a mobile number.
 * POST /eazybank/loans/api/create?mobileNumber=...
 */
export async function createLoan(user, mobileNumber) {
  const res = await apiCall(
    `${LOANS_BASE}/create?mobileNumber=${encodeURIComponent(mobileNumber)}`,
    { method: 'POST' },
    user,
  );

  return handleResponse(res);
}

/**
 * Fetch loan details for a mobile number.
 * GET /eazybank/loans/api/fetch?mobileNumber=...
 */
export async function fetchLoan(user, mobileNumber) {
  const res = await apiCall(
    `${LOANS_BASE}/fetch?mobileNumber=${encodeURIComponent(mobileNumber)}`,
    { method: 'GET' },
    user,
  );

  return handleResponse(res);
}

/**
 * Update loan details.
 * PUT /eazybank/loans/api/update
 */
export async function updateLoan(user, loanData) {
  const res = await apiCall(`${LOANS_BASE}/update`, {
    method: 'PUT',
    body: JSON.stringify(loanData),
  }, user);

  return handleResponse(res);
}

/**
 * Delete a loan.
 * DELETE /eazybank/loans/api/delete?mobileNumber=...
 */
export async function deleteLoan(user, mobileNumber) {
  const res = await apiCall(
    `${LOANS_BASE}/delete?mobileNumber=${encodeURIComponent(mobileNumber)}`,
    { method: 'DELETE' },
    user,
  );

  return handleResponse(res);
}

// ─── Helpers ────────────────────────────────────────────────

/**
 * Parse the response and throw on non-2xx statuses.
 */
async function handleResponse(res) {
  if (res.status === 204) {
    return { statusCode: '204', statusMsg: 'No Content' };
  }

  const contentType = res.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.errorMessage || data.statusMsg || `Request failed with status ${res.status}`);
    }
    return data;
  }

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }

  return { statusCode: res.status.toString(), statusMsg: res.statusText };
}