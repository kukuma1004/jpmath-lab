const svgNamespace = 'http://www.w3.org/2000/svg';

function courseOutline(track) {
  if (typeof track.sample !== 'function') return null;
  const points = Array.from({ length: 80 }, (_, i) => track.sample(track.length * i / 80));
  const xs = points.map(point => point.x);
  const zs = points.map(point => point.z);
  const left = Math.min(...xs), top = Math.min(...zs);
  const width = Math.max(...xs) - left, height = Math.max(...zs) - top;
  const scale = Math.min(62 / (width || 1), 28 / (height || 1));
  const svg = document.createElementNS(svgNamespace, 'svg');
  svg.setAttribute('viewBox', '0 0 68 34');
  svg.setAttribute('aria-hidden', 'true');
  const route = document.createElementNS(svgNamespace, 'polygon');
  route.setAttribute('points', points.map(({x, z}) =>
    [34 + (x - left - width / 2) * scale, 17 + (z - top - height / 2) * scale].join(',')
  ).join(' '));
  svg.append(route);
  return svg;
}

export function bindGarage({ vehicleSpecs, tracks, onVehicle, onCourse }) {
  const description = document.getElementById('garage-description');
  const brands = { apex: 'APEX', tesla: '테슬라', hyundai: '현대', audi: '아우디' };
  const brandOf = spec => spec.brand || 'apex';
  const selectedByBrand = new Map();
  const brandButtons = [];
  for (const [brand, label] of Object.entries(brands)) {
    const first = vehicleSpecs.find(spec => brandOf(spec) === brand);
    if (!first) continue;
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.brand = brand;
    button.textContent = label;
    button.addEventListener('click', () => {
      const id = selectedByBrand.get(brand) || first.id;
      if (id === vehicleId) return;
      select(id, courseId);
      onVehicle(id);
    });
    brandButtons.push(button);
  }
  document.getElementById('brand-options').replaceChildren(...brandButtons);

  function choices(items, key, onChange) {
    const container = document.getElementById(key + '-options');
    const buttons = items.map(item => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset[key] = item.id;
      if (key === 'vehicle' && item.accent != null) {
        const color = typeof item.accent === 'number' ? '#' + item.accent.toString(16).padStart(6, '0') : item.accent;
        button.style.setProperty('--swatch', color);
      }
      const name = document.createElement('strong');
      name.textContent = item.name;
      button.append(name);
      if (key === 'vehicle') {
        const type = document.createElement('small');
        button.dataset.make = brandOf(item);
        type.textContent = item.cosmetic ? item.bodyClass || '' : [item.type, Number.isFinite(item.topSpeed) ? Math.round(item.topSpeed * 3.6) + 'km/h' : ''].filter(Boolean).join(' · ');
        button.title = item.description || item.name;
        if (type.textContent) button.append(type);
      } else {
        const outline = courseOutline(item);
        if (outline) button.prepend(outline);
      }
      button.addEventListener('click', () => {
        if (button.getAttribute('aria-pressed') === 'true') return;
        if (key === 'vehicle') select(item.id, courseId);
        else select(vehicleId, item.id);
        onChange(item.id);
      });
      return button;
    });
    container.replaceChildren(...buttons);
    return buttons;
  }
  let vehicleId, courseId;
  const vehicles = choices(vehicleSpecs, 'vehicle', onVehicle);
  const courses = choices(tracks, 'course', onCourse);
  function select(vehicle, course) {
    courseId = course;
    const spec = vehicleSpecs.find(item => item.id === vehicle) || vehicleSpecs[0];
    const brand = brandOf(spec);
    vehicleId = spec.id;
    selectedByBrand.set(brand, vehicleId);
    for (const button of brandButtons) button.setAttribute('aria-pressed', String(button.dataset.brand === brand));
    for (const button of vehicles) {
      button.hidden = button.dataset.make !== brand;
      button.setAttribute('aria-pressed', String(button.dataset.vehicle === vehicleId));
    }
    for (const button of courses) button.setAttribute('aria-pressed', String(button.dataset.course === course));
    const track = tracks.find(item => item.id === course);
    description.textContent = track?.description || '';
    document.getElementById('result-course').textContent = track?.name || '';
  }
  select(vehicleSpecs[0].id, tracks[0].id);
  return select;
}
