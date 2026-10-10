'use strict';

// Product data is independent of rendering and can be replaced by a CMS/API adapter.
const GRINDS = ['В зернах', 'Турка', 'Эспрессо', 'Гейзер', 'Фильтр', 'Френч-пресс'];
const METHODS = ['Турка', 'Кофемашина', 'Фильтр', 'Френч-пресс', 'Гейзер'];
const money = (value) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(value);
const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const baseProduct = (id, name, category, price) => ({ id, slug: id, name, category, subcategory: '', description: '', images: [], price, oldPrice: null, stock: 24, featured: false, new: false, weight: null, variants: [], tags: [] });
function coffee(id, name, subtitle, price, arabica, origin, roast, notes, strength, acidity, methods, tags, profile) {
  return { ...baseProduct(id, name, 'coffee', price), subtitle, beanType: arabica === 100 ? 'Арабика' : arabica === 0 ? 'Робуста' : 'Арабика + Робуста', arabicaPercentage: arabica, robustaPercentage: 100 - arabica,
    origin, roastLevel: roast, grindOptions: GRINDS, tasteNotes: notes, acidity, body: strength, sweetness: profile[2], strength, brewMethods: methods, tags, tasteProfile: profile,
    subcategory: tags.includes('Декаф') ? 'Декаф' : arabica === 100 ? 'Моносорта' : arabica === 0 ? 'Робуста' : 'Авторские смеси',
    weight: 250, images: ['assets/coffee.webp'], description: `${notes.join(', ')}. ${roast} обжарка для выразительной и сбалансированной чашки.`,
    variants: [{ weight: 250, price }, { weight: 500, price: Math.round(price * 1.9 / 10) * 10 }, { weight: 1000, price: Math.round(price * 3.6 / 10) * 10 }] };
}
const coffees = [
  coffee('ethiopia', 'ETHIOPIA ARABICA', 'Yirgacheffe', 1490, 100, 'Эфиопия', 'Светлая', ['Цветы', 'Цитрус', 'Фрукты'], 2, 4, ['Фильтр', 'Френч-пресс', 'Турка'], ['Моносорта', 'Для фильтра'], [1, 1, 2]),
  coffee('brazil', 'BRAZIL SANTOS', 'Fazenda', 1290, 100, 'Бразилия', 'Средняя', ['Шоколад', 'Орехи', 'Карамель'], 3, 2, METHODS, ['Моносорта', 'Для эспрессо', 'Для турки'], [4, 4, 4]),
  coffee('colombia', 'COLOMBIA EL DIVISO', 'El Diviso', 1590, 100, 'Колумбия', 'Средняя', ['Вишня', 'Какао', 'Специи'], 3, 3, ['Фильтр', 'Френч-пресс', 'Кофемашина'], ['Моносорта', 'Для фильтра'], [3, 1, 3]),
  coffee('crema', 'ESPRESSO CREMA', 'Плотность и баланс', 1190, 70, 'Бразилия / Вьетнам', 'Средняя', ['Шоколад', 'Орехи', 'Какао'], 4, 1, ['Кофемашина', 'Гейзер', 'Турка'], ['Авторские смеси', 'Для эспрессо'], [5, 4, 2]),
  coffee('italian', 'ITALIAN DARK', 'Итальянский характер', 1090, 50, 'Бразилия / Индия', 'Тёмная', ['Какао', 'Специи', 'Тёмный шоколад'], 5, 1, ['Кофемашина', 'Гейзер', 'Турка'], ['Авторские смеси', 'Для эспрессо', 'Для турки'], [5, 2, 1]),
  coffee('robusta', 'ROBUSTA INTENSO', 'Выраженная крепость', 890, 0, 'Вьетнам', 'Тёмная', ['Какао', 'Орехи'], 5, 1, ['Кофемашина', 'Турка', 'Гейзер', 'Френч-пресс'], ['Для турки'], [4, 3, 1]),
  coffee('decaf', 'DECAF COLOMBIA', 'Без кофеина', 1690, 100, 'Колумбия', 'Средняя', ['Карамель', 'Шоколад'], 1, 2, METHODS, ['Декаф', 'Моносорта'], [3, 2, 5]),
  coffee('ritual', 'NARÉ RITUAL BLEND', 'Авторский купаж', 1390, 80, 'Бразилия / Индия', 'Средняя', ['Орехи', 'Карамель', 'Шоколад'], 3, 2, METHODS, ['Авторские смеси', 'Для турки'], [4, 5, 4])
];
coffees.slice(0, 3).forEach((p) => { p.featured = true; });
coffees[2].new = true; coffees[7].new = true;
function sweet(id, name, subcategory, price, flavors, ingredients, pieces, netWeight, pairings, description) {
  return { ...baseProduct(id, name, 'sweets', price), subcategory, flavors, ingredients, pieces, netWeight, weight: netWeight, pairings, description, images: ['assets/chocolates.webp', 'assets/nare-sweets.webp'], tags: [subcategory], featured: true };
}
const sweets = [
  sweet('classic', 'NARÉ CLASSIC COLLECTION', 'Ассорти', 1890, ['Шоколад', 'Орехи', 'Карамель'], ['Какао-масло', 'Какао тёртое', 'Сахар', 'Сливки', 'Фундук', 'Миндаль', 'Соевый лецитин'], 12, 180, ['brazil', 'ritual'], 'Ассорти конфет ручной работы: разные оттенки шоколада, нежный орех и мягкая карамель.'),
  sweet('truffles', 'DARK CHOCOLATE TRUFFLES', 'Трюфели', 1590, ['Тёмный шоколад', 'Какао'], ['Какао тёртое', 'Сливки', 'Сахар', 'Какао-масло', 'Какао-порошок'], 9, 135, ['ethiopia', 'colombia'], 'Трюфели из тёмного шоколада с нежной текстурой и глубоким послевкусием.'),
  sweet('praline', 'COFFEE PRALINE', 'Шоколадные конфеты', 1690, ['Кофе', 'Фундук', 'Шоколад'], ['Какао тёртое', 'Какао-масло', 'Сахар', 'Фундук', 'Сливки', 'Кофе', 'Соевый лецитин'], 12, 180, ['brazil', 'crema', 'robusta'], 'Шоколадные конфеты с насыщенным кофейным пралине и ореховой глубиной.'),
  sweet('pistachio', 'PISTACHIO COLLECTION', 'Ореховые', 2190, ['Фисташка', 'Белый шоколад'], ['Какао-масло', 'Сухое молоко', 'Сахар', 'Фисташка', 'Сливки', 'Соевый лецитин'], 12, 180, ['ritual', 'decaf'], 'Конфеты с нежной фисташковой начинкой и бархатистым белым шоколадом.'),
  sweet('gift', 'NARÉ GIFT BOX', 'Подарочные наборы', 3290, ['Шоколад', 'Карамель', 'Орехи'], ['Какао-масло', 'Какао тёртое', 'Сахар', 'Сливки', 'Фундук', 'Фисташка', 'Соевый лецитин'], 24, 360, ['brazil', 'colombia'], 'Премиальный подарочный набор в фирменной коробке NARÉ SWEETS.'),
  sweet('caramel', 'SALTED CARAMEL', 'Карамельные', 1490, ['Карамель', 'Морская соль'], ['Какао тёртое', 'Какао-масло', 'Сахар', 'Сливки', 'Сливочное масло', 'Морская соль'], 9, 135, ['italian', 'decaf'], 'Мягкая сливочная карамель с морской солью под тонким слоем шоколада.')
];
sweets[4].images = ['assets/nare-sweets.webp', 'assets/chocolates.webp']; sweets[5].new = true;
const equipmentRows = [
  ['automatic', 'AUTOMATIC ONE', 'Кофемашины', 64900, 'NARÉ Studio', 'Кофе одним касанием', { 'Мощность': '1450 Вт', 'Резервуар': '1,8 л', 'Напитки': 'Эспрессо / американо' }],
  ['espresso', 'BARISTA COPPER', 'Рожковые кофеварки', 42900, 'NARÉ Studio', 'Контроль каждой экстракции', { 'Рожок': '58 мм', 'Мощность': '1350 Вт', 'Паровая трубка': 'Есть' }],
  ['cezve', 'COPPER CEZVE', 'Турки', 3490, 'NARÉ Atelier', 'Медная турка для неспешного утра', { 'Объём': '250 мл', 'Материал': 'Медь, пищевое олово', 'Ручка': 'Дерево' }],
  ['moka', 'MOKA CLASSIC', 'Гейзерные кофеварки', 3990, 'NARÉ Studio', 'Насыщенный кофе на плите', { 'Порции': '3', 'Материал': 'Алюминий', 'Индукция': 'Нет' }],
  ['press', 'FRENCH PRESS', 'Френч-прессы', 2990, 'NARÉ Studio', 'Чистая форма, полный вкус', { 'Объём': '600 мл', 'Колба': 'Боросиликатное стекло' }],
  ['v60', 'POUR OVER 02', 'V60 / Pour Over', 2290, 'NARÉ Atelier', 'Раскройте цветочные ноты', { 'Размер': '02', 'Материал': 'Керамика', 'Порции': '1–4' }],
  ['grinder', 'HAND GRINDER', 'Кофемолки', 7990, 'NARÉ Studio', 'Свежий помол для каждого ритуала', { 'Жернова': 'Сталь, 38 мм', 'Вместимость': '25 г', 'Регулировка': '36 ступеней' }],
  ['scale', 'PRECISION SCALE', 'Весы', 4990, 'NARÉ Studio', 'Точность до десятой доли грамма', { 'Шаг': '0,1 г', 'Максимум': '2 кг', 'Таймер': 'Есть' }],
  ['kettle', 'SLOW POUR KETTLE', 'Чайники', 5990, 'NARÉ Studio', 'Тонкая струя, точный пролив', { 'Объём': '900 мл', 'Материал': 'Нержавеющая сталь', 'Нагрев': 'На плите' }],
  ['tamper', 'BARISTA TAMPER', 'Темперы', 2490, 'NARÉ Atelier', 'Ровная трамбовка кофейной таблетки', { 'Диаметр': '58 мм', 'Основание': 'Сталь', 'Ручка': 'Дерево' }],
  ['pitcher', 'MILK PITCHER', 'Питчеры', 1790, 'NARÉ Studio', 'Микропена и точный латте-арт', { 'Объём': '350 мл', 'Материал': 'Нержавеющая сталь' }],
  ['filters', 'PAPER FILTERS 02', 'Фильтры', 690, 'NARÉ Studio', 'Чистая чашка каждый день', { 'Размер': '02', 'Количество': '100 шт.', 'Материал': 'Бумага' }],
  ['cup', 'RITUAL CUP', 'Чашки', 1890, 'NARÉ Atelier', 'Чашка, которую хочется держать', { 'Объём': '90 мл', 'Материал': 'Керамика', 'Комплект': 'Чашка и блюдце' }],
  ['glass', 'DOUBLE WALL GLASS', 'Стаканы', 1490, 'NARÉ Studio', 'Тепло кофе в двойном стекле', { 'Объём': '250 мл', 'Материал': 'Боросиликатное стекло' }],
  ['knockbox', 'BARISTA KNOCK BOX', 'Аксессуары', 3290, 'NARÉ Studio', 'Порядок на кофейной станции', { 'Размер': '12 × 12 см', 'Материал': 'Сталь, силикон' }],
  ['care', 'COFFEE CARE KIT', 'Средства для ухода', 1290, 'NARÉ Studio', 'Забота о любимом оборудовании', { 'В наборе': 'Щётка, чистящий порошок 100 г', 'Назначение': 'Уход за кофейной группой' }]
];
const equipment = equipmentRows.map(([id, name, subcategory, price, brand, description, specifications], index) => ({ ...baseProduct(id, name, 'equipment', price), subcategory, equipmentType: subcategory, brand, description, specifications, images: ['assets/equipment-atlas.webp'], sprite: index, tags: [subcategory], featured: [2, 5, 6].includes(index), stock: index === 0 ? 0 : 12, new: index === 7 }));
const products = [...coffees, ...sweets, ...equipment];
const byId = new Map(products.map((p) => [p.id, p]));
const composition = (p) => p.arabicaPercentage === 100 ? '100% Arabica' : p.robustaPercentage === 100 ? '100% Robusta' : `${p.arabicaPercentage}% Arabica / ${p.robustaPercentage}% Robusta`;
const itemPrice = (p, weight) => p.category === 'coffee' ? p.variants.find((v) => v.weight === weight)?.price ?? p.price : p.price;
const weightLabel = (weight) => weight === 1000 ? '1 кг' : `${weight} г`;

