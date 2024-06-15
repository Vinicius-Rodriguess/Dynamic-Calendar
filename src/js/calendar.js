import { Modal } from './modal.js'

export class Calendar {
    constructor() {
        this.listMonths = ['', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
        this.daysOfWeek = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sabado']
        this.currentMonth = new Date().getMonth() + 1
        this.currentYear = new Date().getFullYear()
        this.currentDay = new Date().getDate()
        this.month = new Date().getMonth() + 1
        this.week
        this.year = new Date().getFullYear()
        this.day = new Date().getDate()
        this.container = document.querySelector('.container-modes')
        this.eventDragged
        this.mode
        this.modal
        this.selecting
        this.dayHtml = document.querySelector('#day')
        this.weekHtml = document.querySelector('#week')
        this.monthHtml = document.querySelector('#month')
        this.yearHtml = document.querySelector('#year')
        this.events = [
            { id: 0, title: '1 Lembrete', description: 'Sou um lembre muito importante.', initialDate: '2024-06-10T01:00', finalDate: '2024-06-10T01:00', tag: { name: 'trabalho', color: 'red' } },
            { id: 1, title: '10 Lembrete', description: 'Sou um lembre muito importante.', initialDate: '2024-06-10T01:00', finalDate: '2024-06-10T01:00', tag: { name: 'trabalho', color: 'gray' } },
            { id: 2, title: '2 Lembrete', description: 'Sou um lembre muito importante.', initialDate: '2024-06-10T01:00', finalDate: '2024-06-10T01:00', tag: { name: 'escola', color: 'orange' } },
            // { id: 3, title: '3 Lembrete', description: 'Sou um lembre muito importante.', initialDate: '2024-06-18T05:25', finalDate: '2024-06-20T21:26', tag: { name: 'trabalho', color: 'green' } },
            // { id: 5, title: '5 Lembrete', description: 'Sou um lembre muito importante.', initialDate: '2024-06-11T02:25', finalDate: '2024-06-21T21:26', tag: { name: 'trabalho', color: 'blue' } },
            // { id: 6, title: '66666', description: 'Sou um lembre muito importante.', initialDate: '2024-06-10T02:25', finalDate: '2024-06-10T21:26', tag: { name: 'trabalho', color: 'blue' }, allDay: true },
        ]
    }

    init() {
        this.modal = new Modal()
        console.log(this.modal)

        this.banana = 21134
        document.querySelector('#addEvent').addEventListener('click', () => {
            this.modal.open()
        })
        document.querySelector('#btnWeek').addEventListener('click', () => {
            this.mode = new Week()
            this.mode.init() 
        })
        document.querySelector('#btnOneDay').addEventListener('click', () => {
            this.mode = new Day()
            this.mode.init()
        })
        document.querySelector('#btnList').addEventListener('click', () => {
            this.mode = new List()
            this.mode.init()
        })
        document.querySelector('#btnMonth').addEventListener('click', () => {
            this.mode = new Month()
            this.mode.init()
        })
        document.querySelector('#btnBackMonth').addEventListener('click', () => {
            this.mode.previusDate()
        })
        document.querySelector('#btnNextMonth').addEventListener('click', () => {
            this.mode.nextDate()
        })
        document.querySelector('#today').addEventListener('click', () => {
            this.today()
        })

        this.mode = new Month()
        this.mode.init()

        this.updateDates()
    }

    today() {
        this.month = this.currentMonth
        this.year = this.currentYear
        this.day = this.currentDay
        this.mode.init()
        this.updateDates()
    }

    validEvent() {
        const fields = [...this.modal.form]
        const emptyField = fields.find(field => field.value == '')
        if (emptyField) {
            const fieldErro = document.querySelector('#error-mensage')
            fieldErro.innerHTML = 'Preencha todos os campos!'
            setTimeout(() => fieldErro.innerHTML = '', 5000)
            return false
        }
        return true
    }

    addEvent() {
        if (!this.validEvent()) return

        const event = {
            id: this.events.length + 1,
            title: this.modal.form.title.value,
            description: this.modal.form.description.value,
            initialDate: this.modal.form.initialDate.value,
            finalDate: this.modal.form.finalDate.value,
            tag: this.modal.inputTag,
            allDay: this.modal.form.allDay.checked
        }

        // isso vai ser um fetch
        this.events.push(event)

        if (this.mode.mode == 'list') this.mode.init()
        else this.mode.render([event])

        this.modal.close()
    }

    updateEvent(event) {
        if (!this.validEvent()) return

        event.elements.forEach(e => e.remove())

        event.title = this.modal.form.title.value
        event.description = this.modal.form.description.value
        event.initialDate = this.modal.form.initialDate.value
        event.finalDate = this.modal.form.finalDate.value
        event.tag = this.modal.inputTag
        event.allDay = this.modal.form.allDay.checked

        if (this.modal.form.allDay.checked) event.finalDate = this.modal.form.initialDate.value

        if (this.mode.mode == 'list') this.mode.init()
        else this.mode.render([event])
    
        if (this.mode.mode == 'month') {
            const initialDate = new Date(event.initialDate)
            const line = +(((initialDate.getDate() + this.getFirstDayOfWeek()) / 7).toString().slice(0, 1))
            this.agroupChildren(this.classMonth.matrizDays[line][initialDate.getDay()].element)
        }
    }

    removeEvent(event) {
        event.elements.forEach(e => e.remove())
        if (this.mode.mode == 'list') this.classlist.init()

        if (this.mode.mode == 'month') {
            const initialDate = new Date(event.initialDate)
            const line = +(((initialDate.getDate() + this.getFirstDayOfWeek()) / 7).toString().slice(0, 1))
            this.agroupChildren(this.classMonth.matrizDays[line][initialDate.getDay()].element)
        }

        // isso vai ser um fetch
        this.events = this.events.filter(e => e.id != event.id)
    }

    formatDate(date) {
        return `${new Date(date).getFullYear()}-${(new Date(date).getMonth()).toString().padStart(2, '0')}-${new Date(date).getDate().toString().padStart(2, '0')}T${new Date(date).getHours().toString().padStart(2, '0')}:${new Date(date).getMinutes().toString().padStart(2, '0')}`
    }

    getLastDayThisMonth() {
        return new Date(this.year, this.month, 0).getDate()
    }

    getFirstDayOfWeek() {
        return new Date(this.year, this.month - 1, 1).getDay() - 1
    }

    orderDates(event) {
        if (new Date(event.initialDate) > new Date(event.finalDate)) {
            [event.initialDate, event.finalDate] = [event.finalDate, event.initialDate]
        }
    }

    updateDates() {
        this.dayHtml.innerHTML = this.day.toString().padStart(2, '0')
        this.weekHtml.innerHTML = this.week
        this.monthHtml.innerHTML = this.listMonths[this.month]
        this.yearHtml.innerHTML = this.year
    }
}

class Month extends Calendar {
    constructor() {
        super()
        this.matrizDays = []
        this.areas = 42
        this.dates = {}
        this.oldDate = null
    }

