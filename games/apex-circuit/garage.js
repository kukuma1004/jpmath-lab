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
        const topSpeed = Math.round(item.topSpeed * 3.6);
        type.textContent = `${item.type} · ${topSpeed}km/h`;
        button.title = item.description;
        button.append(type);
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
    vehicleId = vehicle;
    courseId = course;
    for (const button of vehicles) button.setAttribute('aria-pressed', String(button.dataset.vehicle === vehicle));
    for (const button of courses) button.setAttribute('aria-pressed', String(button.dataset.course === course));
    const track = tracks.find(item => item.id === course);
    description.textContent = track?.description || '';
    document.getElementById('result-course').textContent = track?.name || '';
  }
  select(vehicleSpecs[0].id, tracks[0].id);
  return select;
}
