'use strict';

(function () {
  // модалка
  var modalOpenButton = document.querySelector('.page-header__item--modal');
  var modalCallbackOverlay = document.querySelector('.modal__call');
  var modalSuccessOverlay = document.querySelector('.modal__success');
  var modalCallbackWindow = modalCallbackOverlay.querySelector('.modal__wrapper--form');
  var modalSuccessWindow = modalSuccessOverlay.querySelector('.modal__wrapper--success');
  var modalCallbackClose = modalCallbackWindow.querySelector('.modal__toggle');
  var modalSuccessClose = modalSuccessWindow.querySelector('.modal__toggle');
  var modalSuccessButton = modalSuccessWindow.querySelector('.modal__button');
  var body = document.querySelector('body');

  // функция закрытия модалок
  var closeModal = function (modal) {
    modal.classList.remove('modal--open');
    document.removeEventListener('keydown', popupEscPressHandler);
  };

  // функция открытия модалок
  var openModal = function (modal) {
    modal.classList.add('modal--open');
    document.addEventListener('keydown', popupEscPressHandler);
  };

  // функция отключения скролла под модалкой
  var scrollOff = function () {
    body.classList.add('modal__scroll-hidden');
  };

  // функция включения скролла
  var scrollOn = function () {
    body.classList.remove('modal__scroll-hidden');
  };

  // обработчик нажатия Esc
  var popupEscPressHandler = function (evt) {
    if (evt.keyCode === 27) {
      evt.preventDefault();
      scrollOn();
      if (modalCallbackOverlay.classList.contains('modal--open')) {
        closeModal(modalCallbackOverlay);
      } else if (modalSuccessOverlay.classList.contains('modal--open')) {
        closeModal(modalSuccessOverlay);
      }
    }
  };

  var onlyOverlayClick = function (evt) {
    evt.stopPropagation();
    evt.stopImmediatePropagation();
  };

  modalCallbackWindow.addEventListener('click', function (evt) {
    onlyOverlayClick(evt);
  });

  modalSuccessWindow.addEventListener('click', function (evt) {
    onlyOverlayClick(evt);
  });

  // модалка с формой открывается
  modalOpenButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    openModal(modalCallbackOverlay);
    scrollOff();
  });

  // модалки закрываются по клику на оверлей
  modalCallbackOverlay.addEventListener('click', function () {
    closeModal(modalCallbackOverlay);
    scrollOn();
  });

  modalSuccessOverlay.addEventListener('click', function () {
    closeModal(modalSuccessOverlay);
    scrollOn();
  });

  // модалки закрываются по клику на крестик
  modalCallbackClose.addEventListener('click', function (evt) {
    evt.preventDefault();
    closeModal(modalCallbackOverlay);
    scrollOn();
  });

  modalSuccessClose.addEventListener('click', function (evt) {
    evt.preventDefault();
    closeModal(modalSuccessOverlay);
    scrollOn();
  });

  // отправка формы и открытие окна успешной отправки
  var modalForm = document.querySelector('.modal__form');
  var URL = 'https://echo.htmlacademy.ru';
  var name = modalForm.querySelector('[name=name]');
  var phone = modalForm.querySelector('[name=tel]');
  var isStorageSupport = true;

  var upload = function (data, successHandler) {
    var xhr = new XMLHttpRequest();

    xhr.addEventListener('load', function () {
      successHandler(xhr.response);
    });

    xhr.open('POST', URL);
    xhr.responseType = 'json';
    xhr.send(data);
  };

  // функция открытия сообщения об отправке
  var uploadSuccessHandler = function () {
    openModal(modalSuccessOverlay);
  };

  // отправка формы по клику на кнопку
  modalForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    upload(new FormData(modalForm), uploadSuccessHandler);
    if (isStorageSupport) {
      localStorage.setItem('phone', phone.value);
      localStorage.setItem('name', name.value);
    }
    modalForm.reset();
    closeModal(modalCallbackOverlay);
  });

  // модалка с сообщением закрывается по клику на баттон
  modalSuccessButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    closeModal(modalSuccessOverlay);
    scrollOn();
  });
})();
