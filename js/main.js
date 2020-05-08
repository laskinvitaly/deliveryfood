const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth=document.querySelector(".button-auth");
const modalAuth=document.querySelector(".modal-auth");
const buttonLogin=document.querySelector(".button-login");
const closeAuth=document.querySelector(".close-auth");
const logInForm=document.querySelector("#logInForm");
const loginInput=logInForm.querySelector("#login");
const buttonOut=document.querySelector(".button-out");
const userName=document.querySelector(".user-name");
const cardsRestaurants=document.querySelector(".cards-restaurants");
const containerPromo=document.querySelector(".container-promo");
const menu=document.querySelector(".menu");
const restaurants=document.querySelector(".restaurants");
const logo=document.querySelector(".logo");
const cardsMenu=document.querySelector(".cards-menu");
const restaurantTitle=document.querySelector(".restaurant-title");
const rating=document.querySelector(".rating");
const minPrice=document.querySelector(".price");
const category=document.querySelector(".category");
const modalBody=document.querySelector(".modal-body");
const modalPricetag=document.querySelector(".modal-pricetag");
const buttonClearCart=document.querySelector(".clear-cart");


let login=localStorage.getItem('delivery');

let cart=[];

//Получить данные с сервера
const getData=async function(url){
	const response=await fetch(url);
	if (!response.ok){
		throw new new Error(`Ошибка по адресу ${url}, статус ошибки ${response.status}`);
	}
	
	return await response.json();	
}


//Валидация логина
const validLogin=function(str){
	const nameReg=/^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
	return nameReg.test(str);
}

function toggleModal() {
  modal.classList.toggle("is-open");
}


function toggleMenuAuth() {
	loginInput.style.borderColor="";
  modalAuth.classList.toggle("is-open");
}

function returnMain(){
	containerPromo.classList.remove('hide');
	restaurants.classList.remove('hide');
	menu.classList.add('hide');
}


function autorized(){
	function logOut(){
		returnMain();
		login=null;
		localStorage.removeItem('delivery');
		cart.length=0;
		buttonAuth.style.display='';
		buttonOut.style.display='';
		userName.style.display='';
		cartButton.style.display='';
		buttonOut.removeEventListener("click", logOut);
		checkAuth();
	}
	userName.textContent = login;
	buttonAuth.style.display="none";
	buttonOut.style.display="flex";
	userName.style.display="inline";
	cartButton.style.display='flex';
	buttonOut.addEventListener("click", logOut);
}

function notAutorized(){
	function logIn(event){
		event.preventDefault();
		
		if (validLogin(loginInput.value.trim())){
			login=loginInput.value.trim();
			localStorage.setItem('delivery', login);
			toggleMenuAuth();
			buttonAuth.removeEventListener("click", toggleMenuAuth);
			closeAuth.removeEventListener("click", toggleMenuAuth);
			logInForm.removeEventListener("submit",logIn);
			logInForm.reset();						
			checkAuth();
		}else{
			loginInput.style.borderColor="red";
		}

	}

	buttonAuth.addEventListener("click", toggleMenuAuth);
	closeAuth.addEventListener("click", toggleMenuAuth);
	logInForm.addEventListener("submit",logIn);
}	

function checkAuth(){
		if (login){
			autorized();
		}else{
			notAutorized();
	}
}

function createCardsRestaurants({ image, name, kitchen, price,products, stars, time_of_delivery: timeOfDelivery }){
	
	const card=`
		<a class="card card-restaurant" data-products="${products}"
		data-header-restaurant="${[name, stars, price, kitchen]}">
			<img src="${image}" alt="image" class="card-image">
			<div class="card-text">
				<div class="card-heading">
					<h3 class="card-title">${name}</h3>
					<span class="card-tag tag">${timeOfDelivery} мин</span>
				</div>
				<div class="card-info">
					<div class="rating">${stars}</div>
					<div class="price">От ${price} ₽</div>
					<div class="category">${kitchen}</div>
				</div>
			</div>
		</a>
	`;

	cardsRestaurants.insertAdjacentHTML('beforeend',card);

}

