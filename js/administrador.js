
const btne = document.querySelector('#menu-btn');
        const menu = document.querySelector('#sidemenu');
        btne.addEventListener('click', e =>{
            menu.classList.toggle("menu-collapsed");
            menu.classList.toggle("menu-expanded");
            

            document.querySelector('body').classList.toggle('body-expanded');
        });


//const targets = document.querySelectorAll('[data-target]')
//const content = document.querySelectorAll('[data-content]')
//
//targets.forEach(target => {
//    target.addEventListener('click', () => {
//        content.forEach(c =>{
//            c.classList.remove('active')
//        } )
//        const t = document.querySelector(target.dataset.target)
//        t.classList.add('active')
//    } )
//} )


//'use strict'
//const li = document.querySelectorAll('.item')
//const bloque = document.querySelectorAll('.bloque')
//li.forEach( (cadaLi, i)=>{
//    li[i].addEventListener('click',()=>{
//        li.forEach( (cadaLi, i)=>{
//            li[i].classList.remove('activo')
//            bloque[i].classList.remove('activo')
//        })
//        li[i].classList.add('activo')
//        bloque[i].classList.add('activo')
//    })
//
//})