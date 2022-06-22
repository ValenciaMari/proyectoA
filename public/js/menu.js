const padre= document.querySelector('.padre');
const menu= document.querySelector('.navegacion');
console.log(menu);
console.log(padre);

padre.addEventListener('click',()=>{
   menu.classList.toggle("spread")
})
window.addEventListener('click',e=>{
   if (menu.classList.contains('spread')
   && e.target != menu && e.target != padre) {
    menu.classList.toggle("spread")
   }
})