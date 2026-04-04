export default function decorate(block) {
  const container = document.createElement('div');
  container.classList.add('hero-banner-container-inner');
  const imageCol = document.createElement('div');
  imageCol.classList.add('hero-banner-image-col');
  const textCol = document.createElement('div');
  textCol.classList.add('hero-banner-text-col');

  [...block.children].forEach((row) => {
    const cols = [...row.children];
    cols.forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        imageCol.append(...col.childNodes);
      } else if (col.textContent.trim() !== '' || col.querySelector('a')) {
        [...col.childNodes].forEach((node) => {
          textCol.append(node);
        });
      }
    });
  });

  // Style heading
  const heading = textCol.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) {
    heading.classList.add('hero-banner-heading');
  }

  // Style links as CTAs/Buttons
  const links = textCol.querySelectorAll('a');
  links.forEach((a) => {
    a.classList.add('hero-banner-cta');
    const containerWrapper = a.closest('.button-container');
    if (containerWrapper) {
      containerWrapper.classList.remove('button-container');
      a.classList.remove('button');
    }
  });

  container.append(imageCol, textCol);
  block.textContent = '';
  block.append(container);
}
