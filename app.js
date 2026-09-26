const menuButton=document.querySelector('.menu-toggle');
const nav=document.querySelector('#navigation');
function closeMenu(){menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Abrir menu');nav.classList.remove('open')}
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');nav.classList.toggle('open',open)});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){closeMenu();menuButton.focus()}});

// Subtle text reveals and a brief branded opening, with no-JS content preserved.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionStyle = document.createElement('style');
motionStyle.textContent = `
  .js-motion .text-reveal {transition:opacity 800ms ease,transform 800ms cubic-bezier(.2,.65,.3,1)}
  .js-motion .text-reveal:not(.visible) {opacity:0;transform:translateY(12px)}
  .site-loader {position:fixed;inset:0;z-index:9999;display:grid;place-items:center;background:#f6f5ef;pointer-events:none;transition:opacity 450ms ease,visibility 450ms;animation:loader-safety 0s 3s forwards}
  .site-loader img {width:min(72vw,340px);height:auto;animation:logo-arrive 750ms ease both}
  .site-loader.is-done {opacity:0;visibility:hidden}
  @keyframes logo-arrive {from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
  @keyframes loader-safety {to{opacity:0;visibility:hidden}}
  @media(prefers-reduced-motion:reduce){.site-loader{display:none}.js-motion .text-reveal:not(.visible){opacity:1;transform:none}.js-motion .text-reveal{transition:none}}
`;
document.head.append(motionStyle);
let revealObserver;
function startTextReveals() {
  if (motionPreference.matches || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('js-motion');
  revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {threshold:0.08, rootMargin:'0px 0px -20px 0px'});
  document.querySelectorAll('main h1,main h2,main h3,main p:not(details p),main figcaption,main summary,main .button').forEach(el => {
    el.classList.add('text-reveal');
    revealObserver.observe(el);
  });
}
if (!motionPreference.matches) {
  const loader = document.createElement('div');
  loader.className = 'site-loader';
  loader.setAttribute('aria-hidden', 'true');
  const logo = document.createElement('img');
  logo.src = 'assets/logo.svg';
  logo.alt = '';
  logo.width = 340;
  logo.height = 95;
  loader.append(logo);
  document.body.append(loader);
  const started = performance.now();
  let dismissed = false;
  function dismissLoader() {
    if (dismissed) return;
    dismissed = true;
    loader.classList.add('is-done');
    startTextReveals();
    setTimeout(() => loader.remove(), 500);
  }
  function finishLoading() {
    setTimeout(dismissLoader, Math.max(0, 850 - (performance.now() - started)));
  }
  if (document.readyState === 'complete') finishLoading();
  else window.addEventListener('load', finishLoading, {once:true});
  setTimeout(dismissLoader, 2000);
  window.addEventListener('pageshow', event => {if(event.persisted) dismissLoader();});
}
motionPreference.addEventListener('change', event => {
  if (event.matches) {
    revealObserver?.disconnect();
    document.querySelectorAll('.text-reveal').forEach(el => el.classList.add('visible'));
    document.querySelector('.site-loader')?.remove();
  }
});
