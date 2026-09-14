// モーダルウィンドウの開閉
// モーダルを開く
const openModal = document.querySelectorAll('.open-modal');

openModal.forEach((button) => {

  const modalId = button.dataset.modal;
  const modal = document.getElementById(modalId);

  button.addEventListener('click', () => {
    modal.classList.add('active');
  });

  // モーダルを閉じる
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.classList.remove('active');
    }
  });
});


// ハンバーガーメニューの開閉
const menuButton = document.querySelector('.menu-button');
const menu = document.querySelector('.menu');
const menuIcon = document.querySelector('.material-symbols-outlined');

menuButton.addEventListener('click', () => {
  menu.classList.toggle('active');

  if (menu.classList.contains('active')) {
    menuIcon.textContent = 'close';
  } else {
    menuIcon.textContent = 'menu';
  }
});


// メニューをクリックしたらメニューを閉じる
const menuLinks = document.querySelectorAll('.menu a')

menuLinks.forEach((link) => {
  link.addEventListener('click', () => {
    menu.classList.remove('active');
    menuIcon.textContent = 'menu';
  });
});


// メニューの黒いところをクリックしても閉じる
menu.addEventListener('click', (event) => {
  if (event.target === menu) {
    menu.classList.remove('active');
    menuIcon.textContent = 'menu';
  }
});