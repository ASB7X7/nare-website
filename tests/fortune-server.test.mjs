import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createApp, settings, readJenova } from '../server/server.mjs';

const photo = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aWZ8AAAAASUVORK5CYII=', 'base64');
const origin = 'https://asb7x7.github.io';
const config = { ...settings({}), key: 'fake-test-key', agent: 'test-agent', publicOrigin: 'https://backend.example', allowedOrigin: origin };
const event = (name, value) => `event: ${name}\ndata: ${JSON.stringify(value)}\n\n`;
const successful = () => event('stream_delta', { seq: 1, chunk_content: 'В чашке — птица. ' }) + event('stream_delta', { seq: 2, chunk_content: 'Творческое чтение.' }) + event('stream_ended', { success: true, stop_reason: 'end_run' });
const sse = (text) => new Response(text, { headers: { 'Content-Type': 'text/event-stream' } });
async function fixture(t, overrides = {}, upstream = async () => sse(successful())) {
  const app = createApp({ ...config, ...overrides }, upstream);
  app.listen(0, '127.0.0.1'); await once(app, 'listening');
  t.after(() => { app.closeAllConnections(); return new Promise(resolve => app.close(resolve)); });
  const base = `http://127.0.0.1:${app.address().port}`;
  return { base, post: (body = photo, headers = {}) => fetch(`${base}/api/fortune`, { method: 'POST', body, headers: { Origin: origin, 'Content-Type': 'image/png', 'X-Nare-Consent': 'yes', ...headers } }) };
}
test('Uploads via ephemeral API; photo available only during reading; secrets stay server-side', async t => {
  let base, imageURL, payload;
  const setup = await fixture(t, {}, async (url, options) => {
    assert.equal(url, 'https://api.jenova.ai/v1/messages');
    assert.equal(options.headers.Authorization, 'Bearer fake-test-key');
    payload = JSON.parse(options.body); imageURL = payload.file_urls[0];
    assert.equal(payload.ephemeral, true); assert.equal(payload.stream, true); assert.equal(payload.agent, 'test-agent');
    const stored = await fetch(base + new URL(imageURL).pathname);
    assert.equal(stored.headers.get('cache-control'), 'no-store');
    assert.deepEqual(Buffer.from(await stored.arrayBuffer()), photo);
    return sse(successful());
  });
  base = setup.base;
  const res = await setup.post(); assert.equal(res.status, 200);
  assert.equal(res.headers.get('access-control-allow-origin'), origin);
  assert.deepEqual(await res.json(), { reading: 'В чашке — птица. Творческое чтение.' });
  assert.equal((await fetch(base + new URL(imageURL).pathname)).status, 404);
});
test('Unconfigured service fails closed without calling Jenova', async t => {
  const { base, post } = await fixture(t, { key: '' }, () => assert.fail('must not call API'));
  assert.deepEqual(await (await fetch(base + '/api/fortune/status')).json(), { ready: false });
  assert.equal((await post()).status, 503);
});
test('Rejects unknown origin, missing consent, fake image, oversized upload, secret-file paths', async t => {
  const { base, post } = await fixture(t, {}, () => assert.fail('must not call API'));
  assert.equal((await post(photo, { Origin: 'https://evil.example' })).status, 403);
  assert.equal((await post(photo, { 'X-Nare-Consent': 'no' })).status, 403);
  assert.equal((await post(Buffer.from('<svg/>'))).status, 415);
  assert.equal((await post(Buffer.alloc(5 * 1024 * 1024 + 1))).status, 413);
  for (const path of ['/.env', '/.git/config', '/server/server.mjs', '/package.json', '/assets/../.env']) assert.equal((await fetch(base + path)).status, 404);
  const options = await fetch(base + '/api/fortune', { method: 'OPTIONS', headers: { Origin: origin } });
  assert.equal(options.status, 204);
});
test('Daily limit reserves attempts before sending to Jenova', async t => {
  let calls = 0;
  const { post } = await fixture(t, { dailyLimit: 1 }, async () => { calls++; return sse(successful()); });
  assert.equal((await post()).status, 200); assert.equal((await post()).status, 429); assert.equal(calls, 1);
});
test('Concurrent uploads cannot exceed the configured cap', async t => {
  let started, release;
  const underway = new Promise(resolve => { started = resolve; });
  const waiting = new Promise(resolve => { release = resolve; });
  const { post } = await fixture(t, { concurrentLimit: 1 }, async () => { started(); await waiting; return sse(successful()); });
  const first = post(); await underway;
  assert.equal((await post()).status, 429); release(); assert.equal((await first).status, 200);
});
test('Provider failures expose no key or provider internals and delete the photo', async t => {
  let imagePath;
  const { base, post } = await fixture(t, {}, async (_, options) => {
    imagePath = new URL(JSON.parse(options.body).file_urls[0]).pathname;
    return new Response('fake-test-key internal error', { status: 402 });
  });
  const res = await post(); assert.equal(res.status, 503); assert.ok(!(await res.text()).includes('fake-test-key'));
  assert.equal((await fetch(base + imagePath)).status, 404);
});
test('Timeout releases upload and concurrency slot', async t => {
  let imagePath;
  const { base, post } = await fixture(t, { timeoutMs: 25 }, (_, options) => {
    imagePath = new URL(JSON.parse(options.body).file_urls[0]).pathname;
    return new Promise((_, reject) => options.signal.addEventListener('abort', () => reject(new Error('aborted')), { once: true }));
  });
  assert.equal((await post()).status, 504); assert.equal((await fetch(base + imagePath)).status, 404);
  assert.equal((await post()).status, 504);
});
test('SSE handles bytewise Cyrillic, CRLF, duplicate delta; ignores reasoning', async () => {
  const text = (event('stream_thinking', { content: 'private reasoning' }) + event('stream_delta', { seq: 1, chunk_content: 'Привет' }) + event('stream_delta', { seq: 1, chunk_content: 'дубль' }) + event('stream_ended', { success: true, stop_reason: 'end_run' })).replaceAll('\n', '\r\n');
  const bytes = new TextEncoder().encode(text);
  const stream = new ReadableStream({ start(controller) { for (const byte of bytes) controller.enqueue(new Uint8Array([byte])); controller.close(); } });
  assert.equal(await readJenova(new Response(stream, { headers: { 'Content-Type': 'text/event-stream' } })), 'Привет');
});
test('SSE rejects truncation, error events, empty reading and MCP requests', async () => {
  for (const text of [event('stream_delta', { chunk_content: 'partial' }), event('stream_error', { message: 'secret' }), event('mcp_connection', {}), event('stream_ended', { success: true, stop_reason: 'end_run' }), event('stream_delta', { chunk_content: 'partial' }) + event('stream_ended', { success: false })]) await assert.rejects(readJenova(sse(text)));
});
test('Settings accept only a bare HTTPS server origin', () => {
  for (const value of ['http://example.com', 'https://user:pass@example.com', 'https://example.com/path', 'https://example.com?q=1']) assert.equal(settings({ PUBLIC_BASE_URL: value }).publicOrigin, '');
  assert.equal(settings({ PUBLIC_BASE_URL: 'https://example.com/' }).publicOrigin, 'https://example.com');
});