    nextDate() {
        this.month++
        if (this.month > 12) {
            this.month = 1
            this.year++
        }

        this.init()
        this.updateDates()
    }

    previusDate() {
        this.month--
        if (this.month < 1) {
            this.month = 12
            this.year--
        }

        this.init()
        this.updateDates()
    }

    init() {
        this.mode = 'month'
        this.container.innerHTML = ''

        this.dayHtml.classList.add('hide')
        this.weekHtml.classList.add('hide')
        this.monthHtml.classList.remove('hide')

        this.matrizDays = []

        const container = document.createElement('div')
        container.classList.add('m-container-month')

        container.appendChild(this.createWeek())
        container.appendChild(this.createDays())

        this.container.appendChild(container)
        this.resize()
        this.render(this.events)
    }

    createWeek() {
        const container = document.createElement('div')
        container.classList.add('m-weeks')

        this.daysOfWeek.forEach(d => {
            const day = document.createElement('div')
            day.innerHTML = d.slice(0, 3)
            day.classList.add('m-day-week')
            container.appendChild(day)
        })

        return container
    }

    createDays() {
        const containerDays = document.createElement('div')
        containerDays.classList.add('m-container-days')

        const indexArea = this.areas - this.getFirstDayOfWeek()
        let line = []

        for (let i = -this.getFirstDayOfWeek(); i < indexArea; i++) {
            const date = new Date(this.year, this.month, i)

            const day = {
                element: document.createElement('div'),
                day: date.getDate(),
                month: date.getMonth(),
                year: date.getFullYear(),
                date: date,
                change: false
            }

            day.element.classList.add('m-day')
            day.element.innerHTML = `<div class="m-value-day">${date.getDate()}</div>`
            day.element.hiddenChildren = []

            if (date.getFullYear() === this.currentYear &&
                date.getMonth() === this.currentMonth &&
                date.getDate() === this.currentDay) {
                day.element.classList.add('m-today')
            }

            if (i < 1 || i > this.getLastDayThisMonth()) {
                day.element.classList.add('disable')
            }

            line.push(day)
            if (line.length === 7) {
                this.matrizDays.push(line)
                line = []
            }

            day.element.addEventListener('dragenter', () => {
                if (day.change) {
                    this.updatePosition(day)
                    day.change = false
                }
            })

            day.element.addEventListener('dragleave', () => day.change = true)

            day.element.addEventListener('click', () => {
                this.modal.updateDate({ day: day.day, month: day.month, year: day.year, mode: 'onlyDay' })
                this.modal.open()
            })

            day.element.addEventListener('mousedown', (e) => {
                if (!e.target.classList.contains('m-day')) return
                this.selecting = true
                this.dates.initial = day.date
            })

            day.element.addEventListener('mousemove', () => {
                if (!this.selecting) return
                this.dates.final = day.date
                const D = this.dates
                this.matrizDays.forEach(semana => {
                    semana.forEach(day => {
                        day.element.classList.remove('selected')
                        const isDayInRange = (day.date >= D.initial && day.date <= D.final) || (day.date <= D.initial && day.date >= D.final)
                        if (isDayInRange) day.element.classList.add('selected')
                    })
                })
            })

            day.element.addEventListener('mouseup', () => {
                this.selecting = false
                this.matrizDays.forEach(sem => sem.forEach(day => day.element.classList.remove('selected')))
                this.modal.updateDate(this.dates)
                this.modal.open()
            })

            containerDays.appendChild(day.element)
        }

        return containerDays
    }


