// чтобы было сообщение об ошидках в коде
"use strict";
// все перменные в начале
const cartButton = document.querySelector("#cart-button"),
  modal = document.querySelector(".modal"),
  close = document.querySelector(".close"),
  buttonAuth = document.querySelector(".button-auth"),
  modalAuth = document.querySelector(".modal-auth"),
  closeAuth = document.querySelector(".close-auth"),
  logInForm = document.querySelector("#logInForm"),
  loginInput = document.querySelector("#login"),
  userName = document.querySelector(".user-name"),
  buttonOut = document.querySelector(".button-out"),
  cardsRestaurants = document.querySelector(".cards-restaurants"),
  containerPromo = document.querySelector(".container-promo"),
  restaurants = document.querySelector(".restaurants"),
  menu = document.querySelector(".menu"),
  logo = document.querySelector(".logo"),
  cardsMenu = document.querySelector(".cards-menu");
// День 1 Логин сохраняется в local storage
let login = localStorage.getItem("gloDelivery");
// День 3 получить данные с сервера, запустить ошибку, если ответ false
const getData = async function (url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Ошибка по адрсу ${url}, 
    статус ошибки ${response.status}!`);
  }
  return await response.json();
};
// День 1 проверка валидности логина: не все цифры, меньше 20 символов
const valid = function (str) {
  const nameReg = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
  return nameReg.test(str);
};
// День 0 функция открывает модальное окно (корзины)
const toggleModal = function () {
  modal.classList.toggle("is-open");
};
// День 1 функция открывает модальное окно именно авторизации
function toggleModalAuth() {
  loginInput.style.borderColor = "";
  modalAuth.classList.toggle("is-open");
}
// День 2 возвращаемся на главную при клике Лого
function returnMain() {
  containerPromo.classList.remove("hide");
  restaurants.classList.remove("hide");
  menu.classList.add("hide");
}
// День 1 функция выхода из аккаунта
function authorized() {
  function logOut() {
    login = "";
    localStorage.removeItem("gloDelivery");
    buttonAuth.style.display = "";
    userName.style.display = "";
    buttonOut.style.display = "";
    buttonOut.removeEventListener("click", logOut);
    checkAuth();
    returnMain();
  }
  console.log("Авторизован");
  userName.textContent = login;
  buttonAuth.style.display = "none";
  userName.style.display = "inline";
  buttonOut.style.display = "block";
  buttonOut.addEventListener("click", logOut);
}
// День 1 функция, если не авторизован и нажал на войти
function notAuthorized() {
  console.log("Не авторизован");

  function logIn(event) {
    event.preventDefault();

    if (valid(loginInput.value)) {
      loginInput.style.borderColor = "";
      login = loginInput.value;
      localStorage.setItem("gloDelivery", login);
      toggleModalAuth();
      buttonAuth.removeEventListener("click", toggleModalAuth);
      closeAuth.removeEventListener("click", toggleModalAuth);
      logInForm.removeEventListener("submit", logIn);
      logInForm.reset();
      checkAuth();
    } else {
      loginInput.style.borderColor = "tomato";
      loginInput.value = "";
    }
  }

  buttonAuth.addEventListener("click", toggleModalAuth);
  closeAuth.addEventListener("click", toggleModalAuth);
  logInForm.addEventListener("submit", logIn);
}
// День 1 проверить авторизован или нет
function checkAuth() {
  if (login) {
    authorized();
  } else {
    notAuthorized();
  }
}
// День 2 создать карточку ресторана на главной странице
function createCardRestaurant(restaurant) {
  // День 3 во все карточки подгружаются разные данные с БД
  const {
    image,
    kitchen,
    name,
    price,
    products,
    stars,
    time_of_delivery: timeOfDelivery,
  } = restaurant;
  const card = `
  <a  class="card card-restaurant" data-products='${products}'>
						<img src="${image}" alt="image" class="card-image"/>
						<div class="card-text">
							<div class="card-heading">
								<h3 class="card-title">${name}</h3>
								<span class="card-tag tag">${timeOfDelivery}</span>
							</div>
							<div class="card-info">
								<div class="rating">
									${stars}
								</div>
								<div class="price">${price}</div>
								<div class="category">${kitchen}</div>
							</div>
						</div>
					</a>

  `;
  cardsRestaurants.insertAdjacentHTML("afterbegin", card);
}
// День 2 создать карточку еды
function createCardGood(goods) {
  // День 3 во все карточки подгружаются разные товары с БД

  const { description, id, image, name, price } = goods;

  const card = document.createElement("div");
  card.className = "card";
  card.insertAdjacentHTML(
    "afterbegin",
    `
 
              <img
                src="${image}"
                alt="image"
                class="card-image"
              />
              <div class="card-text">
                <div class="card-heading">
                  <h3 class="card-title card-title-reg">${name}</h3>
                </div>
                <div class="card-info">
                  <div class="ingredients">
                    ${description}
                  </div>
                </div>
                <div class="card-buttons">
                  <button class="button button-primary button-add-cart">
                    <span class="button-card-text">В корзину</span>
                    <span class="button-cart-svg"></span>
                  </button>
                  <strong class="card-price-bold">${price}</strong>
                </div>
              </div>

  `
  );
  cardsMenu.insertAdjacentElement("afterbegin", card);
}
// День 2 создать карточку меню при нажатии на карточку ресторана,
// не переходя еа след страницу
function openGoods(event) {
  const target = event.target;
  const restaurant = target.closest(".card-restaurant");

  if (restaurant) {
    if (login) {
      cardsMenu.textContent = "";
      containerPromo.classList.add("hide");
      restaurants.classList.add("hide");
      menu.classList.remove("hide");
      // День 3 получили данные о меню ресторанов
      getData(`./db/${restaurant.dataset.products}`).then(function (data) {
        data.forEach(createCardGood);
      });
    } else {
      toggleModalAuth();
    }
  }
}
// День 3 собрали все события в одну функцию, чтобы можно было их запустисть
function init() {
  // День 3 getData
  getData("./db/partners.json").then(function (data) {
    data.forEach(createCardRestaurant);
  });
  // День 0 нажать на корзину
  cartButton.addEventListener("click", toggleModal);
  // День 0 закрыть корзину
  close.addEventListener("click", toggleModal);
  // День 2 нажать на карточку ресторана
  cardsRestaurants.addEventListener("click", openGoods);
  // День 2 нажать на лого
  logo.addEventListener("click", returnMain);
  // День 1 проверить авторизацию
  checkAuth();

  // createCardRestaurant();

  // День 2 Слайдер на Swiper
  new Swiper(".swiper-container", {
    loop: true,
    autoplay: {
      delay: 2000,
    },
  });
}
init();
