const cartCount = document.querySelector('.cart span');
const toast = document.querySelector('.toast');
let count = 0;

document.querySelectorAll('.add').forEach((button) => {
  button.addEventListener('click', () => {
    count += 1;
    cartCount.textContent = count;
    button.textContent = 'Добавлено ✓';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 1800);
    setTimeout(() => button.textContent = 'Добавить +', 1800);
  });
});

const menu = document.querySelector('.menu');
menu.addEventListener('click', () => {
  document.querySelector('.nav').classList.toggle('mobile-open');
});