function productVisual(p, large = false) {
  if (p.category === 'equipment') return `<div class="equipment-photo" role="img" aria-label="Иллюстрация: ${escapeHTML(p.name)}" style="--sprite-x:${p.sprite % 4 * 100 / 3}%;--sprite-y:${Math.floor(p.sprite / 4) * 100 / 3}%"></div>`;
  if (p.category === 'coffee' && !large) return `<div class="mini-pack ${['red', 'gold', 'wine'][coffees.indexOf(p) % 3]}" role="img" aria-label="Фирменная упаковка ${p.name}"><small>NARÉ</small><b>${p.name.split(' ')[0]}</b><i>№ ${String(coffees.indexOf(p) + 1).padStart(2, '0')}</i></div>`;
  return `<img class="product-photo ${p.category === 'sweets' && p.id === 'gift' ? 'box-photo' : ''}" src="${p.images[0]}" alt="${p.category === 'coffee' ? 'Иллюстрация фирменной упаковки кофе NARÉ' : p.id === 'gift' ? 'Фирменная коробка NARÉ SWEETS' : 'Иллюстрация ассорти конфет ручной работы'}" width="600" height="600" loading="lazy" decoding="async">`;
}
function productCard(p) {
  const details = p.category === 'coffee' ? `${p.origin} · ${p.roastLevel} обжарка` : p.category === 'sweets' ? p.subcategory : p.brand;
  const notes = p.category === 'coffee' ? p.tasteNotes.join(' · ') : p.category === 'sweets' ? p.flavors.join(' · ') : Object.entries(p.specifications).slice(0, 2).map(([k, v]) => `${k}: ${v}`).join(' · ');
  return `<article class="product" data-product="${p.id}">${p.new ? '<span class="tag">Новинка</span>' : p.id === 'ethiopia' ? '<span class="tag">Бестселлер</span>' : ''}<button class="product-image-button" data-quick="${p.id}" aria-label="Подробнее о ${p.name}">${productVisual(p)}</button><div class="product-info"><p>${details}</p><h3><button class="product-title" data-quick="${p.id}">${p.name}</button></h3>${p.subtitle ? `<p class="lot-name">${p.subtitle}</p>` : ''}<span>${notes}</span><p class="product-description">${p.category === 'coffee' ? composition(p) : p.description}</p><p class="product-meta">${p.category === 'coffee' ? '250 г · В зернах' : p.category === 'sweets' ? `${p.pieces} конфет · ${p.netWeight} г` : '1 шт.'} · ${p.stock ? 'В наличии' : 'Нет в наличии'}</p><button class="quick-link" data-quick="${p.id}">${p.category === 'coffee' ? 'Выбрать вес и помол' : p.category === 'sweets' ? 'Состав и подробности' : 'Характеристики и детали'} <span>↗</span></button>${p.category !== 'coffee' ? `<label class="field card-quantity">Количество<input type="number" min="1" max="${Math.max(1, p.stock)}" step="1" value="1" aria-label="Количество ${p.name}" ${p.stock ? '' : 'disabled'}></label>` : ''}<div><b>${money(p.price)}</b><button class="add" data-add="${p.id}" ${p.stock ? '' : 'disabled'}>${p.stock ? 'В корзину +' : 'Недоступно'}</button></div></div></article>`;
}
function renderProducts(root, items) { root.innerHTML = items.map(productCard).join(''); }
renderProducts($('#featured-coffee'), coffees.filter((p) => p.featured));
renderProducts($('#featured-equipment'), equipment.filter((p) => p.featured));