    render(events) {
        events.forEach(event => {
            const initialDate = new Date(event.initialDate)
            const finalDate = new Date(event.finalDate)
            const line = +(((initialDate.getDate() + this.getFirstDayOfWeek()) / 7).toString().slice(0, 1))

            const widthEvent = document.querySelector('.m-day').clientWidth

            let daysLong = finalDate.getDate() - initialDate.getDate() + 1

            if (initialDate.getMonth() + 1 !== this.month || initialDate.getFullYear() !== this.year) return

            event.elements = []

            if ((initialDate.getDay() + daysLong) > 7) {
                event.width = (7 - initialDate.getDay()) * widthEvent
                const element = this.createEvent(event)
                event.elements.push(element)
                this.matrizDays[line][initialDate.getDay()].element.appendChild(element)
                daysLong = daysLong - (7 - initialDate.getDay())
                let i = 1

                while (daysLong > 7) {
                    event.width = 7 * widthEvent
                    const element2 = this.createEvent(event)
                    event.elements.push(element2)
                    this.matrizDays[line + i][0].element.appendChild(element2)
                    daysLong = daysLong - 7
                    i++
                }

                event.width = daysLong * widthEvent
                const element3 = this.createEvent(event)
                event.elements.push(element3)
                this.matrizDays[line + i][0].element.appendChild(element3)

                return
            }

            event.width = daysLong * widthEvent
            const element = this.createEvent(event)
            event.elements.push(element)

            this.matrizDays[line][initialDate.getDay()].element.appendChild(element)
            this.agroupChildren(this.matrizDays[line][initialDate.getDay()].element)
        })
    }

    agroupChildren(day) {
        const oldSpanMore = day.querySelector(".m-span-more")
        if (oldSpanMore) oldSpanMore.remove()

        day.hiddenChildren.forEach(day => day.classList.remove("hide"))

        day.hiddenChildren = []

        const limitChildren = 3
        if (day.children.length <= limitChildren) return

        const ignoreChildren = 2
        const arrayChildren = [...day.children]
        arrayChildren.forEach((children, i) => {
            if (i < ignoreChildren) return
            day.hiddenChildren.push(children)
        })

        day.hiddenChildren.forEach(day => day.classList.add("hide"))

        const spanMore = document.createElement("span")
        spanMore.innerText = `+${day.hiddenChildren.length} more`
        spanMore.classList.add("m-span-more")

        day.appendChild(spanMore)
    }

    createEvent(event) {
        const container = document.createElement('div')
        container.classList.add('m-event')
        container.style.backgroundColor = event.tag.color
        container.draggable = 'true'
        container.style.width = `${event.width}px`

        const arrastaMenos = document.createElement('div')
        arrastaMenos.innerHTML = '|'
        arrastaMenos.addEventListener('mousedown', () => event.action = 'arrastaMenos')
        arrastaMenos.classList.add('m-tip')

        const evento = document.createElement('div')
        evento.innerHTML = event.title
        evento.classList.add('m-event-value')
        evento.addEventListener('mousedown', () => event.action = 'arrastaTudo')

        const arrastaMais = document.createElement('div')
        arrastaMais.innerHTML = '|'
        arrastaMais.addEventListener('mousedown', () => event.action = 'arrastaMais')
        arrastaMais.classList.add('m-tip')

        container.appendChild(arrastaMenos)
        container.appendChild(evento)
        container.appendChild(arrastaMais)

        container.addEventListener('click', () => {
            this.modal.open()
            this.modal.renderEvent(event)
        })

        container.addEventListener('dragstart', () => {
            this.eventDragged = event
            this.oldDate = event.initialDate
            container.classList.add('dragging')
        })

        container.addEventListener('dragend', () => {
            container.classList.remove('dragging')

            const initialDate = new Date(this.oldDate)
            const line = +(((initialDate.getDate() + this.getFirstDayOfWeek()) / 7).toString().slice(0, 1))
            this.agroupChildren(this.matrizDays[line][initialDate.getDay()].element)
        })

        return container
    }

