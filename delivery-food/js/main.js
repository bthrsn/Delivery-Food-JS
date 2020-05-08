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
  cardsMenu = document.querySelector(".cards-menu"),
  restaurantTitle = document.querySelector(".restaurant-title"),
  rating = document.querySelector(".rating"),
  minPrice = document.querySelector(".price"),
  category = document.querySelector(".category"),
  inputSearch = document.querySelector(".input-search"),
  modalBody = document.querySelector(".modal-body"),
  modalPrice = document.querySelector(".modal-pricetag"),
  buttonClearCart = document.querySelector(".clear-cart"),
  // День 4 Корзина сохраняется в local storage
  cart = [];

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
    cartButton.style.display = "";
    buttonOut.removeEventListener("click", logOut);
    checkAuth();
    returnMain();
  }
  console.log("Авторизован");
  userName.textContent = login;
  buttonAuth.style.display = "none";
  userName.style.display = "inline";
  buttonOut.style.display = "flex";
  cartButton.style.display = "flex";
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
      // День 1 изъяли из local storage
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
  <a  class="card card-restaurant" 
  data-products='${products}'
  data-info="${[name, price, stars, kitchen]}"
  >
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
								<div class="price">От ${price} ₽</div>
								<div class="category">${kitchen}</div>
							</div>
						</div>
					</a>

  `;
  cardsRestaurants.insertAdjacentHTML("afterbegin", card);
}
// День 2 создать карточку еды
function createCardGood(goods) {
  const { description, id, image, name, price } = goods;

  const card = document.createElement("div");
  card.className = "card";
  card.insertAdjacentHTML(
    "afterbegin",
    `
              <img
                src="${image}"
                alt="${name}"
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
                  <button class="button button-primary button-add-cart" id = "${id}">
                    <span class="button-card-text">В корзину</span>
                    <span class="button-cart-svg"></span>
                  </button>
                  <strong class="card-price-bold">${price} ₽</strong>
                </div>
              </div>

  `
  );
  cardsMenu.insertAdjacentElement("afterbegin", card);
}
// День 2 создать карточку меню при нажатии на карточку ресторана,
// не переходя на след страницу
function openGoods(event) {
  const target = event.target;
  const restaurant = target.closest(".card-restaurant");

  if (restaurant) {
    if (login) {
      const info = restaurant.dataset.info.split(",");
      const [name, price, stars, kitchen] = info;
      cardsMenu.textContent = "";
      containerPromo.classList.add("hide");
      restaurants.classList.add("hide");
      menu.classList.remove("hide");
      // День 3 - меняем шапку при открытии меню на текущий ресторан
      restaurantTitle.textContent = name;
      rating.textContent = stars;
      minPrice.textContent = `От ${price} ₽`;
      category.textContent = kitchen;
      // День 3 получили данные о меню ресторанов
      getData(`./db/${restaurant.dataset.products}`).then(function (data) {
        data.forEach(createCardGood);
      });
    } else {
      toggleModalAuth();
    }
  }
}
// День 4 Добавляем товар в  корзину
function addToCart() {
  const target = event.target;
  const buttonAddToCart = target.closest(".button-add-cart");
  if (buttonAddToCart) {
    const card = target.closest(".card");
    const title = card.querySelector(".card-title-reg").textContent;
    const cost = card.querySelector(".card-price-bold").textContent;
    const id = buttonAddToCart.id;
    // День 4 Если добавили одинаковое блюдо, оно не дублируется
    const food = cart.find(function (item) {
      return item.id === id;
    });
    if (food) {
      food.count += 1;
    } else {
      cart.push({
        id,
        title,
        cost,
        count: 1,
      });
    }
    console.log(cart);
  }
}
// День 4 формирование списка корзины
function renderCart() {
  // День 4 Очистить корзину
  modalBody.textContent = "";
  // День 4 Добавить сохраненные товары в корзину
  // localStorage.setItem("cartDelivery", cart);
  // День 4 Доавить товары в корзину
  cart.forEach(function ({ id, title, cost, count }) {
    const itemCart = `
    <div class="food-row">
            <span class="food-name">${title}</span>
            <strong class="food-price">${cost}</strong>
            <div class="food-counter">
              <button class="counter-button counter-minus" data-id=${id}>-</button>
              <span class="counter">${count}</span>
              <button class="counter-button counter-plus" data-id=${id}>+</button>
            </div>
    </div>
    `;

    modalBody.insertAdjacentHTML("afterbegin", itemCart);
  });
  // День 4 посчитать итоговую стоимость
  const totalPrice = cart.reduce(function (result, item) {
    return result + parseFloat(item.cost) * item.count;
  }, 0);
  modalPrice.textContent = totalPrice + " ₽";
}
// День 4 добавлять и убирать количество товаров в корзине
function changeCount(event) {
  const target = event.target;

  if (target.classList.contains("counter-button")) {
    const food = cart.find(function (item) {
      return item.id === target.dataset.id;
    });
    if (target.classList.contains("counter-minus")) {
      food.count--;
      if (food.count === 0) {
        cart.splice(cart.indexOf(food), 1);
      }
    }
    if (target.classList.contains("counter-plus")) food.count++;
    renderCart();
  }
}
// День 3 все события в одной функции, чтобы можно было их запустить
function init() {
  // День 3 getData
  getData("./db/partners.json").then(function (data) {
    data.forEach(createCardRestaurant);
  });
  // День 4 сформировать и открыть корзину
  cartButton.addEventListener("click", function () {
    renderCart();
    toggleModal();
  });
  // День 4 кнопка Отмена в корзине очищает корзину
  buttonClearCart.addEventListener("click", function () {
    cart.length = 0;
    renderCart();
  });
  // День 4 добавлять и убирать количество товаров в корзине
  modalBody.addEventListener("click", changeCount);
  // День 4 По клику добавляем в корзину
  cardsMenu.addEventListener("click", addToCart);
  // День 0 закрыть корзину
  close.addEventListener("click", toggleModal);
  // День 2 нажать на карточку ресторана
  cardsRestaurants.addEventListener("click", openGoods);
  // День 2 нажать на лого
  logo.addEventListener("click", returnMain);
  // День 3 поиск по сайту
  inputSearch.addEventListener("keydown", function (event) {
    if (event.keyCode === 13) {
      if (login) {
        const target = event.target;

        const value = target.value.toLowerCase().trim();

        target.value = "";

        if (!value || value.length < 3) {
          target.style.backgroundColor = "tomato";
          setTimeout(function () {
            target.style.backgroundColor = "";
          }, 2000);
          return;
        }

        const goods = [];

        getData("./db/partners.json").then(function (data) {
          const products = data.map(function (item) {
            return item.products;
          });
          products.forEach(function (product) {
            getData(`./db/${product}`)
              .then(function (data) {
                goods.push(...data);

                const searchGoods = goods.filter(function (item) {
                  return (
                    item.name.toLowerCase().includes(value) ||
                    item.description.toLowerCase().includes(value)
                  );
                });
                console.log(searchGoods);

                cardsMenu.textContent = "";
                containerPromo.classList.add("hide");
                restaurants.classList.add("hide");
                menu.classList.remove("hide");

                restaurantTitle.textContent = "Результаты поиска";
                rating.textContent = "";
                minPrice.textContent = "";
                category.textContent = "";

                return searchGoods;
              })
              .then(function (data) {
                data.forEach(createCardGood);
              });
          });
        });
        // День 3 сам доделал запрос авторизации
      } else {
        toggleModalAuth();
      }
    }
  });

  // День 1 проверить авторизацию
  checkAuth();

  // День 2 Слайдер на Swiper
  new Swiper(".swiper-container", {
    loop: true,
    autoplay: {
      delay: 2000,
    },
  });
}
// День 3 запуск всех событий в функции init
init();
