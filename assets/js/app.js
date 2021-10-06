const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const weeks = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const object = JSON.parse(localStorage.getItem('object')) || {}

const app = (() => {

    const applications = JSON.parse(localStorage.getItem('applications')) ||
    [
        {
            id: 0,
            icon: "./assets/img/apps/icon-this-pc.png",
            name: "This PC",
        },
        {
            id: 1,
            icon: "./assets/img/apps/icon-recycle-bin.png",
            name: "Recycle Bin",
        },
        {
            id: 2,
            icon: "./assets/img/apps/icon-garena.png",
            name: "Garena",
        }
    ]

    return {
        renderLocal(){
            $('.main-list').style.width = object.widthList
            if (object.widthList == '250px') {
                $$('.size-icon .right-click__item')[2].classList.add('active')
            } else if (object.widthList == '500px') {
                $$('.size-icon .right-click__item')[0].classList.add('active')
            } else { $$('.size-icon .right-click__item')[1].classList.add('active') }
        },
        renderApp(){
            const htmls = applications.map((app, index) => {
                return `
                <li class="main-item" index="${index}" title="${app.name}">
                    <div class="main-item__icon">
                        <img src="${app.icon}" alt="">
                    </div>
                    <div class="main-item__name">
                        ${app.name}
                    </div>
                </li>
                `
            }).join('')
            $('.main-list').innerHTML = htmls
        },
        newApp(type){
            const types = ['folder', 'shortcut', 'text', 'word']
            const icons = ["./assets/img/apps/icon-folder.png", "./assets/img/apps/icon-shortcut.png",
            "./assets/img/apps/icon-text.png", "./assets/img/apps/icon-word.png"]
            const names = ["New Folder", "New Shortcut", "New Text", "New Word"]
            
            let icon, name
            types.forEach((item, index) => {
                if (item == type) {
                    icon = icons[index]
                    name = names[index]
                }
            })

            const obj = {
                id: applications.length,
                icon,
                name,
            }

            applications.push(obj)
            localStorage.setItem('applications', JSON.stringify(applications))
            this.renderApp()
        },
        handle(){
            const _this = this
            const mainItems = $$('.main-item')
            const powerOnBtn = $('.power-on-btn')
            const modalPower = $('.modal-power')
            const modalPowerLoading = $('.modal-power__loading')
            const modalPowerOn = $('.modal-power__power-on')
            const modalPowerLogin = $('.modal-power__login')
            const inputPIN = $('.modal-power__PIN-input')
            const modalPowerStatus = $('.modal-power__status')
            const shutdownBtns = $$('.shutdown-btn')
            const restartBtn = $('.restart-btn')
            const main = $('.main')
            const rightBox = $('.right-click')
            const itemsRightClick = $$('.right-click__item')
            const widthMain = main.offsetWidth
            const heightMain = main.offsetHeight
            const widthRightBox = rightBox.offsetWidth
            const heightRightBox = rightBox.offsetHeight

            //right click
            main.oncontextmenu = function(e){
                let top, left
                e.clientX + widthRightBox <= widthMain ? left = e.clientX : left = e.clientX - widthRightBox
                e.clientY + heightRightBox <= heightMain ? top = e.clientY : top = e.clientY - heightRightBox
                
                Object.assign(rightBox.style, {
                    top: top + 'px',
                    left: left + 'px',
                    visibility: "visible",
                })
                return false;
            }

            //hover menu right click
            itemsRightClick.forEach((item) => {
                const width = $('.right-click__sub-menu').offsetWidth

                item.onmouseover = function(){
                    const left = rightBox.offsetLeft
                    const top = rightBox.offsetTop
                    const subMenu = this.querySelector('.right-click__sub-menu')
                    if (subMenu) {
                        if (left + widthRightBox + width <= widthMain) {
                            Object.assign(subMenu.style, {
                                left: "100%",
                            })
                        } else {
                            Object.assign(subMenu.style, {
                                left: "-110%",
                            })
                        }

                        if (top + heightRightBox + 20 <= heightMain) {
                            Object.assign(subMenu.style, {
                                top: "-2px",
                                transform: "translateY(0%)"
                            })
                        } else {
                            Object.assign(subMenu.style, {
                                top: "100%",
                                transform: "translateY(-100%)"
                            })
                        }
                        subMenu.classList.add('active')
                    }
                }
                item.onmouseout = function(){
                    const subMenu = this.querySelector('.right-click__sub-menu')
                    if (subMenu) {
                        subMenu.classList.remove('active')
                    }
                }
            })

            //power on off
            loadingScreen = (status) => {
                modalPower.classList.add('active')
                modalPowerOn.classList.remove('active')
                modalPowerLogin.classList.remove('active')
                modalPowerStatus.innerHTML = status
                modalPowerLoading.classList.add('active')
            }

            loginScreen = () => {
                modalPowerLoading.classList.remove('active')
                modalPowerLogin.classList.add('active')
                inputPIN.focus()
            }

            powerOnScreen = () => {
                modalPowerLoading.classList.remove('active')
                modalPowerOn.classList.add('active')
            }

            pcScreen = () => {
                modalPower.classList.remove('active')
                modalPowerLogin.classList.remove('active')
                modalPowerOn.classList.remove('active')
                modalPowerLoading.classList.remove('active')
            }

            powerOnBtn.onclick = function(){
                loadingScreen('Starting')
                setTimeout(loginScreen, 3000)
            }

            inputPIN.oninput = function(){
                const value = this.value.trim()
                if (value == 1410) {
                    this.value = null
                    loadingScreen('Starting')
                    setTimeout(pcScreen, 3000)
                }
            }

            shutdownBtns.forEach((item) => {
                item.onclick = () => {
                    $('.start-box').classList.remove('active')
                    loadingScreen('Shutting down')
                    setTimeout(powerOnScreen, 3000)
                }
            })

            restartBtn.onclick = () => {
                $('.start-box').classList.remove('active')
                loadingScreen('Restarting')
                setTimeout(loginScreen, 3000)
            }

            //size icon
            const sizeList = $$('.size-icon .right-click__item')
            sizeList.forEach((item) => {
                item.onclick = function(){
                    const itemActive = $('.right-click__item.active')
                    if (itemActive) {
                        itemActive.classList.remove('active')
                    }

                    if(this.classList.contains('size-L')) {
                        $('.main-list').style.width = "500px"
                    }
                    if(this.classList.contains('size-M')) {
                        $('.main-list').style.width = "350px"
                    }
                    if(this.classList.contains('size-S')) {
                        $('.main-list').style.width = "250px"
                    }
                    object.widthList = $('.main-list').style.width
                    localStorage.setItem('object', JSON.stringify(object))
                    this.classList.add('active')
                    _this.renderApp()
                }
            })

            //show desktop icon desktop
            const showHideIcon = $('.show-hide-icon')
            showHideIcon.onclick = function(){
                if (this.classList.contains('active')) {
                    $('.main-list').style.visibility = 'hidden'
                } else {
                    $('.main-list').style.visibility = 'visible'
                }
                this.classList.toggle('active')
            }

            //F5
            const F5Btn = $('.F5-btn')
            F5Btn.onclick = () => {
                $('.main-list').style.visibility = 'hidden'
                setTimeout(() => {
                    $('.main-list').style.visibility = 'visible'
                }, 300)
                rightBox.style.visibility = 'hidden'
            }

            //new app
            const type = ['folder', 'shortcut', 'text', 'word']
            const newAppList = $$('.new-app-list .right-click__item')
            newAppList.forEach((item, index) => {
                item.onclick = function(){
                    _this.newApp(type[index])
                    rightBox.style.visibility = 'hidden'
                }
            })

            //onclick main list
            const listApp = $('.main-list')
            listApp.onclick = (e) => {
                const app = e.target.closest('.main-item')

                if (app) {
                    const itemActive = $('.main-item.active')
                    if (itemActive) { itemActive.classList.remove('active') }

                    app.classList.add('active')
                }
            }

            //window
            window.onkeydown = function(e) {
                if (e.which === 116) {
                    e.preventDefault()
                    console.log('a')
                    $('.main-list').style.visibility = 'hidden'
                    setTimeout(() => {
                        $('.main-list').style.visibility = 'visible'
                    }, 300)
                }
            } 
        },
        start(){
            this.renderLocal()
            this.renderApp()
            this.handle()
        }
    }
})().start()

