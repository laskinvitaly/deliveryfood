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

let login=localStorage.getItem('delivery');


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
		buttonAuth.style.display="";
		buttonOut.style.display="";
		userName.style.display="";
		buttonOut.removeEventListener("click", logOut);
		checkAuth();
	}
	userName.textContent = login;
	buttonAuth.style.display="none";
	buttonOut.style.display="block";
	userName.style.display="inline";

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

function createCardsRestaurants(){
	const card=`
		<a class="card card-restaurant">
			<img src="img/pizza-plus/preview.jpg" alt="image" class="card-image">
			<div class="card-text">
				<div class="card-heading">
					<h3 class="card-title">Пицца плюс</h3>
					<span class="card-tag tag">50 мин</span>
				</div>
				<div class="card-info">
					<div class="rating">4.5</div>
					<div class="price">От 900 ₽</div>
					<div class="category">Пицца</div>
				</div>
			</div>
		</a>
	`;

	cardsRestaurants.insertAdjacentHTML('beforeend',card);

}

function createCardGood(){
	const card=document.createElement('div');
	card.insertAdjacentHTML('beforeend',`
		<img src="img/pizza-plus/pizza-vesuvius.jpg" alt="image" class="card-image"/>
		<div class="card-text">
			<div class="card-heading">
				<h3 class="card-title card-title-reg">Пицца Везувий</h3>
			</div>
			<div class="card-info">
				<div class="ingredients">Соус томатный, сыр «Моцарелла», ветчина, пепперони, перец
					«Халапенье», соус «Тобаско», томаты.
				</div>
			</div>
			<div class="card-buttons">
				<button class="button button-primary button-add-cart">
					<span class="button-card-text">В корзину</span>
					<span class="button-cart-svg"></span>
				</button>
				<strong class="card-price-bold">545 ₽</strong>
			</div>
		</div>	
	`);
	card.className="card";
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
			createCardGood();
			createCardGood();
			createCardGood();
		}else{
			toggleMenuAuth();
		}
	}	
}




cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);
cardsRestaurants.addEventListener("click",  openGoods);
logo.addEventListener("click",returnMain());

checkAuth();
createCardsRestaurants();
createCardsRestaurants();
createCardsRestaurants();

//Подключаем слайдер
var mySwiper = new Swiper('.swiper-container', {
    speed: 400,
    spaceBetween: 100,
    autoplay: {
    	delay: 3000,
  	},
  	loop: true,
});