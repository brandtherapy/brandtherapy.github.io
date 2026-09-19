// Shared, brand-independent delivery control. The page supplies an expected
// immutable release; a different authenticated session must never approve it.
class DeliveryApproval extends HTMLElement {
  async connectedCallback() {
    if (this.ui) return;
    this.ui = this.attachShadow({mode: 'open'});
    this.requestId = crypto.randomUUID();
    this.open = false;
    this.mode = 'choose';
    this.render();
    this.observer = new ResizeObserver(() => {
      const height = this.ui.querySelector('header').getBoundingClientRect().height;
      this.style.height = `${height}px`;
      document.documentElement.style.setProperty('--delivery-bar-height', `${height}px`);
    });
    this.observer.observe(this.ui.querySelector('header'));
    this.onFocus = () => { if (!this.saving && this.mode === 'choose') this.load(); };
    window.addEventListener('focus', this.onFocus);
    this.onInteraction = event => {
      if (!this.data || !this.dataset.resource) return;
      const control = event.composedPath().find(el => el instanceof Element && el.matches('a[download],#copyAll,[data-copy-target]'));
      if (!control) return;
      const kind = control.matches('a[download]') ? 'download_click' : 'copy_click';
      this.api('/api/delivery/activity', {eventId:crypto.randomUUID(), releaseId:this.data.releaseId, resourceId:this.dataset.resource, kind}).catch(()=>{});
    };
    document.addEventListener('click', this.onInteraction, true);
    try {
      const access = await (window.deliverySessionReady || Promise.resolve({ok:true}));
      if (!access.ok) throw Error(access.error);
      // Only the loopback demonstration supplies a synthetic login endpoint.
      if (this.dataset.previewSession) await this.api(this.dataset.previewSession, {});
      await this.load();
      if(this.data && this.dataset.resource) this.api('/api/delivery/activity',{eventId:crypto.randomUUID(),releaseId:this.data.releaseId,resourceId:this.dataset.resource,kind:'view'}).catch(()=>{});
    } catch (e) { this.error = e.message; this.render(); }
  }
  disconnectedCallback() { this.observer?.disconnect(); window.removeEventListener('focus', this.onFocus); document.removeEventListener('click', this.onInteraction, true); }
  async api(path, body) {
    const response = await fetch(path, {method: body ? 'POST' : 'GET', credentials: 'same-origin', headers: body ? {'Content-Type': 'application/json'} : {}, body: body ? JSON.stringify(body) : undefined});
    const data = await response.json();
    if (!response.ok) throw Error(response.status === 401 ? 'Open the private link in your delivery email to respond.' : response.status === 409 ? 'This delivery has changed or already received a response. Reopen your latest delivery link.' : 'Could not connect to save your response. Please try again.');
    return data;
  }
  async load() {
    try {
      const data = await this.api('/api/delivery/current');
      if (data.deliverableId !== this.dataset.deliverable || data.releaseId !== this.dataset.release) throw Error('This link needs a current delivery session.');
      this.data = data; this.error = ''; this.render();
      const footer = document.getElementById('delivery-review-button');
      if (footer) {
        const approved = data.acceptance.state === 'approved', changes = data.acceptance.state === 'changes_requested';
        footer.textContent = approved ? 'View confirmation' : changes ? 'View your feedback' : 'Review & respond';
        const heading = footer.parentElement.querySelector('h2');
        if (heading) heading.textContent = approved ? 'Your delivery is approved.' : changes ? 'Your changes are recorded.' : 'Ready to approve this delivery?';
        footer.onclick = () => { this.open = true; this.mode = 'choose'; this.render(); };
      }
    } catch (e) { this.data = null; this.error = e.message; this.render(); }
  }
  async submit(state, note = '') {
    if (this.saving || !this.data) return;
    this.saving = true;
    this.ui.querySelectorAll('button,input,textarea').forEach(x => x.disabled = true);
    try {
      const d = this.data;
      await this.api('/api/delivery/respond', {requestId: this.requestId, releaseId: d.releaseId, manifestHash: d.manifestHash, statementVersion: d.statement.version, confirmed: state === 'approved', state, note});
      this.requestId = crypto.randomUUID(); this.mode = 'choose';
      await this.load();
    } catch (e) {
      this.error = e.message;
      // Preserve entered feedback and retry key until the server confirms saving.
      this.ui.querySelector('[role=alert]').textContent = this.error;
      this.ui.querySelectorAll('button,input,textarea').forEach(x => x.disabled = false);
    } finally { this.saving = false; }
  }
  render() {
    const e = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const d = this.data, state = d?.acceptance.state;
    const date = d?.acceptance.respondedAt ? new Date(d.acceptance.respondedAt).toLocaleDateString(undefined, {month:'short', day:'numeric', year:'numeric'}) : '';
    const status = state === 'approved' ? 'Approved · ' + date : state === 'changes_requested' ? 'Changes requested · ' + date : d ? 'Awaiting your approval' : this.error ? 'Approval unavailable' : 'Loading approval';
    const action = state === 'approved' ? 'View confirmation' : state === 'changes_requested' ? 'View your feedback' : 'Review & respond';
    let decision = '';
    if (state === 'approved') decision = `<h2>Your delivery is approved.</h2><p>${e(d.statement.text)}</p><p class="receipt">Recorded ${e(date)} · Version ${d.revision}</p>`;
    else if (state === 'changes_requested') decision = `<h2>Your changes are recorded.</h2><p class="feedback">${e(d.receipt?.note)}</p><p class="receipt">Recorded ${e(date)} · Version ${d.revision}</p>`;
    else if (this.mode === 'confirm') decision = `<h2>Confirm your approval</h2><p>${e(d?.statement.text)}</p><label class="ack"><input id="ack" type="checkbox"> I have reviewed this delivery.</label><button id="confirm" class="primary" disabled>Confirm approval</button><button id="cancel">Go back</button>`;
    else if (this.mode === 'changes') decision = '<h2>What needs changing?</h2><form id="feedback-form"><label for="feedback">Your feedback</label><textarea id="feedback" required maxlength="3000"></textarea><button class="primary" type="submit">Submit changes</button><button id="cancel" type="button">Go back</button></form>';
    else if (d) decision = '<h2>Approve your LinkedIn Sprint.</h2><p>Your approval covers the positioning in your Reveal and the complete LinkedIn Sprint in this version.</p><button id="approve" class="primary">Approve this delivery</button><button id="changes">Request changes</button>';
    this.ui.innerHTML = `<style>
:host{display:block;position:relative;z-index:1001;font:13px/1.5 Poppins,Arial,sans-serif;color:#22232d}*{box-sizing:border-box}header{position:fixed;inset:0 0 auto;background:#fafafa;border-bottom:1px solid #dddde6;box-shadow:0 3px 14px #20203009}.preview{background:#262733;color:#f4f4fb;padding:5px 24px;font:11px/1.5 system-ui}.bar{display:flex;align-items:center;gap:28px;padding:14px 24px}.owner{margin-right:auto}.owner strong{font-size:14px}.owner small{display:block;font-size:11px;color:#61626f}nav{display:flex;gap:20px}a{color:#61626f;text-decoration:none;padding:9px 0;border-bottom:2px solid transparent}a[aria-current=page]{color:#22232d;border-color:#5a5cf9}.status{font-size:12px;white-space:nowrap}button{font:600 12px/1.4 Poppins,Arial,sans-serif;border:1px solid #b7b8c4;background:transparent;color:#22232d;padding:12px 16px;cursor:pointer;border-radius:0}.primary{color:#fafaff;background:#5a5cf9;border-color:#5a5cf9}button:disabled{opacity:.5;cursor:default}button:hover:not(:disabled){filter:brightness(.95)}a:focus-visible,button:focus-visible,input:focus-visible,textarea:focus-visible{outline:3px solid #5a5cf9;outline-offset:3px}.panel{position:fixed;top:var(--delivery-bar-height,100px);right:0;left:0;max-height:calc(100dvh - var(--delivery-bar-height,100px));overflow:auto;padding:28px max(24px,calc((100vw - 820px)/2));background:#fafafa;border-bottom:1px solid #dddde6;box-shadow:0 15px 30px #20203018}.panel[hidden]{display:none}h2{font:600 22px/1.3 Poppins,Arial,sans-serif;margin:0 0 14px}p{max-width:65ch;margin:0 0 20px}button+button{margin-left:10px}.ack{display:flex;align-items:center;gap:10px;margin:22px 0}.ack input{width:18px;height:18px;accent-color:#5a5cf9}textarea{width:100%;min-height:100px;font:inherit;padding:12px;margin:8px 0 16px;border:1px solid #b7b8c4}.receipt{color:#61626f;font-size:12px}.feedback{white-space:pre-wrap}[role=alert]{color:#94252d;margin-top:15px}[role=alert]:empty{display:none}.close{display:block;margin:22px 0 0;border:0;padding:5px 0;text-decoration:underline;font-weight:400}.status:before{content:'';display:inline-block;background:#5a5cf9;width:6px;height:6px;border-radius:50%;margin-right:7px}
/* Compact delivery chrome; full response controls retain their reading space. */
header{box-shadow:none}.bar{gap:20px;padding:6px 20px;min-height:46px}.owner{display:flex;align-items:center;gap:10px}.owner strong{font-size:12px}.owner small{display:none}.preview{background:transparent;color:#777885;font:9px/1.3 Poppins,Arial,sans-serif;padding:0;white-space:nowrap}nav{gap:16px}a{font-size:11px;padding:7px 0}.status{font-size:11px}#respond{font-size:11px;padding:7px 12px;min-height:32px}
@media(max-width:760px){.bar{display:grid;grid-template-columns:1fr auto;gap:0 12px;padding:5px 14px;min-height:70px}.owner{grid-column:1;gap:8px}.owner strong{font-size:11px}.preview{font-size:8px}nav{grid-row:2;gap:16px}.status{grid-column:2;grid-row:1;font-size:10px}#respond{grid-column:2;grid-row:2;padding:6px 10px;min-height:30px}.panel{padding:24px 18px}.panel button{margin:0 0 10px;width:100%}.panel .close{text-align:left}h2{font-size:20px}}
</style><header><div class="bar"><div class="owner"><strong>${e(this.dataset.name || d?.brandName)}</strong>${this.dataset.previewSession ? '<span class="preview" title="Local preview. Test responses only.">Test preview</span>' : ''}<small>LinkedIn Sprint${d ? ' · Version ' + d.revision : ''}</small></div><nav aria-label="Your delivery"><a href="${e(this.dataset.reveal)}" aria-current="${this.dataset.page === 'reveal' ? 'page' : 'false'}">Reveal</a><a href="${e(this.dataset.sprint)}" aria-current="${this.dataset.page === 'sprint' ? 'page' : 'false'}">Sprint</a></nav><span class="status" role="status">${e(status)}</span><button id="respond" class="${state === 'pending' ? 'primary' : ''}" aria-expanded="${this.open}" aria-controls="panel">${this.open ? 'Close response' : action}</button></div></header><section id="panel" class="panel" aria-label="Delivery response" ${this.open ? '' : 'hidden'}>${decision}<p role="alert">${e(this.error)}</p><button id="close" class="close">Back to ${this.dataset.page === 'reveal' ? 'Reveal' : 'Sprint'}</button></section>`;
    const $ = id => this.ui.getElementById(id);
    const close = () => { this.open = false; this.mode = 'choose'; this.render(); $('respond').focus(); };
    $('respond').onclick = () => { this.open = !this.open; this.mode = 'choose'; this.render(); };
    $('close').onclick = close;
    this.ui.onkeydown = event => { if (event.key === 'Escape') close(); };
    if ($('approve')) $('approve').onclick = () => { this.mode = 'confirm'; this.render(); $('ack').focus(); };
    if ($('changes')) $('changes').onclick = () => { this.mode = 'changes'; this.render(); $('feedback').focus(); };
    if ($('cancel')) $('cancel').onclick = () => { this.mode = 'choose'; this.render(); };
    if ($('ack')) $('ack').onchange = () => { $('confirm').disabled = !$('ack').checked; };
    if ($('confirm')) $('confirm').onclick = () => { if ($('ack').checked) this.submit('approved'); };
    if ($('feedback-form')) $('feedback-form').onsubmit = event => { event.preventDefault(); if ($('feedback').value.trim()) this.submit('changes_requested', $('feedback').value.trim()); else { $('feedback').setCustomValidity('Describe the change you need.'); $('feedback').reportValidity(); $('feedback').oninput = () => $('feedback').setCustomValidity(''); } };
    this.observer?.disconnect(); this.observer?.observe(this.ui.querySelector('header'));
  }
}
customElements.define('delivery-approval', DeliveryApproval);
