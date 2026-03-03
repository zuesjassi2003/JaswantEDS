export default async function decorate(block) {
  block.classList.add('header-navigation-section');

  // mark row containers for styling
  const rows = Array.from(block.children).filter((n) => n.nodeType === 1);
  rows.forEach((row) => row.classList.add('hns-row'));

  // add lazy loading to images
  block.querySelectorAll('img').forEach((img) => {
    if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
    if (!img.getAttribute('alt')) img.setAttribute('alt', '');
  });

  // enhance links
  block.querySelectorAll('a').forEach((a) => {
    const href = a.getAttribute('href') || '';
    if (href && !href.startsWith('#') && !href.startsWith(window.location.origin)) {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
    }

    const text = a.textContent.trim().toUpperCase();
    if (text.includes('OPEN TRADING')) {
      a.classList.add('btn-red');
    } else if (text === 'LOGIN' || text === 'LOG IN') {
      a.classList.add('btn-blue');
    } else if (text.includes('INVESTRIGHT')) {
      a.classList.add('btn-lightblue');
    }

    if (!text && (a.querySelector('svg') || a.querySelector('img'))) {
      a.classList.add('hns-icon');
    }
  });
}