// Hash routes preserve the original one-file static hosting architecture.
const pageRoutes = { coffee: 'coffee', sweets: 'sweets', 'sweets-products': 'sweets', 'equipment-catalog': 'equipment', fortune: 'fortune' };
const pageTitles = { home: 'NARÉ — кофе как искусство', coffee: 'Кофе — NARÉ', sweets: 'NARÉ SWEETS — конфеты ручной работы', equipment: 'Оборудование — NARÉ', fortune: 'Гадание на кофейной гуще — NARÉ' };
const menu = $('.menu'); const nav = $('.nav');
function closeMenu() { nav.classList.remove('mobile-open'); menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Открыть меню'); }
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; nav.classList.toggle('mobile-open', open); menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню'); });
function route() {
  const hash = location.hash.slice(1) || 'top'; const page = pageRoutes[hash] || 'home';
  $$('[data-page]').forEach((node) => { node.hidden = node.dataset.page !== page; });
  document.title = pageTitles[page];
  $$('.nav a').forEach((a) => { const active = a.hash === `#${hash}` || (page === 'home' && hash === 'collection' && a.hash === '#coffee'); if (active) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  closeMenu();
  requestAnimationFrame(() => {
    const target = pageRoutes[hash] && hash !== 'sweets-products' ? $(`[data-page="${page}"]`) : document.getElementById(hash) || $(`[data-page="${page}"]`);
    target?.scrollIntoView({ block: 'start', behavior: 'instant' });
    if (page !== 'home') { const heading = $('h1', $(`[data-page="${page}"]`)); heading.setAttribute('tabindex', '-1'); heading.focus({ preventScroll: true }); }
  });
}
window.addEventListener('hashchange', route);
nav.addEventListener('click', (event) => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && nav.classList.contains('mobile-open')) { closeMenu(); menu.focus(); } });
$('.icon-button').addEventListener('click', () => { location.hash = 'coffee'; requestAnimationFrame(() => $('#coffee-search').focus()); });

// Every filter is applied client-side against the same normalized records.
const filterDefs = {
  coffee: [['beanType', 'Тип зерна'], ['composition', 'Состав'], ['origin', 'Страна'], ['roastLevel', 'Обжарка'], ['brewMethods', 'Приготовление'], ['tasteNotes', 'Вкусовые ноты'], ['tags', 'Коллекция']],
  sweets: [['subcategory', 'Категория'], ['flavors', 'Вкус']],
  equipment: [['subcategory', 'Категория'], ['brand', 'Бренд'], ['availability', 'Наличие']]
};
function filterValues(p, key) {
  if (key === 'composition') return [composition(p)];
  if (key === 'origin') return p.origin.split(' / ');
  if (key === 'availability') return [p.stock ? 'В наличии' : 'Нет в наличии'];
  return Array.isArray(p[key]) ? p[key] : [p[key]];
}
$$('.catalog').forEach((catalog) => {
  const category = catalog.dataset.category; const items = products.filter((p) => p.category === category);
  const max = Math.max(...items.map((p) => p.price));
  const selects = filterDefs[category].map(([key, label]) => {
    const values = [...new Set(items.flatMap((p) => filterValues(p, key)))];
    return `<label class="field">${label}<select name="${key}"><option value="">Все</option>${values.map((v) => `<option>${v}</option>`).join('')}</select></label>`;
  }).join('');
  catalog.innerHTML = `<form class="catalog-controls" role="search" aria-label="Поиск и фильтры: ${category === 'coffee' ? 'кофе' : category === 'sweets' ? 'конфеты' : 'оборудование'}"><div class="catalog-toolbar"><label class="field search-field">Поиск<input id="${category}-search" name="search" type="search" placeholder="Название, вкус или описание" autocomplete="off"></label><label class="field">Сортировка<select name="sort"><option value="popular">Популярные</option><option value="asc">Сначала дешевле</option><option value="desc">Сначала дороже</option><option value="new">Новинки</option></select></label></div><details class="filter-panel"><summary>Фильтры <span class="filter-count"></span></summary><div class="filter-fields">${selects}<label class="field">Цена от, ₽<input name="minPrice" type="number" min="0" step="1" placeholder="0"></label><label class="field">Цена до, ₽<input name="maxPrice" type="number" min="0" step="1" placeholder="${max}"></label></div></details><div class="filter-status"><p class="results-count" role="status"></p><button type="reset" class="quick-link">Сбросить фильтры</button></div><p class="active-filters"></p></form><div class="products catalog-products"></div><div class="empty-state" hidden><h3>Ничего не найдено</h3><p>Измените запрос или сбросьте фильтры.</p><button class="button outline" data-reset-catalog>Сбросить фильтры</button></div>`;
  const form = $('form', catalog);
  function update() {
    const data = Object.fromEntries(new FormData(form)); const query = data.search.trim().toLocaleLowerCase('ru');
    const minPrice = data.minPrice === '' ? 0 : Number(data.minPrice); const maxPrice = data.maxPrice === '' ? Infinity : Number(data.maxPrice);
    const result = items.filter((p) => {
      const searchable = [p.name, p.subtitle || '', p.description, p.subcategory, ...p.tags, ...(p.tasteNotes || []), ...(p.flavors || []), p.origin || '', p.brand || '', p.category === 'coffee' ? composition(p) : ''].join(' ').toLocaleLowerCase('ru');
      return searchable.includes(query) && p.price >= minPrice && p.price <= maxPrice && filterDefs[category].every(([key]) => !data[key] || filterValues(p, key).includes(data[key]));
    });
    result.sort((a, b) => data.sort === 'asc' ? a.price - b.price : data.sort === 'desc' ? b.price - a.price : data.sort === 'new' ? Number(b.new) - Number(a.new) : Number(b.featured) - Number(a.featured));
    renderProducts($('.catalog-products', catalog), result);
    $('.empty-state', catalog).hidden = !!result.length;
    $('.results-count', catalog).textContent = `Найдено: ${result.length} из ${items.length}${category === 'coffee' ? ' · цены за 250 г' : ''}`;
    const active = [...filterDefs[category].filter(([key]) => data[key]).map(([key, label]) => `${label}: ${data[key]}`), ...(query ? [`Поиск: ${data.search.trim()}`] : []), ...(data.minPrice ? [`От ${money(minPrice)}`] : []), ...(data.maxPrice ? [`До ${money(maxPrice)}`] : [])];
    $('.filter-count', catalog).textContent = active.length ? `(${active.length})` : '';
    $('.active-filters', catalog).textContent = active.length ? active.join(' · ') : 'Все товары';
  }
  form.addEventListener('submit', (event) => event.preventDefault());
  form.addEventListener('input', update); form.addEventListener('change', update);
  form.addEventListener('reset', () => requestAnimationFrame(update));
  $('[data-reset-catalog]', catalog).addEventListener('click', () => form.reset()); update();
});

let toastTimer;
function notify(message) { const dialogNotice = $('dialog[open] .dialog-notice'); if (dialogNotice) dialogNotice.textContent = message; const toast = $('.toast'); toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2200); }
const CART_KEY = 'nare-cart-v1';
let cart = [];
function normalizeCart(records) {
  if (!Array.isArray(records)) return [];
  const clean = [];
  for (const record of records.slice(0, 200)) {
    if (!record || typeof record !== 'object') continue;
    const p = byId.get(record.id); if (!p || !p.stock || !Number.isInteger(record.quantity) || record.quantity < 1) continue;
    const weight = p.category === 'coffee' && p.variants.some((v) => v.weight === record.weight) ? record.weight : p.category === 'coffee' ? 250 : null;
    const grind = p.category === 'coffee' && GRINDS.includes(record.grind) ? record.grind : p.category === 'coffee' ? GRINDS[0] : null;
    const used = clean.filter((i) => i.id === p.id).reduce((n, i) => n + i.quantity, 0);
    const quantity = Math.min(record.quantity, p.stock - used); if (quantity <= 0) continue;
    const existing = clean.find((i) => i.id === p.id && i.weight === weight && i.grind === grind);
    if (existing) existing.quantity += quantity; else clean.push({ id: p.id, weight, grind, quantity });
  }
  return clean;
}
try { cart = normalizeCart(JSON.parse(localStorage.getItem(CART_KEY) || '[]')); } catch { cart = []; }
function cartTotal() { return cart.reduce((sum, i) => sum + itemPrice(byId.get(i.id), i.weight) * i.quantity, 0); }
function saveCart() { try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch { /* Purchases remain usable in this tab when storage is unavailable. */ } renderCart(); }
function addItems(items, button) {
  const requested = new Map();
  for (const i of items) {
    const p = byId.get(i.id);
    if (!p || !Number.isInteger(i.quantity) || i.quantity < 1) { notify('Укажите целое количество от 1.'); return false; }
    requested.set(i.id, (requested.get(i.id) || 0) + i.quantity);
    const current = cart.filter((r) => r.id === i.id).reduce((n, r) => n + r.quantity, 0);
    if (current + requested.get(i.id) > p.stock) { notify(`Доступно всего ${p.stock} шт. ${p.name}, включая товары в корзине.`); return false; }
  }
  for (const i of items) {
    const existing = cart.find((r) => r.id === i.id && r.weight === i.weight && r.grind === i.grind);
    if (existing) existing.quantity += i.quantity; else cart.push({ ...i });
  }
  saveCart(); notify(items.length > 1 ? 'Кофе и конфеты добавлены в корзину' : 'Добавлено в корзину');
  if (button) { const label = button.textContent; button.textContent = 'Добавлено ✓'; button.disabled = true; setTimeout(() => { if (button.isConnected) { button.textContent = label; button.disabled = false; } }, 1000); }
  return true;
}
function defaultLine(id, quantity = 1) { const p = byId.get(id); return { id, quantity, weight: p.category === 'coffee' ? 250 : null, grind: p.category === 'coffee' ? GRINDS[0] : null }; }
function renderCart() {
  const count = cart.reduce((sum, i) => sum + i.quantity, 0);
  $('.cart span').textContent = count; $('.cart').setAttribute('aria-label', `Корзина, товаров: ${count}`);
  $('#cart-total').textContent = money(cartTotal());
  $('#checkout-button').disabled = !cart.length;
  if (!cart.length) $('#checkout-form').hidden = true;
  $('#cart-items').innerHTML = cart.length ? cart.map((i, index) => {
    const p = byId.get(i.id); const total = cart.filter((r) => r.id === i.id).reduce((s, r) => s + r.quantity, 0);
    return `<article class="cart-item">${productVisual(p, true)}<div><h3>${p.name}</h3><p>${i.weight ? `${weightLabel(i.weight)} · ${i.grind}` : p.category === 'sweets' ? `${p.pieces} конфет · ${p.netWeight} г` : p.subcategory}</p><p>${money(itemPrice(p, i.weight))} / шт.</p><div class="quantity"><button data-cart-minus="${index}" aria-label="Уменьшить количество ${p.name}">−</button><output aria-label="Количество ${p.name}">${i.quantity}</output><button data-cart-plus="${index}" aria-label="Увеличить количество ${p.name}" ${total >= p.stock ? 'disabled' : ''}>+</button></div><button class="quick-link" data-cart-remove="${index}" aria-label="Удалить ${p.name}">Удалить</button><strong>${money(itemPrice(p, i.weight) * i.quantity)}</strong></div></article>`;
  }).join('') : '<div class="empty-state"><h3>Ваша корзина пока пуста</h3><p>Начните с кофе, сладостей или инструмента для любимого ритуала.</p><button class="button outline" data-shop>Выбрать кофе</button></div>';
}
const sideCart = $('#side-cart'); const quickView = $('#quick-view');
function openDialog(dialog) { $$('dialog[open]').forEach((d) => d.close()); $('.dialog-notice', dialog).textContent = ''; dialog.showModal(); document.body.classList.add('dialog-open'); }
$$('dialog').forEach((dialog) => {
  dialog.addEventListener('close', () => { if (!$('dialog[open]')) document.body.classList.remove('dialog-open'); });
  dialog.addEventListener('click', (event) => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
});
$('.cart').addEventListener('click', () => { closeMenu(); renderCart(); openDialog(sideCart); });
function tasteProfile(p) {
  return `<div class="taste-profile">${[['Шоколад', p.tasteProfile[0]], ['Орехи', p.tasteProfile[1]], ['Карамель', p.tasteProfile[2]], ['Кислотность', p.acidity], ['Крепость вкуса', p.strength]].map(([name, n]) => `<div><span>${name}</span><span class="taste-dots" aria-label="${n} из 5"><span aria-hidden="true">${'●'.repeat(n)}<i>${'○'.repeat(5 - n)}</i></span></span></div>`).join('')}</div>`;
}
function quickOpen(id) {
  const p = byId.get(id); if (!p) return;
  const details = p.category === 'coffee' ? `<p>${composition(p)} · ${p.origin} · ${p.roastLevel} обжарка</p><p>${p.tasteNotes.join(' · ')}</p><p>Приготовление: ${p.brewMethods.join(', ')}</p>${tasteProfile(p)}` : p.category === 'sweets' ? `<p>Вкус: ${p.flavors.join(', ')}</p><p>Состав: ${p.ingredients.join(', ')}.</p><p>${p.pieces} конфет · ${p.netWeight} г</p><p>Аллергены: молоко; в зависимости от набора — орехи и соя. Возможны следы других орехов. Демонстрационный состав.</p>` : `<dl class="specifications">${Object.entries(p.specifications).map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl><p>Бренд: ${p.brand}. Демонстрационная модель.</p>`;
  $('#quick-content').innerHTML = `<div class="quick-layout"><div class="product-gallery"><div id="gallery-main">${productVisual(p, true)}</div>${p.category === 'sweets' ? `<div class="gallery-thumbs">${p.images.map((src, index) => `<button data-gallery="${index}" aria-label="${index ? 'Второе изображение' : 'Основное изображение'}" aria-pressed="${index === 0}"><img src="${src}" alt="${src.includes('nare-sweets') ? 'Фирменная коробка' : 'Иллюстрация конфет'}" width="80" height="80" loading="lazy"></button>`).join('')}</div>` : ''}<small> ${p.category === 'coffee' ? 'Иллюстрация фирменной упаковки. Название выбранного лота указано справа.' : p.category === 'equipment' ? 'Иллюстрация демонстрационного оборудования.' : 'Упаковка NARÉ SWEETS и иллюстрация ассорти.'}</small></div><div><p class="eyebrow">${p.category === 'sweets' ? 'NARÉ SWEETS' : 'Коллекция NARÉ'}</p><h2 id="quick-title">${p.name}</h2><p class="quick-description">${p.description}</p><div class="quick-details">${details}</div><form id="quick-form" data-id="${p.id}">${p.category === 'coffee' ? `<fieldset class="weight-selector"><legend>Вес</legend>${p.variants.map((v, i) => `<label class="choice"><input type="radio" name="weight" value="${v.weight}" ${!i ? 'checked' : ''}><span>${weightLabel(v.weight)}</span></label>`).join('')}</fieldset><label class="field">Помол<select name="grind">${p.grindOptions.map((g) => `<option>${g}</option>`).join('')}</select></label>` : ''}<p>${p.stock ? `В наличии: ${p.stock} шт.` : 'Нет в наличии'}</p><label class="field">Количество<input type="number" name="quantity" min="1" max="${Math.max(1, p.stock)}" value="1" step="1" required ${p.stock ? '' : 'disabled'}></label><p class="quick-price"><strong>${money(p.price)}</strong><small>за выбранную упаковку / 1 шт.</small></p><button class="button" type="submit" ${p.stock ? '' : 'disabled'}>${p.stock ? 'В корзину +' : 'Нет в наличии'}</button></form></div></div>`;
  const form = $('#quick-form');
  form.addEventListener('change', () => { $('.quick-price strong', form).textContent = money(itemPrice(p, Number(new FormData(form).get('weight')))); });
  form.addEventListener('submit', (event) => {
    event.preventDefault(); const data = new FormData(form);
    addItems([{ id, weight: p.category === 'coffee' ? Number(data.get('weight')) : null, grind: p.category === 'coffee' ? data.get('grind') : null, quantity: Number(data.get('quantity')) }], $('button[type="submit"]', form));
  });
  $$('.gallery-thumbs button').forEach((button) => button.addEventListener('click', () => {
    const src = p.images[Number(button.dataset.gallery)]; $('#gallery-main').innerHTML = `<img class="product-photo box-photo" src="${src}" alt="${src.includes('nare-sweets') ? 'Фирменная упаковка NARÉ SWEETS' : 'Иллюстрация ассорти конфет'}" width="600" height="600">`;
    $$('.gallery-thumbs button').forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
  }));
  openDialog(quickView);
}
document.addEventListener('click', (event) => {
  const button = event.target.closest('button'); if (!button) return;
  if (button.hasAttribute('data-close')) button.closest('dialog').close();
  if (button.dataset.quick) quickOpen(button.dataset.quick);
  if (button.dataset.add) {
    const input = $('input[type="number"]', button.closest('.product'));
    if (input && !input.reportValidity()) return;
    addItems([defaultLine(button.dataset.add, input ? Number(input.value) : 1)], button);
  }
  const action = ['cartPlus', 'cartMinus', 'cartRemove'].find((key) => button.dataset[key] !== undefined);
  if (action) {
    const index = Number(button.dataset[action]); const line = cart[index]; if (!line) return;
    if (action === 'cartPlus') { const p = byId.get(line.id); if (cart.filter((i) => i.id === line.id).reduce((sum, i) => sum + i.quantity, 0) >= p.stock) return; line.quantity++; }
    else if (action === 'cartMinus' && line.quantity > 1) line.quantity--; else cart.splice(index, 1);
    saveCart(); notify('Корзина обновлена');
    const buttons = $$(`[data-cart-${action === 'cartPlus' ? 'plus' : action === 'cartMinus' ? 'minus' : 'remove'}]`, sideCart);
    (buttons[Math.min(index, buttons.length - 1)] || $('[data-close]', sideCart)).focus();
  }
  if (button.hasAttribute('data-shop')) { sideCart.close(); location.hash = 'coffee'; }
});
window.addEventListener('storage', (event) => { if (event.key !== CART_KEY) return; try { cart = normalizeCart(JSON.parse(event.newValue || '[]')); renderCart(); } catch { /* Ignore malformed cross-tab data. */ } });
$('#checkout-button').addEventListener('click', () => { $('#checkout-form').hidden = false; $('#checkout-form h3').focus(); });
$('#checkout-form').addEventListener('submit', (event) => {
  event.preventDefault(); if (!cart.length) return;
  const data = new FormData(event.currentTarget);
  const content = ['NARÉ — заявка (не отправлена, не оплачена)', `Дата: ${new Date().toLocaleDateString('ru-RU')}`, `Имя: ${data.get('customer') || 'Не указано'}`, '', ...cart.map((i) => { const p = byId.get(i.id); return `${p.name}${i.weight ? ` / ${weightLabel(i.weight)} / ${i.grind}` : ''} × ${i.quantity} — ${money(itemPrice(p, i.weight) * i.quantity)}`; }), '', `Итого: ${money(cartTotal())}, без доставки`, `Комментарий: ${data.get('comment') || 'Нет'}`, '', 'Демонстрационный ассортимент. Цены, наличие, доставку и состав уточните у менеджера.'].join('\n');
  const url = URL.createObjectURL(new Blob(['\uFEFF' + content], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a'); link.href = url; link.download = 'nare-request.txt'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  notify('Заявка скачана. Заказ не отправлен.');
});

// Recommendation weights directly use flavor, brewing-method and strength records.
const quizTasteMap = { 'Шоколадный': ['Шоколад', 'Какао', 'Тёмный шоколад'], 'Ореховый': ['Орехи'], 'Фруктовый': ['Фрукты', 'Цитрус', 'Вишня'], 'Карамельный': ['Карамель'], 'Насыщенный': ['Какао', 'Тёмный шоколад'] };
function radioChoices(root, name, values) { root.innerHTML = values.map((value) => `<label class="choice"><input type="radio" name="${name}" value="${value}" required><span>${value}</span></label>`).join(''); }
radioChoices($('#quiz-tastes'), 'taste', Object.keys(quizTasteMap)); radioChoices($('#quiz-methods'), 'method', METHODS); radioChoices($('#quiz-strength'), 'strength', ['Мягкую', 'Среднюю', 'Крепкую']);
function recommendCoffee(taste, method, strength) {
  const target = { 'Мягкую': 1.5, 'Среднюю': 3, 'Крепкую': 5 }[strength];
  return coffees.filter((p) => p.stock).map((p) => ({ p, score: (p.brewMethods.includes(method) ? 6 : 0) + (p.tasteNotes.some((n) => quizTasteMap[taste].includes(n)) ? 5 : 0) + Math.max(0, 4 - Math.abs(p.strength - target) * 2) })).sort((a, b) => b.score - a.score).slice(0, 3).map(({ p }) => p);
}
$('#coffee-quiz').addEventListener('submit', (event) => {
  event.preventDefault(); const data = Object.fromEntries(new FormData(event.currentTarget));
  renderProducts($('#quiz-results .products'), recommendCoffee(data.taste, data.method, data.strength));
  $('#quiz-explanation').textContent = `Подбор по вкусу «${data.taste.toLowerCase()}», способу «${data.method}» и крепости. Сначала учитываем способ приготовления, затем вкусовые ноты и близость крепости — показываем три ближайших сочетания.`;
  $('#quiz-results').hidden = false; $('#quiz-results h3').focus();
});
$('#coffee-quiz').addEventListener('reset', () => { $('#quiz-results').hidden = true; });
$('#coffee-quiz').addEventListener('change', () => { $('#quiz-results').hidden = true; });
const pairings = {
  brazil: ['praline', 'Шоколадно-ореховый профиль Brazil Santos хорошо сочетается с насыщенным кофейным пралине.'],
  ethiopia: ['truffles', 'Цветочные и цитрусовые ноты Ethiopia Arabica оттеняют глубокий вкус тёмного шоколада.'],
  colombia: ['truffles', 'Вишня и какао El Diviso раскрываются рядом с нежной текстурой шоколадного трюфеля.'],
  crema: ['praline', 'Плотный шоколадный вкус Espresso Crema поддерживает кофейное пралине.'],
  italian: ['caramel', 'Тёмная обжарка Italian Dark создаёт контраст со сливочной солёной карамелью.'],
  robusta: ['praline', 'Насыщенность Robusta Intenso уравновешивает сладкое ореховое пралине.'],
  decaf: ['caramel', 'Мягкие карамельные ноты Decaf Colombia продолжаются в сливочной начинке конфет.'],
  ritual: ['pistachio', 'Ореховый профиль Ritual Blend перекликается с нежной фисташковой начинкой.']
};
$('#pairing-coffee').innerHTML = coffees.map((p) => `<option value="${p.id}" ${p.id === 'brazil' ? 'selected' : ''}>${p.name}</option>`).join('');
function renderPairing() {
  const id = $('#pairing-coffee').value; const p = byId.get(id); const [sweetId, explanation] = pairings[id]; const s = byId.get(sweetId);
  $('#pairing-result').innerHTML = `<div class="products pair-products">${productCard(p)}${productCard(s)}</div><p class="pair-explanation" role="status">${explanation}</p><p class="pair-price">250 г · В зернах + ${s.pieces} конфет · ${s.netWeight} г <b>${money(p.price + s.price)}</b></p><button class="button" id="add-pair">Добавить пару в корзину <span>+</span></button>`;
  $('#add-pair').addEventListener('click', (event) => addItems([defaultLine(id), defaultLine(sweetId)], event.currentTarget));
}
$('#pairing-coffee').addEventListener('change', renderPairing);
renderPairing(); renderCart(); route();

// Observe only selected section headings, never the static fortune page.
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.15 });
  $$('.quiz-section>h2, .sweets-banner h2, #pairing>h2').forEach((heading) => { heading.classList.add('scroll-reveal'); observer.observe(heading); });
}