    updatePosition(date) {
        const eventDragged = this.eventDragged
        if (!eventDragged) return

        if (eventDragged.action == 'arrastaMenos') {
            eventDragged.initialDate = this.formatDate(new Date(this.year, date.month, date.day))
        }

        if (eventDragged.action == 'arrastaTudo') {
            const initialDate = new Date(eventDragged.initialDate)
            const finalDate = new Date(eventDragged.finalDate)
            const duration = finalDate.getDate() - initialDate.getDate()

            const newDate = new Date(this.year, date.month, date.day)
            eventDragged.initialDate = this.formatDate(newDate)
            eventDragged.finalDate = this.formatDate(new Date(newDate.setDate(newDate.getDate() + duration)))
        }

        if (eventDragged.action == 'arrastaMais') {
            eventDragged.finalDate = this.formatDate(new Date(this.year, date.month, date.day))
        }

        this.orderDates(eventDragged)

        eventDragged.elements.forEach(e => e.remove())
        this.render([eventDragged])
    }

    resize() {
        window.addEventListener('resize', () => {
            this.events.forEach(e => e.elements.forEach(event => event.remove()))
            this.render(this.events)
        })
    }
}

class Week extends Calendar {
    constructor() {
        super()
        this.matrizWeek = []
        this.matrizHourDay = []
        this.currentWeek = null
        this.allDayDays = []
        this.objDateDay = {}
        this.objDateWeek = { mode: 'gridWeek' }   
    }

    nextDate() {
        this.day = this.day + 7

        if (this.day > this.getLastDayThisMonth()) {
            this.day = 1
            this.month++

            if (this.month > 12) {
                this.month = 1
                this.year++
            }
        }

        this.init()
    }

    previusDate() {
        this.day = this.day - 7

        if (this.day < 1) {
            this.month--
            this.day = new Date(this.year, this.month + 1, 0).getDate()

            if (this.month < 1) {
                this.month = 12
                this.year--
            }
        }

        this.init()
    }

    changeWeek() {
        let line = []

        for (let i = -this.getFirstDayOfWeek(); i < 42 - this.getFirstDayOfWeek(); i++) {
            const date = new Date(this.year, this.month, i)

            const day = {}
            day.day = date.getDate()
            day.month = date.getMonth()

            line.push(day)
            if (line.length == 7) {
                this.matrizWeek.push(line)
                line = []
            }
        }

        const lines = +(((this.day + this.getFirstDayOfWeek()) / 7).toString().slice(0, 1))
        const initialDate = this.matrizWeek[lines][0]
        const finalDate = this.matrizWeek[lines][6]

        const date = `${initialDate.day.toString().padStart(2, '0')} ${this.listMonths[initialDate.month]} - ${finalDate.day.toString().padStart(2, '0')} ${this.listMonths[finalDate.month]}`
        this.currentWeek = this.matrizWeek[lines]

        this.week = date
        this.updateDates()
    }

    init() {
        this.mode = 'week'
        this.container.innerHTML = ''

        this.dayHtml.classList.add('hide')
        this.weekHtml.classList.remove('hide')
        this.monthHtml.classList.add('hide')

        this.matrizHourDay = []
        this.matrizWeek = []

        const container = document.createElement('div')
        container.classList.add('w-container-week')

        this.changeWeek()

        container.appendChild(this.divWeek())
        container.appendChild(this.divAllDay())
        container.appendChild(this.divHours())

        this.container.appendChild(container)

        this.render(this.events)
    }

    divWeek() {
        const divWeek = document.createElement('div')
        divWeek.classList.add('w-grid')

        const firstChild = document.createElement('div')
        firstChild.classList.add('w-day-week')
        divWeek.appendChild(firstChild)

        this.daysOfWeek.forEach((day, i) => {
            const child = document.createElement('div')
            child.innerHTML += `${day.slice(0, 3)} ${this.currentWeek[i].day.toString().padStart(2, '0')}/${this.currentWeek[i].month.toString().padStart(2, '0')}`
            child.classList.add('w-day-week')
            divWeek.appendChild(child)
        })

        return divWeek
    }

