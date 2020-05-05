const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

function toggleModal() {
  modal.classList.toggle("is-open");
}


const buttonAuth=document.querySelector(".button-auth");
const modalAuth=document.querySelector(".modal-auth");
const buttonLogin=document.querySelector(".button-login");
const closeAuth=document.querySelector(".close-auth");
const logInForm=document.querySelector("#logInForm");
const loginInput=logInForm.querySelector("#login");
const buttonOut=document.querySelector(".button-out");
const userName=document.querySelector(".user-name");


let login=localStorage.getItem('delivery');



function toggleMenuAuth() {
  modalAuth.classList.toggle("is-open");
}


function autorized(){
	function logOut(){
		login=null;
		localStorage.removeItem('delivery');
		buttonAuth.style.display="";
		buttonOut.style.display="";
		userName.style.display="";
		buttonOut.removeEventListener("click", logOut);
		checkAuth();
}
	console.log('авторизован');
	userName.textContent = login;
	buttonAuth.style.display="none";
	buttonOut.style.display="block";
	userName.style.display="inline";

	buttonOut.addEventListener("click", logOut);
}

function notAutorized(){
	console.log('не авторизован');

	function logIn(event){
		event.preventDefault();
		login=loginInput.value;

		if (login){
			localStorage.setItem('delivery', login);
			toggleMenuAuth();
			buttonAuth.removeEventListener("click", toggleMenuAuth);
			closeAuth.removeEventListener("click", toggleMenuAuth);
			logInForm.removeEventListener("submit",logIn);
			logInForm.reset();
			checkAuth();
		}else{
			alert("Не введен логин");
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

checkAuth();