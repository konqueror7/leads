document.addEventListener('DOMContentLoaded', function () {

    const howtoSilder = new Swiper('.howto-slider', {
        slidesPerView: 1,
        loop: false,
        spaceBetween: 20,
        pagination: {
            el: '.swiper-pagination',
            type: 'bullets'
        }
    })

    class BurgerMenu {
        constructor(burgerNav,menuNav) {
            if (!burgerNav) {
                throw new Error('Укажите селектор элемента кнопки-бургера');
            }
            if (!menuNav) {
                throw new Error('Укажите селектор меню навигации в шапке сайта');
            }
            this.registerDomObjects(burgerNav,menuNav)
            this.registerEvents()
        }
        registerDomObjects(burger,menu) {
            this.burger = document.querySelector(burger)
            this.menu = document.querySelector(menu)
            console.log(this.burger)
            console.log(this.menu)
        }
        registerEvents() {
            this.burger.addEventListener('click', (e)=>{
                e.target.classList.toggle('active')
                if (e.target.classList.contains('active')) {
                    this.menu.classList.add('active')
                } else {
                    this.menu.classList.remove('active')
                }
            })
        }
    }
    if (window.innerWidth <= 1400) {
        const burgerMenu = new BurgerMenu('#burger', '.landing-nav ul')
    }

    class Accordeon {
        constructor() {
            this.registerDomObjects()
            this.registerEvents()
        }
        registerDomObjects() {
            this.quests = document.querySelectorAll('.quest')
            this.answs = document.querySelectorAll('.answ')
        }
        registerEvents() {
            this.quests.forEach((q)=>{
                q.addEventListener('click', (e)=>{
                    q.classList.toggle('active')
                    this.quests.forEach((el)=>{
                        if (el !== q)
                        el.classList.remove('active')
                    })
                    this.answs.forEach((a)=>{
                        if (!a.classList.contains('hidden')) {
                            a.classList.add('hidden')
                        }
                    })

                    if (q.classList.contains('active')) {
                        q.nextElementSibling.classList.remove('hidden')
                    } else {
                        q.nextElementSibling.classList.add('hidden')
                    }
                })
            })
        }
    }
    const accords = new Accordeon()

    class NewAgeDescrMore {
        constructor(descrSel, btnSel) {
            this.registerDomObjects(descrSel, btnSel)
            this.registerEvents()
        }
        registerDomObjects(descrSel, btnSel) {
            this.descr = document.querySelector(descrSel)
            this.showHideBtn = document.querySelector(btnSel)
        }
        registerEvents() {
            this.showHideBtn.addEventListener('click', (e)=>{
                e.target.classList.toggle('expand')
                if (e.target.classList.contains('expand')) {
                    this.scrlY = window.scrollY
                    this.descr.style.maxHeight = this.descr.scrollHeight + 'px'
                    this.descr.style.transition = '1.2s'
                } else {
                    this.descr.style.removeProperty('max-height')
                    this.descr.style.transition = '1.2s'
                    window.scrollTo({
                        top: this.scrlY,
                        behavior:'smooth',
                    })
                }
            })
        }
    }
    const newAgeDescrMore = new NewAgeDescrMore('.new-age-descr','.new-age-descr-more')
})