    divAllDay() {
        const divAllDay = document.createElement('div')
        divAllDay.classList.add('w-grid')

        const day = document.createElement('div')
        day.classList.add('w-area', 'w-all-day-txt')
        day.innerHTML = 'O dia todo'
        divAllDay.appendChild(day)

        for (let i = 0; i < 7; i++) {
            const day = document.createElement('div')
            day.classList.add('w-area', 'w-all-day')

            day.day = this.currentWeek[i].day
            day.month = this.currentWeek[i].month
            day.year = this.year
            day.date = new Date(day.year, day.month, day.day)

            if (day.day == this.currentDay && day.month == this.currentMonth && day.year == this.currentYear) day.classList.add('w-today')

            this.allDayDays.push(day)

            day.addEventListener('dragenter', () => this.updatePosition({ day: this.formatDate(new Date(day.year, day.month, day.day)) }))

            day.addEventListener('click', () => {
                this.modal.updateDate({ day: day.day, month: day.month, year: day.year, mode: 'onlyDay' })
                this.modal.open()
            })

            day.addEventListener('mousedown', (e) => {
                if (!e.target.classList.contains('w-all-day')) return
                this.selecting = true
                this.objDateDay.initial = day.date
            })

            day.addEventListener('mousemove', () => {
                if (!this.selecting) return
                this.objDateDay.final = day.date
                const D = this.objDateDay
                this.allDayDays.forEach(day => {
                    day.classList.remove('selected')
                    const isDayInRange = (day.date >= D.initial && day.date <= D.final) || (day.date <= D.initial && day.date >= D.final)
                    if (isDayInRange) day.classList.add('selected')
                })
            })

            day.addEventListener('mouseup', () => {
                this.selecting = false
                this.allDayDays.forEach(day => day.classList.remove('selected'))
                this.modal.open()
                this.modal.updateDate(this.objDateDay)
            })

            divAllDay.appendChild(day)
        }

        return divAllDay
    }

    divHours() {
        const divHours = document.createElement('div')
        divHours.classList.add('w-grid', 'w-container-hours')

        for (let i = 0; i < 48; i++) {
            const hora = document.createElement('div')
            hora.classList.add('w-area', 'w-number-hour')

            const hours = Math.floor(i / 2)
            const minutes = i % 2 === 0 ? 0 : 30

            const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
            hora.innerHTML = formattedTime

            divHours.appendChild(hora)
            const line = []

            for (let j = 0; j < 7; j++) {
                const area = document.createElement('div')
                area.classList.add('w-area', 'w-hour')

                area.hours = hours
                area.minutes = minutes

                area.day = this.currentWeek[j].day
                area.month = this.currentWeek[j].month
                area.year = this.year
                area.date = new Date(this.year, this.currentWeek[j].month, this.currentWeek[j].day).setHours(hours, minutes)

                if (area.day == this.currentDay && area.month == this.currentMonth && area.year == this.currentYear) area.classList.add('w-today')

                area.addEventListener('click', () => this.modal.open())

                area.addEventListener('dragenter', () => {
                    if (area.change) {
                        this.updatePosition({
                            dataHour: this.formatDate(new Date(new Date(area.date).setHours(hours, minutes))),
                            day: this.formatDate(new Date(area.date)),
                        })
                        area.change = false
                    }
                })

                area.addEventListener('dragleave', () => area.change = true)

                area.addEventListener('mousedown', (e) => {
                    if (!e.target.classList.contains('w-hour')) return
                    this.selecting = true
                    this.objDateWeek.initial = area.date
                })

                area.addEventListener('mousemove', () => {
                    if (!this.selecting) return
                    this.objDateWeek.final = area.date

                    this.matrizHourDay.forEach(line => {
                        line.forEach(hour => {
                            if (hour.date <= this.objDateWeek.initial && hour.date >= this.objDateWeek.final ||
                                hour.date >= this.objDateWeek.initial && hour.date <= this.objDateWeek.final) {
                                hour.classList.add('selected')
                            } else {
                                hour.classList.remove('selected')
                            }
                        })
                    })
                })

                area.addEventListener('mouseup', () => {
                    this.selecting = false
                    this.matrizHourDay.forEach(line => line.forEach(hour => hour.classList.remove('selected')))
                    this.modal.updateDate(this.objDateWeek)
                    this.modal.open()
                })

                line.push(area)
                divHours.appendChild(area)
            }
            this.matrizHourDay.push(line)
        }

        return divHours
    }

