// Подтверждение возраста 18+
const age = document.getElementById('age');
let adult = false;
try { adult = localStorage.getItem('smoking-18') === 'yes'; } catch (e) {}

function unlock() {
  age.classList.add('is-hidden');
  document.body.classList.remove('is-locked');
  setTimeout(() => { age.hidden = true; }, 400);
}
if (adult) unlock();
document.getElementById('ageYes').addEventListener('click', () => {
  try { localStorage.setItem('smoking-18', 'yes'); } catch (e) {}
  unlock();
});
document.getElementById('ageNo').addEventListener('click', () => {
  document.getElementById('ageDenied').hidden = false;
});

// Шапка и мобильная кнопка
const header = document.getElementById('header');
const mobileCta = document.querySelector('.mobile-cta');
const booking = document.getElementById('booking');
function onScroll() {
  header.classList.toggle('is-scrolled', window.scrollY > 40);
  const r = booking.getBoundingClientRect();
  mobileCta.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.7 && !(r.top < window.innerHeight && r.bottom > 0));
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Мобильное меню
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
burger.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  burger.setAttribute('aria-expanded', open);
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('is-open');
  burger.setAttribute('aria-expanded', 'false');
}));

// Часы работы на сегодня (Пт–Сб до 03:00)
const day = new Date().getDay();
document.getElementById('todayHours').textContent = (day === 5 || day === 6) ? '16:00 – 03:00' : '16:00 – 01:00';

// Появление блоков
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('is-visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 3) * 80}ms`;
  io.observe(el);
});

// Бронь: собираем текст, копируем и открываем диалог с группой ВК
const form = document.getElementById('bookingForm');
const hint = document.getElementById('formHint');
const dateInput = form.elements.date;
dateInput.min = new Date().toISOString().slice(0, 10);
dateInput.value = dateInput.min;

form.addEventListener('submit', async e => {
  e.preventDefault();
  let ok = true;
  form.querySelectorAll('[required]').forEach(f => {
    const bad = !f.value.trim();
    f.classList.toggle('is-invalid', bad);
    if (bad) ok = false;
  });
  if (!ok) return;

  const d = new Date(`${dateInput.value}T00:00`).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  const el = form.elements;
  const text = [
    `Здравствуйте! Хочу забронировать стол.`,
    `Имя: ${el.name.value.trim()}`,
    `Дата и время: ${d}, ${el.time.value}`,
    `Гостей: ${el.guests.value}`,
    `Где: ${el.zone.value}`,
    el.comment.value.trim() ? `Пожелания: ${el.comment.value.trim()}` : ''
  ].filter(Boolean).join('\n');

  try {
    await navigator.clipboard.writeText(text);
    hint.textContent = 'Текст брони скопирован — вставьте его в открывшийся диалог.';
  } catch (err) {
    hint.textContent = 'Не удалось скопировать — позвоните нам, и мы всё запишем.';
  }
  hint.classList.add('is-ok');
  window.open('https://vk.me/smokingnovoch', '_blank', 'noopener');
});

// Лайтбокс
const photos = [...document.querySelectorAll('#gallery-grid img, .veranda__thumbs img')];
const lightbox = document.getElementById('lightbox');
const lbImg = lightbox.querySelector('img');
let current = 0;
function showPhoto(i) {
  current = (i + photos.length) % photos.length;
  lbImg.src = photos[current].src;
  lbImg.alt = photos[current].alt;
}
function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = '';
}
photos.forEach((img, i) => img.addEventListener('click', () => {
  showPhoto(i);
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
}));
lightbox.querySelector('.lightbox__prev').addEventListener('click', () => showPhoto(current - 1));
lightbox.querySelector('.lightbox__next').addEventListener('click', () => showPhoto(current + 1));
lightbox.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => {
  if (lightbox.hidden) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showPhoto(current - 1);
  if (e.key === 'ArrowRight') showPhoto(current + 1);
});