function createCardGood({ description, id, image,name, price }){
	const card=document.createElement('div');
	card.insertAdjacentHTML('beforeend',`
		<img src="${image}" alt="image" class="card-image"/>
		<div class="card-text">
			<div class="card-heading">
				<h3 class="card-title card-title-reg">${name}</h3>
			</div>
			<div class="card-info">
				<div class="ingredients">${description}</div>
			</div>
			<div class="card-buttons">
				<button class="button button-primary button-add-cart">
					<span class="button-card-text">В корзину</span>
					<span class="button-cart-svg"></span>
				</button>
				<strong class="card-price card-price-bold">${price} ₽</strong>
			</div>
		</div>	
	`);
	card.className="card";
	card.id=id;
	cardsMenu.insertAdjacentElement('beforeend',card);
}

function openGoods(event){

	const target=event.target;
	const restaurant=target.closest('.card-restaurant');

	if (restaurant){
		if (login){
			containerPromo.classList.add('hide');
			restaurants.classList.add('hide');
			menu.classList.remove('hide');

			cardsMenu.textContent='';
			const [ name, stars, price, kitchen ]=restaurant.dataset.headerRestaurant.split(',');
			restaurantTitle.textContent=name;
			rating.textContent=stars;
			minPrice.textContent=price;
			category.textContent=kitchen;

			getData(`./db/${restaurant.dataset.products}`).then(function(data){
	data.forEach(createCardGood);
});
		}else{
			toggleMenuAuth();
		}
	}	
}

//Корзина добавление
function addToCart(){
	const target=event.target;
	const buttonAddToCart=target.closest('.button-add-cart');

	if (buttonAddToCart){
		const card=target.closest('.card');
		const id=card.id;
		const title=card.querySelector('.card-title').textContent;
		const cost=card.querySelector('.card-price').textContent;
		const food=cart.find(function(item){
			return item.id===id;
		});

		if (food){
			food.count+=1;
		}else{
			cart.push({
				id: id,
				title: title,
				cost: cost,
				count: 1
			});
		}
	}
}

//Корзина формирование
function renderCart(){	
	modalBody.textContent='';

	cart.forEach( function({ id, title, cost, count }) {
		const itemCart=`
		<div class="food-row">
			<span class="food-name">${title}</span>
			<strong class="food-price">${cost}</strong>
			<div class="food-counter">
				<button class="counter-button counter-minus" data-id="${id}">-</button>
				<span class="counter">${count}</span>
				<button class="counter-button counter-plus" data-id="${id}">+</button>
			</div>
		</div>
	`;
	modalBody.insertAdjacentHTML('beforeend',itemCart);
	});
	
	const TotalPrice = cart.reduce(function(result, item){
		return result + (parseFloat(item.cost)*item.count);
	}, 0);

	modalPricetag.textContent=TotalPrice+' ₽';

}
function changeCount(event){
	const target=event.target;
	
	if (target.classList.contains('counter-button')){
		const food=cart.find(function(item){
			return item.id===target.dataset.id;
		});
		if (target.classList.contains('counter-minus')) {
			food.count--;
			if (food.count===0){
				cart.splice(cart.indexOf(food), 1);
			}
		}
		if (target.classList.contains('counter-plus')) food.count++;
		renderCart();
	}	
}

function init(){
	cartButton.addEventListener("click", function(){
		toggleModal();
		renderCart();
	});
	modalBody.addEventListener("click", changeCount);
	buttonClearCart.addEventListener("click", function(){
		cart.length=0;
		renderCart();
	})
	close.addEventListener("click", toggleModal);
	cardsRestaurants.addEventListener("click",  openGoods);
	logo.addEventListener("click",returnMain);
	checkAuth();
	cardsMenu.addEventListener("click",addToCart);
	getData('./db/partners.json').then(function(data){
		data.forEach(createCardsRestaurants);
	});

	
	//Подключаем слайдер
	var mySwiper = new Swiper('.swiper-container', {
	    speed: 400,
	    spaceBetween: 100,
	    autoplay: {
	    	delay: 3000,
	  	},
	  	loop: true,
	});
}

init();