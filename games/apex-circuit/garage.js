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
  const byId = id => document.getElementById(id);
  const tabs = [byId('vehicle-tab'), byId('course-tab')];
  const panels = tabs.map(tab => byId(tab.getAttribute('aria-controls')));
  let activeTab = 0;
  function showTab(index) {
    activeTab = index;
    tabs.forEach((tab, i) => {
      const selected = index === i;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      panels[i].hidden = !selected;
    });
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => showTab(index));
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 :
        (index + (event.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length;
      showTab(next);
      tabs[next].focus();
    });
  });
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
  byId('brand-options').replaceChildren(...brandButtons);

  function choices(items, key, onChange) {
    const container = byId(key + '-options');
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
        button.dataset.make = brandOf(item);
        button.title = item.description || item.name;
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
  const boostDuration = spec => 1 / (spec.boostDrain || .4);
  const stats = [
    ['최고 속도', spec => spec.topSpeed, value => Math.round(value * 3.6) + ' km/h'],
    ['출발 가속', spec => spec.acceleration, value => (value / 18).toFixed(2) + '×'],
    ['코너 그립', spec => spec.grip, value => value.toFixed(2) + '×'],
    ['부스터 지속', boostDuration, value => value.toFixed(1) + '초']
  ].map(([label, read, format]) => ({
    label, read, format, max: Math.max(...vehicleSpecs.map(read))
  }));
  const profile = byId('vehicle-profile');
  const courseTitle = byId('selected-course');
  const meters = document.createElement('dl');
  const statViews = stats.map(({ label }) => {
    const group = document.createElement('div');
    const term = document.createElement('dt');
    const value = document.createElement('dd');
    const meter = document.createElement('i');
    term.textContent = label;
    meter.className = 'garage-meter';
    meter.setAttribute('aria-hidden', 'true');
    group.append(term, value, meter);
    meters.append(group);
    return { value, meter };
  });
  const trait = document.createElement('strong');
  const bodyClass = document.createElement('span');
  const detail = document.createElement('p');
  const heading = document.createElement('div');
  heading.className = 'garage-detail-heading';
  heading.append(trait, bodyClass);
  profile.append(heading, meters, detail);
  function select(vehicle, course) {
    if (vehicleId !== vehicle) {
      const spec = vehicleSpecs.find(item => item.id === vehicle) || vehicleSpecs[0];
      const brand = brandOf(spec);
      vehicleId = spec.id;
      selectedByBrand.set(brand, vehicleId);
      for (const button of brandButtons) button.setAttribute('aria-pressed', String(button.dataset.brand === brand));
      for (const button of vehicles) {
        button.hidden = button.dataset.make !== brand;
        button.setAttribute('aria-pressed', String(button.dataset.vehicle === vehicleId));
      }
      byId('selected-vehicle').textContent = spec.name;
      trait.textContent = spec.type;
      bodyClass.textContent = spec.bodyClass || brands[brand];
      detail.textContent = spec.description;
      stats.forEach(({ read, format, max }, i) => {
        const amount = read(spec);
        statViews[i].value.textContent = format(amount);
        statViews[i].meter.style.setProperty('--fill', amount / max);
      });
    }
    if (courseId !== course) {
      courseId = course;
      for (const button of courses) button.setAttribute('aria-pressed', String(button.dataset.course === course));
      const track = tracks.find(item => item.id === course);
      courseTitle.textContent = track.name;
      byId('course-terrain').textContent = track.subtitle;
      byId('course-length').textContent = track.length < 1000 ?
        Math.round(track.length) + ' m / 랩' : (track.length / 1000).toFixed(2) + ' km / 랩';
      byId('garage-description').textContent = track.description;
    }
  }
  select(vehicleSpecs[0].id, tracks[0].id);
  return { select, focus: () => tabs[activeTab].focus({ preventScroll: true }) };
}