    render(event) {
        event.forEach(event => {
            const initialDate = new Date(event.initialDate)

            const diaInicialDaSemana = this.currentWeek[0].day
            const diaFinalDaSemana = this.currentWeek[6].day

            if (initialDate.getDate() < diaInicialDaSemana ||
                initialDate.getDate() > diaFinalDaSemana ||
                initialDate.getMonth() + 1 !== this.month ||
                initialDate.getFullYear() !== this.year) return

            const initialDay = new Date(event.initialDate).getDate()
            const finalDay = new Date(event.finalDate).getDate()

            const initialHour = new Date(event.initialDate).getHours()
            const finalHour = new Date(event.finalDate).getHours()

            const initialMinutes = new Date(event.initialDate).getMinutes()
            const finalMinutes = new Date(event.finalDate).getMinutes()

            const daysLong = finalDay - initialDay
            const heightColumn = 32.95

            event.elements = []

            if (event.allDay) {
                event.height = heightColumn * 2
                const element = this.createHtml(event)
                const areasDay = document.querySelectorAll('.w-all-day')
                areasDay[initialDate.getDay()].appendChild(element)
                event.elements.push(element)
                return
            }

            if (daysLong == 0) {

                if (initialMinutes >= 30) event.index = (initialHour * 2) + 1
                else event.index = initialHour * 2

                if (finalMinutes >= 30) event.height = (((finalHour - initialHour) * 2) + 2) * heightColumn
                else event.height = (((finalHour - initialHour) * 2) + 1) * heightColumn

                const element = this.createHtml(event)
                this.matrizHourDay[event.index][initialDate.getDay()].appendChild(element)
                event.elements.push(element)
                return
            }

            let index = initialDate.getDay()

            for (let i = initialDay; i <= finalDay; i++) {
                if (index > 6) return

                if (i == initialDay) {

                    if (initialMinutes >= 30) event.index = (initialHour * 2) + 1
                    else event.index = initialHour * 2

                    if (initialMinutes >= 30) event.height = (46 - initialHour) * heightColumn
                    else event.height = (48 - (initialHour * 2)) * heightColumn

                    const element = this.createHtml(event)
                    this.matrizHourDay[event.index][index].appendChild(element)
                    event.elements.push(element)
                }

                if (i > initialDay && i < finalDay) {
                    event.height = 48 * heightColumn
                    const element = this.createHtml(event)
                    this.matrizHourDay[0][index].appendChild(element)
                    event.elements.push(element)
                }

                if (i == finalDay) {
                    if (finalMinutes >= 30) event.height = ((finalHour * 2) + 2) * heightColumn
                    else event.height = ((finalHour * 2) + 1) * heightColumn

                    const element = this.createHtml(event)
                    this.matrizHourDay[0][index].appendChild(element)
                    event.elements.push(element)
                }

                index++
            }
        })
    }

    createHtml(event) {
        const container = document.createElement('div')
        container.classList.add('w-event')
        container.style.backgroundColor = event.tag.color
        container.draggable = 'true'
        container.style.height = `${event.height}px`

        const divDay = document.createElement('div')
        divDay.classList.add('w-event-value')
        divDay.addEventListener('mousedown', () => event.action = 'day')

        const divHour = document.createElement('div')
        divHour.classList.add('w-tip')
        divHour.innerHTML = '-'
        divHour.addEventListener('mousedown', () => event.action = 'hour')

        container.appendChild(divDay)
        container.appendChild(divHour)

        container.addEventListener('click', () => {
            this.modal.open()
            this.modal.renderEvent(event)
        })

        container.addEventListener('dragstart', () => {
            this.eventDragged = event
            container.classList.add('dragging')
        })

        container.addEventListener('dragend', () => container.classList.remove('dragging'))

        return container
    }

    updatePosition(data) {
        const eventDragged = this.eventDragged
        if (!eventDragged) return

        if (eventDragged.action == 'day') {
            const duration = new Date(eventDragged.finalDate).getDate() - new Date(eventDragged.initialDate).getDate()

            const dataInicial = new Date(data.day)
            dataInicial.setHours(new Date(eventDragged.initialDate).getHours())
            dataInicial.setMonth(dataInicial.getMonth() + 1)

            const dataFinal = new Date(data.day)
            dataFinal.setHours(new Date(eventDragged.finalDate).getHours())
            dataFinal.setDate(dataFinal.getDate() + duration)
            dataFinal.setMonth(dataFinal.getMonth() + 1)

            eventDragged.initialDate = this.formatDate(dataInicial)
            eventDragged.finalDate = this.formatDate(dataFinal)

        } else {
            eventDragged.finalDate = data.dataHour
        }

        this.orderDates(eventDragged)

        eventDragged.elements.forEach(element => element.remove())
        this.render([eventDragged])
    }
}

class Day extends Calendar {
    constructor() {
        super()
        this.arrayHour = []
        this.objHourDay = { mode: 'day' }
    }

    nextDate() {
        this.day++

        if (this.day > this.getLastDayThisMonth()) {
            this.day = 1
            this.month++

            if (this.month > 12) {
                this.month = 1
                this.year++
            }
        }
        this.init()
        this.updateDates()
    }

    previusDate() {
        this.day--

        if (this.day < 1) {
            this.month--
            this.day = new Date(this.year, this.month + 1, 0).getDate()

            if (this.month < 1) {
                this.month = 12
                this.year--
            }
        }
        this.init()
        this.updateDates()
    }

