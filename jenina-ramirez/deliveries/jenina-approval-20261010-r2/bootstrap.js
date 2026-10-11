/* Blocking head script: remove the private fragment before any analytics runs. */
(() => {
  const params = new URLSearchParams(location.hash.slice(1));
  const invitation = params.get('delivery');
  const launch = params.get('delivery-launch');
  if (!invitation && !launch) { window.deliverySessionReady = Promise.resolve({ok:true}); return; }
  history.replaceState(null, '', location.pathname + location.search);
  window.deliverySessionReady = fetch('/api/delivery/' + (invitation ? 'invite' : 'redeem'), {
    method:'POST', credentials:'same-origin', cache:'no-store',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(invitation ? {token:invitation} : {code:launch})
  }).then(async response => {
    const result = await response.json();
    return response.ok ? result : {ok:false,error:'This approval link has expired or is no longer active. Please request a new delivery link.'};
  }).catch(() => ({ok:false,error:'Could not connect to save your response. Please reopen your delivery link.'}));
})();
