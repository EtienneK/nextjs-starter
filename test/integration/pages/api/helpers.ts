import assert from 'assert';
import fetch from 'isomorphic-unfetch';
import setCookie from 'set-cookie-parser';

// eslint-disable-next-line import/prefer-default-export
export async function login(serverUrl: string, { email, password }): Promise<string> {
  const body = JSON.stringify({ email, password });
  const loginResponse = await fetch(`${serverUrl}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  });
  const combinedCookieHeader = loginResponse.headers.get('set-cookie');
  assert(combinedCookieHeader);
  const splitCookieHeaders = setCookie.splitCookiesString(combinedCookieHeader);
  const cookies = setCookie.parse(splitCookieHeaders, { map: true });
  return `connect.sid=${cookies['connect.sid'].value}`;
}
