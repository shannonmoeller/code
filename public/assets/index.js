const initialPaths = localStorage.getItem('paths') || '';
const paths = new Set(initialPaths.split(',').filter(Boolean));

document.querySelectorAll('details').forEach((details) => {
  const { path } = details.dataset;

  details.open = paths.has(path);

  details.addEventListener('toggle', () => {
    if (details.open) {
      paths.add(path);
    } else {
      paths.delete(path);
    }

    localStorage.setItem('paths', [...paths].join(','));
  });
});