    init() {
        this.mode = 'day'
        this.container.innerHTML = ''

        this.dayHtml.classList.remove('hide')
        this.weekHtml.classList.add('hide')
        this.monthHtml.classList.remove('hide')

        const container = document.createElement('div')
        container.classList.add('d-container-day')

        container.appendChild(this.divWeek())
        container.appendChild(this.divAllDay())
        container.appendChild(this.divHorus())

        this.container.appendChild(container)
        this.render(this.events)
    }

    divWeek() {
        const divWeek = document.createElement('div')
        const index = new Date(this.year, this.month, this.day).getDay()
        divWeek.innerHTML = this.daysOfWeek[index]
        divWeek.classList.add('d-week')
        return divWeek
    }

    divAllDay() {
        const divAllDay = document.createElement('div')
        divAllDay.classList.add('d-df')

        const allDay = document.createElement('span')
        allDay.innerHTML = 'O dia todo'
        allDay.classList.add('d-all-day')
        divAllDay.appendChild(allDay)

        const area = document.createElement('div')
        area.classList.add('d-area-all-day')
        divAllDay.appendChild(area)

        area.addEventListener('click', () => {
            this.modal.updateDate({ day: this.day, month: this.month, year: this.year, mode: 'onlyDay' })
            this.modal.open()
        })

        return divAllDay
    }

