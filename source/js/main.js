'use strict';

(function () {
  // ----------------модалка-----------------
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

  // -----отправка формы и открытие окна успешной отправки------
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

  // отправка формы из блока "хочу поехать"
  var wishForm = document.querySelector('.wish-to-go__form');
  var wishPhone = wishForm.querySelector('[name=tel]');

  wishForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    upload(new FormData(wishForm), uploadSuccessHandler);
    scrollOff();
    if (isStorageSupport) {
      localStorage.setItem('wishPhone', wishPhone.value);
    }
    wishForm.reset();
  });

  // отправка формы из блока подробностей
  var contactsForm = document.querySelector('.contacts__form');
  var contactsName = contactsForm.querySelector('[name=name]');
  var contactsPhone = contactsForm.querySelector('[name=tel]');
  contactsForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    upload(new FormData(contactsForm), uploadSuccessHandler);
    scrollOff();
    if (isStorageSupport) {
      localStorage.setItem('contactsPhone', contactsPhone.value);
      localStorage.setItem('ncontactsName', contactsName.value);
    }
    contactsForm.reset();
  });

  // ---------------табы------------------
  var tabButtons = document.querySelectorAll('.program__tab-item');
  var tabsHandler = function (evt) {
    evt.preventDefault();
    var link = evt.currentTarget.querySelector('a');
    var tab = document.querySelector(link.getAttribute('href'));
    var activeTab = document.querySelector('.program__tab-item--active');

    activeTab.classList.remove('program__tab-item--active');
    document.querySelector('.program__content-item--active')
        .classList.remove('program__content-item--active');

    evt.currentTarget.classList.add('program__tab-item--active');
    tab.classList.add('program__content-item--active');
  };

  for (var i = 0; i < tabButtons.length; i++) {
    tabButtons[i].addEventListener('click', tabsHandler);
  }

  // ---------------слайдер--------------------
  var slideShow = (function () {
    return function (selector, config) {
      var slider = document.querySelector(selector);
      var sliderContainer = slider.querySelector('.slider__items');
      var sliderItems = slider.querySelectorAll('.slider__item');
      var sliderControls = slider.querySelectorAll('.slider__control');
      var currentPosition = 0; // позиция левого активного элемента
      var transformValue = 0; // значение транфсофрмации .slider_wrapper
      var transformStep = 100; // величина шага (для трансформации)
      var itemsArray = []; // массив элементов
      var timerId;
      var indicatorItems;
      var indicatorIndex = 0;
      var indicatorIndexMax = sliderItems.length - 1;
      var stepTouch = 50;
      var _config = {
        isAutoplay: false, // автоматическая смена слайдов
        directionAutoplay: 'next', // направление смены слайдов
        delayAutoplay: 5000, // интервал между автоматической сменой слайдов
        isPauseOnHover: true // устанавливать ли паузу при поднесении курсора к слайдеру
      };

      // настройка конфигурации слайдера в зависимости от полученных ключей
      for (var key in config) {
        if (key in _config) {
          _config[key] = config[key];
        }
      }

      // наполнение массива _itemsArray
      for (var n = 0; n < sliderItems.length; n++) {
        itemsArray.push({item: sliderItems[n], position: n, transform: 0});
      }

      // переменная position содержит методы, с помощью которой можно получить минимальный и максимальный индекс элемента, а также соответствующему этому индексу позицию
      var position = {
        getItemIndex: function (mode) {
          var index = 0;
          for (var j = 0; j < itemsArray.length; j++) {
            if ((itemsArray[j].position < itemsArray[index].position && mode === 'min') || (itemsArray[j].position > itemsArray[index].position && mode === 'max')) {
              index = j;
            }
          }
          return index;
        },
        getItemPosition: function (mode) {
          return itemsArray[position.getItemIndex(mode)].position;
        }
      };

      // функция, выполняющая смену слайда в указанном направлении
      var move = function (direction) {
        var nextItem;
        var currentIndicator = indicatorIndex;
        if (direction === 'next') {
          currentPosition++;
          if (currentPosition > position.getItemPosition('max')) {
            nextItem = position.getItemIndex('min');
            itemsArray[nextItem].position = position.getItemPosition('max') + 1;
            itemsArray[nextItem].transform += itemsArray.length * 100;
            itemsArray[nextItem].item.style.transform = 'translateX(' + itemsArray[nextItem].transform + '%)';
          }
          transformValue -= transformStep;
          indicatorIndex = indicatorIndex + 1;
          if (indicatorIndex > indicatorIndexMax) {
            indicatorIndex = 0;
          }
        } else {
          currentPosition--;
          if (currentPosition < position.getItemPosition('min')) {
            nextItem = position.getItemIndex('max');
            itemsArray[nextItem].position = position.getItemPosition('min') - 1;
            itemsArray[nextItem].transform -= itemsArray.length * 100;
            itemsArray[nextItem].item.style.transform = 'translateX(' + itemsArray[nextItem].transform + '%)';
          }
          transformValue += transformStep;
          indicatorIndex = indicatorIndex - 1;
          if (indicatorIndex < 0) {
            indicatorIndex = indicatorIndexMax;
          }
        }
        sliderContainer.style.transform = 'translateX(' + transformValue + '%)';
        indicatorItems[currentIndicator].classList.remove('active');
        indicatorItems[indicatorIndex].classList.add('active');
      };

      // функция, осуществляющая переход к слайду по его порядковому номеру
      var moveTo = function (index) {
        var k = 0;
        var direction = (index > indicatorIndex) ? 'next' : 'prev';
        while (index !== indicatorIndex && k <= indicatorIndexMax) {
          move(direction);
          k++;
        }
      };

      // функция для запуска автоматической смены слайдов через промежутки времени
      var startAutoplay = function () {
        if (!_config.isAutoplay) {
          return;
        }
        stopAutoplay();
        timerId = setInterval(function () {
          move(_config.directionAutoplay);
        }, _config.delayAutoplay);
      };

      // функция, отключающая автоматическую смену слайдов
      var stopAutoplay = function () {
        clearInterval(timerId);
      };

      // функция, добавляющая индикаторы к слайдеру
      var addIndicators = function () {
        var indicatorsContainer = document.createElement('ol');
        indicatorsContainer.classList.add('slider__indicators');
        for (var l = 0; l < sliderItems.length; l++) {
          var sliderIndicatorsItem = document.createElement('li');
          if (l === 0) {
            sliderIndicatorsItem.classList.add('active');
          }
          sliderIndicatorsItem.setAttribute('data-slide-to', l);
          indicatorsContainer.appendChild(sliderIndicatorsItem);
        }
        slider.appendChild(indicatorsContainer);
        indicatorItems = slider.querySelectorAll('.slider__indicators > li');
      };

      var isTouchDevice = function () {
        return !!('ontouchstart' in window || navigator.maxTouchPoints);
      };

      // функция, осуществляющая установку обработчиков для событий
      var setUpListeners = function () {
        var startX = 0;
        if (isTouchDevice()) {
          slider.addEventListener('touchstart', function (evt) {
            startX = evt.changedTouches[0].clientX;
            startAutoplay();
          });
          slider.addEventListener('touchend', function (evt) {
            var endX = evt.changedTouches[0].clientX;
            var deltaX = endX - startX;
            if (deltaX > stepTouch) {
              move('prev');
            } else if (deltaX < -stepTouch) {
              move('next');
            }
            startAutoplay();
          });
        } else {
          for (var t = 0; t < sliderControls.length; t++) {
            sliderControls[t].classList.add('slider__control_show');
          }
        }
        slider.addEventListener('click', function (evt) {
          if (evt.target.classList.contains('slider__control')) {
            evt.preventDefault();
            move(evt.target.classList.contains('slider__control_next') ? 'next' : 'prev');
            startAutoplay();
          } else
          if (evt.target.getAttribute('data-slide-to')) {
            evt.preventDefault();
            moveTo(parseInt(evt.target.getAttribute('data-slide-to'), 10));
            startAutoplay();
          }
        });
        document.addEventListener('visibilitychange', function () {
          if (document.visibilityState === 'hidden') {
            stopAutoplay();
          } else {
            startAutoplay();
          }
        }, false);
        if (_config.isPauseOnHover && _config.isAutoplay) {
          slider.addEventListener('mouseenter', function () {
            stopAutoplay();
          });
          slider.addEventListener('mouseleave', function () {
            startAutoplay();
          });
        }
      };

      // добавляем индикаторы к слайдеру
      addIndicators();
      // установливаем обработчики для событий
      setUpListeners();
      // запускаем автоматическую смену слайдов, если установлен соответствующий ключ
      startAutoplay();

      return {
        // метод слайдера для перехода к следующему слайду
        next: function () {
          move('next');
        },
        // метод слайдера для перехода к предыдущему слайду
        left: function () {
          move('prev');
        },
        // метод отключающий автоматическую смену слайдов
        stop: function () {
          _config.isAutoplay = false;
          stopAutoplay();
        },
        // метод запускающий автоматическую смену слайдов
        cycle: function () {
          config.isAutoplay = true;
          startAutoplay();
        }
      };
    };
  }());

  var removeIndicators = function (selector) {
    var slider = document.querySelector(selector);
    var indicatorsContainer = slider.querySelector('.slider__indicators');
    if (indicatorsContainer) {
      indicatorsContainer.parentNode.removeChild(indicatorsContainer);
    }
  };

  var mediaQuery = window.matchMedia('(max-width: 1023px)');

  // функция активирует слайдер или удаляет индикаторы при ресайзе окна
  var sliderLife = function () {
    if (mediaQuery.matches) {
      removeIndicators('.life__slider');
      slideShow('.life__slider', {
        isAutoplay: false
      });
    } else {
      removeIndicators('.life__slider');
    }
  };

  sliderLife();
  window.addEventListener('resize', sliderLife);

  var sliderReviews = function () {
    slideShow('.reviews__slider', {
      isAutoplay: false
    });
    removeIndicators('.reviews__slider');
  };

  sliderReviews();

  // -------------аккордеон---------------------

  var accordion = document.querySelector('.faq__list');
  var accordionQuestions = accordion.querySelectorAll('.faq__question');

  var accordionCallback = function (evt) {
    var parent = evt.target.parentElement;
    parent.classList.toggle('faq__item--active');
  };

  if (accordion) {
    accordion.classList.remove('faq__list--no-js');

    for (var j = 0; j < accordionQuestions.length; j++) {
      var item = accordionQuestions[j];
      item.addEventListener('click', accordionCallback);
    }
  }

  // Отключение табов на неактивных отзывах
  var tabIndexOff = function (element) {
    element.setAttribute('tabindex', '-1');
  };

  var tabIndexOn = function (element) {
    element.removeAttribute('tabindex', '-1');
  };

  var observerSettings = {
    root: document.querySelector('.reviews__slider-wrapper'),
    threshold: 1.0
  };
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach((function (entry) {
        if (!entry.isIntersecting) {
          return;
        } else {
          setVisible(entry.target);
        }
      }));
    }, observerSettings);

    var setVisible = function (section) {
      var visible = document.querySelector('.visible');
      if (visible) {
        visible.classList.remove('visible');
        visible.querySelectorAll('a').forEach(function (link) {
          tabIndexOff(link);
        });
        visible.querySelectorAll('button').forEach(function (button) {
          tabIndexOff(button);
        });
      }
      section.classList.add('visible');
      section.querySelectorAll('a').forEach(function (link) {
        tabIndexOn(link);
      });
      section.querySelectorAll('button').forEach(function (button) {
        tabIndexOn(button);
      });
    };

    var slides = document.querySelectorAll('.reviews__wrapper');
    slides.forEach(function (slide) {
      observer.observe(slide);
    });
  }
})();