const footer = (() => {

    return {
        handle(){
            const startIcon = $('.footer-left__start-icon')
            const startBox = $('.start-box')
            const leftStartBox = $('.start-box__left')
            const date = new Date()
            const timeRight = $('.footer-right__time')
            const timeBox = $('.footer-right__time-time')
            const dateBox = $('.footer-right__time-date')

            //update time
            setInterval(() => {
                const hour = date.getHours()
                const min = date.getMinutes()
                const day = date.getDate()
                const month = date.getMonth()
                const year = date.getFullYear()
                const weekday = date.getDay()

                timeBox.innerHTML = `${hour}:${min}`
                dateBox.innerHTML = `${month + 1}/${day}/${year}`
                timeRight.title = `${weeks[weekday]}, ${months[month]} ${day}, ${year}`
            }, 1000)

            //mở startBox
            startIcon.onclick = function(){
                startBox.classList.toggle('active')
            }
            //hover
            leftStartBox.onmouseover = () => {
                leftStartBox.classList.add('active')
            }

            leftStartBox.onmouseout = () => {
                leftStartBox.classList.remove('active')
            }

            //window
            window.onclick = (e) => {
                const startIconE = e.target.closest('.footer-left__start-icon')
                const startBoxE = e.target.closest('.start-box')
                const mainItem = e.target.closest('.main-item')
                const rightClickBox = e.target.closest('.right-click')

                if (!startIconE && !startBoxE && startBox.classList.contains('active')) {
                    startBox.classList.remove('active')
                }

                if (!mainItem) {
                    const itemActive = $('.main-item.active')
                    if (itemActive) { itemActive.classList.remove('active') }
                }

                if (!rightClickBox) {
                    $('.right-click').style.visibility = "hidden"
                }
            }
        },
        start(){
            this.handle()
        }
    }
})().start()