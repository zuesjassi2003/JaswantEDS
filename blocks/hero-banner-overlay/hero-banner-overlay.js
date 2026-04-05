export default function decorate(block) {
  // Extract all rows from the authored block
  const rows = [...block.children];

  /**
   * Helper to get the value column (typically column 2, or column 1 if only one exists)
   * @param {number} index - Row index
   * @returns {HTMLElement|null} - The column element containing the data
   */
  const getColValue = (index) => {
    const row = rows[index];
    if (!row) return null;
    const cols = [...row.children];
    return cols.length > 1 ? cols[1] : cols[0];
  };

  const getColText = (index) => {
    const col = getColValue(index);
    return col ? col.textContent.trim() : '';
  };

  const getColLink = (index) => {
    const col = getColValue(index);
    return col?.querySelector('a') || null;
  };

  const getColPicture = (index) => {
    const col = getColValue(index);
    return col?.querySelector('picture') || null;
  };

  // Map authored rows to a configuration object
  const config = {
    image: getColPicture(0),
    alt: getColText(1),
    eyebrow: getColText(2),
    headline: getColText(3),
    description: getColText(4),
    primaryCtaLabel: getColText(5),
    primaryCtaLink: getColLink(6),
    secondaryCtaLabel: getColText(7),
    secondaryCtaLink: getColLink(8),
    overlayAlign: getColText(9).toLowerCase() || 'left',
    overlayWidth: getColText(10).toLowerCase() || 'medium',
    overlayTheme: getColText(11).toLowerCase() || 'dark glass',
    textAlign: getColText(12).toLowerCase() || 'left',
  };

  // Ensure primary link comes from author even if label is used elsewhere
  if (config.primaryCtaLink && config.primaryCtaLabel) {
    config.primaryCtaLink.textContent = config.primaryCtaLabel;
  }
  if (config.secondaryCtaLink && config.secondaryCtaLabel) {
    config.secondaryCtaLink.textContent = config.secondaryCtaLabel;
  }

  // 1. Background Image Wrapper
  const bgWrapper = document.createElement('div');
  bgWrapper.classList.add('hero-banner-overlay-background');
  if (config.image) {
    if (config.alt) {
      const img = config.image.querySelector('img');
      if (img) img.alt = config.alt;
    }
    bgWrapper.append(config.image);
  } else {
    bgWrapper.classList.add('no-image');
  }

  // 2. Overlay Outer (responsible for alignment)
  const overlayOuter = document.createElement('div');
  overlayOuter.classList.add('hero-banner-overlay-outer');
  overlayOuter.classList.add(`overlay-align-${config.overlayAlign}`);

  // 3. Card (the content box)
  const card = document.createElement('div');
  card.classList.add('hero-banner-overlay-card');
  card.classList.add(`width-${config.overlayWidth}`);
  
  // Normalize theme name for class (e.g., 'dark glass' -> 'theme-dark-glass')
  const normalizedTheme = config.overlayTheme.replace(/\s+/g, '-');
  card.classList.add(`theme-${normalizedTheme}`);
  card.classList.add(`text-align-${config.textAlign}`);

  // Add content to card
  if (config.eyebrow) {
    const eyebrow = document.createElement('p');
    eyebrow.classList.add('hero-banner-overlay-eyebrow');
    eyebrow.textContent = config.eyebrow;
    card.append(eyebrow);
  }

  if (config.headline) {
    const headline = document.createElement('h2'); // h2 as standard, can be styled like h1
    headline.classList.add('hero-banner-overlay-headline');
    headline.textContent = config.headline;
    card.append(headline);
  }

  if (config.description) {
    const description = document.createElement('p');
    description.classList.add('hero-banner-overlay-description');
    description.textContent = config.description;
    card.append(description);
  }

  // CTA Group
  const ctaGroup = document.createElement('div');
  ctaGroup.classList.add('hero-banner-overlay-cta-group');

  if (config.primaryCtaLink) {
    const primary = config.primaryCtaLink.cloneNode(true);
    primary.classList.add('hero-banner-overlay-cta', 'primary');
    // Ensure button wrapper isn't accidentally inherited from EDS defaults
    const parentContainer = primary.closest('.button-container');
    if (parentContainer) parentContainer.classList.remove('button-container');
    ctaGroup.append(primary);
  }

  if (config.secondaryCtaLink) {
    const secondary = config.secondaryCtaLink.cloneNode(true);
    secondary.classList.add('hero-banner-overlay-cta', 'secondary');
    ctaGroup.append(secondary);
  }

  if (ctaGroup.children.length > 0) {
    card.append(ctaGroup);
  }

  // Assembly
  overlayOuter.append(card);
  block.textContent = ''; // Clear authoring markup
  block.append(bgWrapper, overlayOuter);
}