    divHorus() {
        const divHorus = document.createElement('div')
        divHorus.classList.add('d-grid')

        for (let i = 0; i < 48; i++) {

            const hour = document.createElement('div')
            hour.classList.add('d-hour')

            const hours = Math.floor(i / 2)
            const minutes = i % 2 === 0 ? 0 : 30

            hour.innerHTML = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`

            const areaHour = document.createElement('div')
            areaHour.classList.add('d-area-hour')
            areaHour.hour = hours
            areaHour.minutes = minutes

            this.arrayHour.push(areaHour)

            areaHour.addEventListener('click', () => this.modal.open())

            areaHour.addEventListener('dragenter', (e) => {
                if (!e.target.classList.contains('d-area-hour')) return
                if (areaHour.change) {
                    this.updatePosition(areaHour.hour, areaHour.minutes)
                    areaHour.change = false
                }
            })

            areaHour.addEventListener('dragleave', () => areaHour.change = true)

            areaHour.addEventListener('mousedown', (e) => {
                if (!e.target.classList.contains('d-area-hour')) return
                this.selecting = true
                this.objHourDay.initial = areaHour.hour
            })

            areaHour.addEventListener('mousemove', () => {
                if (!this.selecting) return
                this.objHourDay.final = areaHour.hour
                this.arrayHour.forEach(hour => {

                    if (hour.hour <= this.objHourDay.initial && hour.hour >= this.objHourDay.final ||
                        hour.hour >= this.objHourDay.initial && hour.hour <= this.objHourDay.final) {
                        hour.classList.add('selected')
                    } else {
                        hour.classList.remove('selected')
                    }
                })
            })

            areaHour.addEventListener('mouseup', () => {
                this.selecting = false
                this.arrayHour.forEach(hour => hour.classList.remove('selected'))
                this.modal.updateDate(this.objHourDay)
                this.modal.open()
            })

            divHorus.appendChild(hour)
            divHorus.appendChild(areaHour)
        }

        return divHorus
    }

    updatePosition(hour, minutes) {
        const eventDragged = this.eventDragged
        if (!eventDragged) return

        if (eventDragged.action == 'hourMais') {
            const newDate = new Date(eventDragged.initialDate)
            newDate.setHours(hour, minutes)
            newDate.setMonth(newDate.getMonth() + 1)
            eventDragged.initialDate = this.formatDate(newDate)
        }

        if (eventDragged.action == 'hourMenos') {
            const newDate = new Date(eventDragged.finalDate)
            newDate.setHours(hour, minutes)
            newDate.setMonth(newDate.getMonth() + 1)
            eventDragged.finalDate = this.formatDate(new Date(newDate).setHours(hour))
        }

        this.orderDates(eventDragged)

        eventDragged.elements.forEach(e => e.remove())
        this.render([eventDragged])
    }

    render(events) {
        events.forEach(event => {
            const initialDate = new Date(event.initialDate)
            const initialDay = new Date(event.initialDate).getDate()

            const initialHour = new Date(event.initialDate).getHours()
            const finalHour = new Date(event.finalDate).getHours()

            const initialMinutes = new Date(event.initialDate).getMinutes()
            const finalMinutes = new Date(event.finalDate).getMinutes()

            if (initialDay !== this.day || initialDate.getMonth() + 1 !== this.month || initialDate.getFullYear() !== this.year) return

            event.elements = []
            const heightColumn = 32.95

            if (event.allDay) {
                event.height = heightColumn
                const element = this.createHtml(event)
                event.elements.push(element)
                document.querySelector('.d-area-all-day').appendChild(element)
                return
            }

            if (initialMinutes >= 30) event.index = initialHour * 2 + 1
            else event.index = initialHour * 2

            if (finalMinutes >= 30) event.height = ((finalHour - initialHour) * 2 + 2) * heightColumn
            else event.height = ((finalHour - initialHour) * 2 + 1) * heightColumn

            const element = this.createHtml(event)
            event.elements.push(element)
            document.querySelectorAll('.d-area-hour')[event.index].appendChild(element)
        })
    }

    createHtml(event) {
        const container = document.createElement('div')
        container.classList.add('d-event')
        container.style.backgroundColor = event.tag.color

        container.style.height = `${event.height}px`

        const divDay = document.createElement('div')
        divDay.classList.add('d-event-value')
        divDay.innerHTML = event.title
        divDay.addEventListener('mousedown', () => event.action = 'hourMais')

        container.appendChild(divDay)

        container.addEventListener('click', () => {
            this.modal.open()
            this.modal.renderEvent(event)
        })

        if (event.allDay) return container

        const divHours = document.createElement('div')
        divHours.classList.add('d-tips')
        divHours.innerHTML = '-'
        divHours.addEventListener('mousedown', () => event.action = 'hourMenos')
        container.appendChild(divHours)

        container.draggable = 'true'

        container.addEventListener('dragstart', () => {
            this.eventDragged = event
            container.classList.add('dragging')
        })

        container.addEventListener('dragend', () => container.classList.remove('dragging'))

        return container
    }
}

class List extends Calendar{
    constructor() {
        super()
    }

    nextDate() {
        this.month++
        if (this.month > 12) {
            this.month = 1
            this.year++
        }

        this.init()
        this.updateDates()
    }

    previusDate() {
        this.month--
        if (this.month < 1) {
            this.month = 12
            this.year--
        }

        this.init()
        this.updateDates()
    }

    init() {
        this.mode = 'list'
        this.container.innerHTML = ''

        this.dayHtml.classList.add('hide')
        this.weekHtml.classList.add('hide')
        this.monthHtml.classList.remove('hide')

        const container = document.createElement('div')
        container.classList.add('l-container-list')

        this.render(container, this.events)

        this.container.appendChild(container)
    }

    render(containerList, events) {
        const placedDays = []

        const divNone = document.createElement('div')
        divNone.innerHTML = 'Nenhum evento para exibir.'
        divNone.classList.add('l-divNone')
        containerList.appendChild(divNone)

        events.forEach(event => {
            const date = new Date(event.initialDate)
            const existingDay = placedDays.find(dias => dias.date.getTime() === date.getTime())

            if (date.getMonth() + 1 !== this.month || date.getFullYear() !== this.year) return

            if (existingDay) {
                existingDay.element.appendChild(this.createHtml(event, date))
                return
            }

            const container = document.createElement('div')
            container.appendChild(this.createListHeader(date))
            container.appendChild(this.createHtml(event))

            divNone.remove()

            containerList.appendChild(container)
            placedDays.push({ date: date, element: container })
        })
    }

    createListHeader(date) {
        const daySem = document.createElement('div')
        daySem.classList.add('l-day')

        const span = document.createElement('span')
        span.innerHTML = `${date.getDate().toString().padStart(2, '0')} ${this.listMonths[date.getMonth() + 1]},  ${date.getFullYear()}`

        const span2 = document.createElement('span')
        span2.innerHTML = this.daysOfWeek[date.getDay()]

        daySem.appendChild(span)
        daySem.appendChild(span2)

        return daySem
    }

    createHtml(event) {
        const initDate = new Date(event.initialDate)
        const finDate = new Date(event.finalDate)

        const eventList = document.createElement('div')
        eventList.classList.add('l-area')

        const span = document.createElement('span')
        span.innerHTML += `${initDate.getHours().toString().padStart(2, '0')}:${initDate.getMinutes().toString().padStart(2, '0')} - ${finDate.getHours().toString().padStart(2, '0')}:${finDate.getMinutes().toString().padStart(2, '0')}`
        if (event.allDay) span.innerHTML = 'O dia todo'

        eventList.appendChild(span)

        const container = document.createElement('div')
        container.classList.add('l-event')
        container.style.backgroundColor = event.tag.color
        container.innerHTML = event.title

        eventList.addEventListener('click', () => {
            this.modal.open()
            this.modal.renderEvent(event)
        })

        eventList.appendChild(container)

        event.elements = [eventList]

        return eventList
    }
}

const calendar = new Calendar()
calendar.init()
