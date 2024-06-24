import { MODAL } from './MODAL.js'

export const CALENDAR = {
    listMonths: ['', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    daysOfWeek: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sabado'],
    currentMonth: new Date().getMonth() + 1,
    currentYear: new Date().getFullYear(),
    currentDay: new Date().getDate(),
    month: new Date().getMonth() + 1,
    week: null,
    year: new Date().getFullYear(),
    day: new Date().getDate(),
    container: document.querySelector('.container-modes'),
    mode: null,
    eventDragged: null,
    selecting: null,
    dayHtml: document.querySelector('#day'),
    weekHtml: document.querySelector('#week'),
    monthHtml: document.querySelector('#month'),
    yearHtml: document.querySelector('#year'),
    events: [
        { id: 0, title: '1 Lembrete', description: 'Sou um lembre muito importante.', initialDate: '2024-06-10T01:00', finalDate: '2024-06-10T01:00', tag: { name: 'trabalho', color: 'red' } },
        { id: 1, title: '10 Lembrete', description: 'Sou um lembre muito importante.', initialDate: '2024-06-10T01:00', finalDate: '2024-06-10T01:00', tag: { name: 'trabalho', color: 'gray' } },
        { id: 2, title: '2 Lembrete', description: 'Sou um lembre muito importante.', initialDate: '2024-06-10T01:00', finalDate: '2024-06-10T01:00', tag: { name: 'escola', color: 'orange' } },
        { id: 3, title: '3 Lembrete', description: 'Sou um lembre muito importante.', initialDate: '2024-06-18T05:25', finalDate: '2024-06-20T21:26', tag: { name: 'trabalho', color: 'green' } },
        { id: 5, title: '5 Lembrete', description: 'Sou um lembre muito importante.', initialDate: '2024-06-11T02:25', finalDate: '2024-06-21T21:26', tag: { name: 'trabalho', color: 'blue' } },
        { id: 6, title: '66666', description: 'Sou um lembre muito importante.', initialDate: '2024-06-10T02:25', finalDate: '2024-06-10T21:26', tag: { name: 'trabalho', color: 'blue' }, allDay: true },
    ],

    init() {
        CALENDAR.mode = MONTH

        document.querySelector('#addEvent').addEventListener('click', () => MODAL.open())
        document.querySelector('#today').addEventListener('click', () => CALENDAR.today())
        document.querySelector('#btnWeek').addEventListener('click', () => {
            CALENDAR.mode = WEEK
            CALENDAR.mode.init()
        })
        document.querySelector('#btnOneDay').addEventListener('click', () => {
            CALENDAR.mode = DAY
            CALENDAR.mode.init()

        })
        document.querySelector('#btnList').addEventListener('click', () => {
            CALENDAR.mode = LIST
            CALENDAR.mode.init()

        })
        document.querySelector('#btnMonth').addEventListener('click', () => {
            CALENDAR.mode = MONTH
            CALENDAR.mode.init()
        })
        document.querySelector('#btnBackMonth').addEventListener('click', () => CALENDAR.mode.previousDate())
        document.querySelector('#btnNextMonth').addEventListener('click', () => CALENDAR.mode.nextDate())

        CALENDAR.mode.init()
        CALENDAR.updateDates()
    },

    today() {
        CALENDAR.month = CALENDAR.currentMonth
        CALENDAR.year = CALENDAR.currentYear
        CALENDAR.day = CALENDAR.currentDay
        CALENDAR.mode.init()
        CALENDAR.updateDates()
    },

    validEvent() {
        const fields = [...MODAL.form]
        const emptyField = fields.find(field => field.value == '')
        if (emptyField) {
            const fieldErro = document.querySelector('#error-mensage')
            fieldErro.innerHTML = 'Preencha todos os campos!'
            setTimeout(() => fieldErro.innerHTML = '', 5000)
            return false
        }
        return true
    },

    addEvent() {
        if (!CALENDAR.validEvent()) return

        const event = {
            id: CALENDAR.events.length + 1,
            title: MODAL.form.title.value,
            description: MODAL.form.description.value,
            initialDate: MODAL.form.initialDate.value,
            finalDate: MODAL.form.finalDate.value,
            tag: MODAL.inputTag,
            allDay: MODAL.form.allDay.checked
        }

        // isso vai ser um fetch
        CALENDAR.events.push(event)

        if (CALENDAR.mode.name = 'list') CALENDAR.mode.init()
        else CALENDAR.mode.render([event])

        MODAL.close()
    },

    updateEvent(event) {
        if (!CALENDAR.validEvent()) return

        event.elements.forEach(e => e.remove())
        event.title = MODAL.form.title.value
        event.description = MODAL.form.description.value
        event.initialDate = MODAL.form.initialDate.value
        event.finalDate = MODAL.form.finalDate.value
        event.tag = MODAL.inputTag
        event.allDay = MODAL.form.allDay.checked

        if (MODAL.form.allDay.checked) event.finalDate = MODAL.form.initialDate.value

        if (CALENDAR.mode.name = 'list') CALENDAR.mode.init()
        else CALENDAR.mode.render([event])

        if (CALENDAR.mode.name == 'month') {
            const initialDate = new Date(event.initialDate)
            MONTH.joinEvents(MONTH.matrixDays[CALENDAR.getLineOfWeek(initialDate.getDate())][initialDate.getDay()].element)
        }
    },

    removeEvent(event) {
        event.elements.forEach(e => e.remove())
        if (CALENDAR.mode === 'list') LIST.init()

        if (CALENDAR.mode === 'month') {
            const initialDate = new Date(event.initialDate)
            MONTH.joinEvents(MONTH.matrixDays[CALENDAR.getLineOfWeek(initialDate.getDate())][initialDate.getDay()].element)
        }

        // isso vai ser um fetch
        CALENDAR.events = CALENDAR.events.filter(e => e.id != event.id)
    },

    formatDate(date) {
        return `${new Date(date).getFullYear()}-${(new Date(date).getMonth()).toString().padStart(2, '0')}-${new Date(date).getDate().toString().padStart(2, '0')}T${new Date(date).getHours().toString().padStart(2, '0')}:${new Date(date).getMinutes().toString().padStart(2, '0')}`
    },

    getLastDayThisMonth() {
        return new Date(CALENDAR.year, CALENDAR.month, 0).getDate()
    },

    getFirstDayOfWeek() {
        return new Date(CALENDAR.year, CALENDAR.month - 1, 1).getDay() - 1
    },

    getLineOfWeek(date) {
        return Math.floor((date + this.getFirstDayOfWeek()) / 7)
    },

    orderDates(event) {
        if (new Date(event.initialDate) > new Date(event.finalDate)) {
            [event.initialDate, event.finalDate] = [event.finalDate, event.initialDate]
        }
    },

    updateDates() {
        CALENDAR.dayHtml.innerHTML = CALENDAR.day.toString().padStart(2, '0')
        CALENDAR.weekHtml.innerHTML = CALENDAR.week
        CALENDAR.monthHtml.innerHTML = CALENDAR.listMonths[CALENDAR.month]
        CALENDAR.yearHtml.innerHTML = CALENDAR.year
    },
}

const MONTH = {
    name: 'month',
    matrixDays: [],
    totalDays: 42,
    dates: {},
    oldDate: null,

    nextDate() {
        CALENDAR.month++
        if (CALENDAR.month > 12) {
            CALENDAR.month = 1
            CALENDAR.year++
        }

        MONTH.init()
        CALENDAR.updateDates()
    },

    previousDate() {
        CALENDAR.month--
        if (CALENDAR.month < 1) {
            CALENDAR.month = 12
            CALENDAR.year--
        }

        MONTH.init()
        CALENDAR.updateDates()
    },

    init() {
        CALENDAR.container.innerHTML = ''

        CALENDAR.dayHtml.classList.add('hide')
        CALENDAR.weekHtml.classList.add('hide')
        CALENDAR.monthHtml.classList.remove('hide')

        MONTH.matrixDays = []

        const container = document.createElement('div')
        container.classList.add('m-container-month')

        container.appendChild(MONTH.createWeek())
        container.appendChild(MONTH.createDays())

        CALENDAR.container.appendChild(container)
        MONTH.resize()
        MONTH.render(CALENDAR.events)
    },

    createWeek() {
        const container = document.createElement('div')
        container.classList.add('m-weeks')

        CALENDAR.daysOfWeek.forEach(d => {
            const day = document.createElement('div')
            day.innerHTML = d.slice(0, 3)
            day.classList.add('m-day-week')
            container.appendChild(day)
        })

        return container
    },

    createDays() {
        const containerDays = document.createElement('div')
        containerDays.classList.add('m-container-days')

        const indexArea = MONTH.totalDays - CALENDAR.getFirstDayOfWeek()
        let line = []

        for (let i = -CALENDAR.getFirstDayOfWeek(); i < indexArea; i++) {
            const date = new Date(CALENDAR.year, CALENDAR.month, i)

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

            if (date.getFullYear() === CALENDAR.currentYear &&
                date.getMonth() === CALENDAR.currentMonth &&
                date.getDate() === CALENDAR.currentDay) {
                day.element.classList.add('m-today')
            }

            if (i < 1 || i > CALENDAR.getLastDayThisMonth()) {
                day.element.classList.add('disable')
            }

            line.push(day)
            if (line.length === 7) {
                MONTH.matrixDays.push(line)
                line = []
            }

            day.element.addEventListener('dragenter', () => {
                if (day.change) {
                    MONTH.updatePosition(day)
                    day.change = false
                }
            })

            day.element.addEventListener('dragleave', () => day.change = true)

            day.element.addEventListener('click', () => {
                MODAL.updateDate({ day: day.day, month: day.month, year: day.year, mode: 'onlyDay' })
                MODAL.open()
            })

            day.element.addEventListener('mousedown', (e) => {
                if (!e.target.classList.contains('m-day')) return
                CALENDAR.selecting = true
                MONTH.dates.initial = day.date
            })

            day.element.addEventListener('mousemove', () => {
                if (!CALENDAR.selecting) return
                MONTH.dates.final = day.date
                const D = MONTH.dates
                MONTH.matrixDays.forEach(semana => {
                    semana.forEach(day => {
                        day.element.classList.remove('selected')
                        const isDayInRange = (day.date >= D.initial && day.date <= D.final) || (day.date <= D.initial && day.date >= D.final)
                        if (isDayInRange) day.element.classList.add('selected')
                    })
                })
            })

            day.element.addEventListener('mouseup', () => {
                CALENDAR.selecting = false
                MONTH.matrixDays.forEach(sem => sem.forEach(day => day.element.classList.remove('selected')))
                MODAL.updateDate(MONTH.dates)
                MODAL.open()
            })

            containerDays.appendChild(day.element)
        }

        return containerDays
    },

    render(events) {
        events.forEach(event => {
            const initialDate = new Date(event.initialDate)
            const finalDate = new Date(event.finalDate)
            const line = CALENDAR.getLineOfWeek(initialDate.getDate())

            const widthEvent = document.querySelector('.m-day').clientWidth

            let daysLong = finalDate.getDate() - initialDate.getDate() + 1

            if (initialDate.getMonth() + 1 !== CALENDAR.month || initialDate.getFullYear() !== CALENDAR.year) return

            event.elements = []

            if ((initialDate.getDay() + daysLong) > 7) {
                event.width = (7 - initialDate.getDay()) * widthEvent
                const element = MONTH.createEvent(event)
                event.elements.push(element)
                MONTH.matrixDays[line][initialDate.getDay()].element.appendChild(element)
                daysLong = daysLong - (7 - initialDate.getDay())
                let i = 1

                while (daysLong > 7) {
                    event.width = 7 * widthEvent
                    const element2 = MONTH.createEvent(event)
                    event.elements.push(element2)
                    MONTH.matrixDays[line + i][0].element.appendChild(element2)
                    daysLong = daysLong - 7
                    i++
                }

                event.width = daysLong * widthEvent
                const element3 = MONTH.createEvent(event)
                event.elements.push(element3)
                MONTH.matrixDays[line + i][0].element.appendChild(element3)

                return
            }

            event.width = daysLong * widthEvent
            const element = MONTH.createEvent(event)
            event.elements.push(element)

            MONTH.matrixDays[line][initialDate.getDay()].element.appendChild(element)
            MONTH.joinEvents(MONTH.matrixDays[line][initialDate.getDay()].element)
        })
    },

    joinEvents(day) {
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
        spanMore.addEventListener("click", () => {
            MODAL.open(MODAL.elementEvents)
            MODAL.showEvent(day.hiddenChildren)
            setInterval(() => MODAL.close(), 1)
        })

        day.appendChild(spanMore)
    },

    createEvent(event) {
        const container = document.createElement('div')
        container.classList.add('m-event')
        container.style.backgroundColor = event.tag.color
        container.draggable = 'true'
        container.style.width = `${event.width}px`

        const resizeLeft = document.createElement('div')
        resizeLeft.innerHTML = '|'
        resizeLeft.addEventListener('mousedown', () => event.action = 'resizeLeft')
        resizeLeft.classList.add('m-tip')

        const evento = document.createElement('div')
        evento.innerHTML = event.title
        evento.classList.add('m-event-value')
        evento.addEventListener('mousedown', () => event.action = 'resizeAll')

        const resizeRight = document.createElement('div')
        resizeRight.innerHTML = '|'
        resizeRight.addEventListener('mousedown', () => event.action = 'resizeRight')
        resizeRight.classList.add('m-tip')

        container.appendChild(resizeLeft)
        container.appendChild(evento)
        container.appendChild(resizeRight)

        container.addEventListener('click', () => {
            MODAL.open()
            MODAL.renderEvent(event)
        })

        container.addEventListener('dragstart', () => {
            CALENDAR.eventDragged = event
            MONTH.oldDate = event.initialDate
            container.classList.add('dragging')
        })

        container.addEventListener('dragend', () => {
            container.classList.remove('dragging')
            const initialDate = new Date(MONTH.oldDate)
            MONTH.joinEvents(MONTH.matrixDays[CALENDAR.getLineOfWeek(initialDate.getDate())][initialDate.getDay()].element)
        })

        return container
    },

    updatePosition(date) {
        const eventDragged = CALENDAR.eventDragged
        if (!eventDragged) return

        if (eventDragged.action == 'resizeLeft') {
            eventDragged.initialDate = CALENDAR.formatDate(new Date(CALENDAR.year, date.month, date.day))
        }

        if (eventDragged.action == 'resizeAll') {
            const initialDate = new Date(eventDragged.initialDate)
            const finalDate = new Date(eventDragged.finalDate)
            const duration = finalDate.getDate() - initialDate.getDate()

            const newDate = new Date(CALENDAR.year, date.month, date.day)
            eventDragged.initialDate = CALENDAR.formatDate(newDate)
            eventDragged.finalDate = CALENDAR.formatDate(new Date(newDate.setDate(newDate.getDate() + duration)))
        }

        if (eventDragged.action == 'resizeRight') {
            eventDragged.finalDate = CALENDAR.formatDate(new Date(CALENDAR.year, date.month, date.day))
        }

        CALENDAR.orderDates(eventDragged)

        eventDragged.elements.forEach(e => e.remove())
        MONTH.render([eventDragged])
    },

    resize() {
        window.addEventListener('resize', () => {
            CALENDAR.events.forEach(e => e.elements.forEach(event => event.remove()))
            MONTH.render(CALENDAR.events)
        })
    },
}

const WEEK = {
    matrixWeek: [],
    matrixHourDay: [],
    currentWeek: null,
    allDayDays: [],
    objDateDay: {},
    objDateWeek: { mode: 'gridWeek' },

    nextDate() {
        CALENDAR.day = CALENDAR.day + 7

        if (CALENDAR.day > CALENDAR.getLastDayThisMonth()) {
            CALENDAR.day = 1
            CALENDAR.month++

            if (CALENDAR.month > 12) {
                CALENDAR.month = 1
                CALENDAR.year++
            }
        }
        WEEK.init()
    },

    previousDate() {
        CALENDAR.day = CALENDAR.day - 7

        if (CALENDAR.day < 1) {
            CALENDAR.month--
            CALENDAR.day = new Date(CALENDAR.year, CALENDAR.month + 1, 0).getDate()

            if (CALENDAR.month < 1) {
                CALENDAR.month = 12
                CALENDAR.year--
            }
        }

        WEEK.init()
    },

    changeWeek() {
        let line = []

        for (let i = -CALENDAR.getFirstDayOfWeek(); i < 42 - CALENDAR.getFirstDayOfWeek(); i++) {
            const date = new Date(CALENDAR.year, CALENDAR.month, i)

            const day = {}
            day.day = date.getDate()
            day.month = date.getMonth()

            line.push(day)
            if (line.length == 7) {
                WEEK.matrixWeek.push(line)
                line = []
            }
        }

        const lines = CALENDAR.getLineOfWeek(CALENDAR.day)
        const initialDate = WEEK.matrixWeek[lines][0]
        const finalDate = WEEK.matrixWeek[lines][6]

        const date = `${initialDate.day.toString().padStart(2, '0')} ${CALENDAR.listMonths[initialDate.month]} - ${finalDate.day.toString().padStart(2, '0')} ${CALENDAR.listMonths[finalDate.month]}`
        WEEK.currentWeek = WEEK.matrixWeek[lines]

        CALENDAR.week = date
        CALENDAR.updateDates()
    },

    init() {
        CALENDAR.container.innerHTML = ''

        CALENDAR.dayHtml.classList.add('hide')
        CALENDAR.weekHtml.classList.remove('hide')
        CALENDAR.monthHtml.classList.add('hide')

        WEEK.matrixHourDay = []
        WEEK.matrixWeek = []

        const container = document.createElement('div')
        container.classList.add('w-container-week')

        WEEK.changeWeek()

        container.appendChild(WEEK.divWeek())
        container.appendChild(WEEK.divAllDay())
        container.appendChild(WEEK.divHours())

        CALENDAR.container.appendChild(container)

        WEEK.render(CALENDAR.events)
    },

    divWeek() {
        const divWeek = document.createElement('div')
        divWeek.classList.add('w-grid')

        const firstChild = document.createElement('div')
        firstChild.classList.add('w-day-week')
        divWeek.appendChild(firstChild)

        CALENDAR.daysOfWeek.forEach((day, i) => {
            const child = document.createElement('div')
            child.innerHTML += `${day.slice(0, 3)} ${WEEK.currentWeek[i].day.toString().padStart(2, '0')}/${WEEK.currentWeek[i].month.toString().padStart(2, '0')}`
            child.classList.add('w-day-week')
            divWeek.appendChild(child)
        })

        return divWeek
    },

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

            day.day = WEEK.currentWeek[i].day
            day.month = WEEK.currentWeek[i].month
            day.year = CALENDAR.year
            day.date = new Date(day.year, day.month, day.day)

            if (day.day == CALENDAR.currentDay && day.month == CALENDAR.currentMonth && day.year == CALENDAR.currentYear) day.classList.add('w-today')

            WEEK.allDayDays.push(day)

            day.addEventListener('dragenter', () => WEEK.updatePosition({ day: CALENDAR.formatDate(new Date(day.year, day.month, day.day)) }))

            day.addEventListener('click', () => {
                MODAL.updateDate({ day: day.day, month: day.month, year: day.year, mode: 'onlyDay' })
                MODAL.open()
            })

            day.addEventListener('mousedown', (e) => {
                if (!e.target.classList.contains('w-all-day')) return
                CALENDAR.selecting = true
                WEEK.objDateDay.initial = day.date
            })

            day.addEventListener('mousemove', () => {
                if (!CALENDAR.selecting) return
                WEEK.objDateDay.final = day.date
                const D = WEEK.objDateDay
                WEEK.allDayDays.forEach(day => {
                    day.classList.remove('selected')
                    const isDayInRange = (day.date >= D.initial && day.date <= D.final) || (day.date <= D.initial && day.date >= D.final)
                    if (isDayInRange) day.classList.add('selected')
                })
            })

            day.addEventListener('mouseup', () => {
                CALENDAR.selecting = false
                WEEK.allDayDays.forEach(day => day.classList.remove('selected'))
                MODAL.open()
                MODAL.updateDate(WEEK.objDateDay)
            })

            divAllDay.appendChild(day)
        }

        return divAllDay
    },

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

                area.day = WEEK.currentWeek[j].day
                area.month = WEEK.currentWeek[j].month
                area.year = CALENDAR.year
                area.date = new Date(CALENDAR.year, WEEK.currentWeek[j].month, WEEK.currentWeek[j].day).setHours(hours, minutes)

                if (area.day == CALENDAR.currentDay && area.month == CALENDAR.currentMonth && area.year == CALENDAR.currentYear) area.classList.add('w-today')

                area.addEventListener('click', () => MODAL.open())

                area.addEventListener('dragenter', () => {
                    if (area.change) {
                        WEEK.updatePosition({
                            dataHour: CALENDAR.formatDate(new Date(new Date(area.date).setHours(hours, minutes))),
                            day: CALENDAR.formatDate(new Date(area.date)),
                        })
                        area.change = false
                    }
                })

                area.addEventListener('dragleave', () => area.change = true)

                area.addEventListener('mousedown', (e) => {
                    if (!e.target.classList.contains('w-hour')) return
                    CALENDAR.selecting = true
                    WEEK.objDateWeek.initial = area.date
                })

                area.addEventListener('mousemove', () => {
                    if (!CALENDAR.selecting) return
                    WEEK.objDateWeek.final = area.date

                    WEEK.matrixHourDay.forEach(line => {
                        line.forEach(hour => {
                            if (hour.date <= WEEK.objDateWeek.initial && hour.date >= WEEK.objDateWeek.final ||
                                hour.date >= WEEK.objDateWeek.initial && hour.date <= WEEK.objDateWeek.final) {
                                hour.classList.add('selected')
                            } else {
                                hour.classList.remove('selected')
                            }
                        })
                    })
                })

                area.addEventListener('mouseup', () => {
                    CALENDAR.selecting = false
                    WEEK.matrixHourDay.forEach(line => line.forEach(hour => hour.classList.remove('selected')))
                    MODAL.updateDate(WEEK.objDateWeek)
                    MODAL.open()
                })

                line.push(area)
                divHours.appendChild(area)
            }
            WEEK.matrixHourDay.push(line)
        }

        return divHours
    },

    render(event) {
        event.forEach(event => {
            const initialDate = new Date(event.initialDate)

            const diaInicialDaSemana = WEEK.currentWeek[0].day
            const diaFinalDaSemana = WEEK.currentWeek[6].day

            if (initialDate.getDate() < diaInicialDaSemana ||
                initialDate.getDate() > diaFinalDaSemana ||
                initialDate.getMonth() + 1 !== CALENDAR.month ||
                initialDate.getFullYear() !== CALENDAR.year) return

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
                const element = WEEK.createHtml(event)
                const totalDaysDay = document.querySelectorAll('.w-all-day')
                totalDaysDay[initialDate.getDay()].appendChild(element)
                event.elements.push(element)
                return
            }

            if (daysLong == 0) {

                if (initialMinutes >= 30) event.index = (initialHour * 2) + 1
                else event.index = initialHour * 2

                if (finalMinutes >= 30) event.height = (((finalHour - initialHour) * 2) + 2) * heightColumn
                else event.height = (((finalHour - initialHour) * 2) + 1) * heightColumn

                const element = WEEK.createHtml(event)
                WEEK.matrixHourDay[event.index][initialDate.getDay()].appendChild(element)
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

                    const element = WEEK.createHtml(event)
                    WEEK.matrixHourDay[event.index][index].appendChild(element)
                    event.elements.push(element)
                }

                if (i > initialDay && i < finalDay) {
                    event.height = 48 * heightColumn
                    const element = WEEK.createHtml(event)
                    WEEK.matrixHourDay[0][index].appendChild(element)
                    event.elements.push(element)
                }

                if (i == finalDay) {
                    if (finalMinutes >= 30) event.height = ((finalHour * 2) + 2) * heightColumn
                    else event.height = ((finalHour * 2) + 1) * heightColumn

                    const element = WEEK.createHtml(event)
                    WEEK.matrixHourDay[0][index].appendChild(element)
                    event.elements.push(element)
                }

                index++
            }
        })
    },

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
            MODAL.open()
            MODAL.renderEvent(event)
        })

        container.addEventListener('dragstart', () => {
            CALENDAR.eventDragged = event
            container.classList.add('dragging')
        })

        container.addEventListener('dragend', () => container.classList.remove('dragging'))

        return container
    },

    updatePosition(data) {
        const eventDragged = CALENDAR.eventDragged
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

            eventDragged.initialDate = CALENDAR.formatDate(dataInicial)
            eventDragged.finalDate = CALENDAR.formatDate(dataFinal)

        } else {
            eventDragged.finalDate = data.dataHour
        }

        CALENDAR.orderDates(eventDragged)

        eventDragged.elements.forEach(element => element.remove())
        WEEK.render([eventDragged])
    },
}

const DAY = {
    arrayHour: [],
    objHourDay: { mode: 'day'},

    nextDate() {
        CALENDAR.day++

        if (CALENDAR.day > CALENDAR.getLastDayThisMonth()) {
            CALENDAR.day = 1
            CALENDAR.month++

            if (CALENDAR.month > 12) {
                CALENDAR.month = 1
                CALENDAR.year++
            }
        }
        DAY.init()
        CALENDAR.updateDates()
    },

    previousDate() {
        CALENDAR.day--

        if (CALENDAR.day < 1) {
            CALENDAR.month--
            CALENDAR.day = new Date(CALENDAR.year, CALENDAR.month + 1, 0).getDate()

            if (CALENDAR.month < 1) {
                CALENDAR.month = 12
                CALENDAR.year--
            }
        }
        DAY.init()
        CALENDAR.updateDates()
    },

    init() {
        CALENDAR.container.innerHTML = ''

        CALENDAR.dayHtml.classList.remove('hide')
        CALENDAR.weekHtml.classList.add('hide')
        CALENDAR.monthHtml.classList.remove('hide')

        const container = document.createElement('div')
        container.classList.add('d-container-day')

        container.appendChild(DAY.divWeek())
        container.appendChild(DAY.divAllDay())
        container.appendChild(DAY.divHorus())

        CALENDAR.container.appendChild(container)
        DAY.render(CALENDAR.events)
    },

    divWeek() {
        const divWeek = document.createElement('div')
        const index = new Date(CALENDAR.year, CALENDAR.month, CALENDAR.day).getDay()
        divWeek.innerHTML = CALENDAR.daysOfWeek[index]
        divWeek.classList.add('d-week')
        return divWeek
    },

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
            MODAL.updateDate({ day: CALENDAR.day, month: CALENDAR.month, year: CALENDAR.year, mode: 'onlyDay' })
            MODAL.open()
        })

        return divAllDay
    },

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

            DAY.arrayHour.push(areaHour)

            areaHour.addEventListener('click', () => MODAL.open())

            areaHour.addEventListener('dragenter', (e) => {
                if (!e.target.classList.contains('d-area-hour')) return
                if (areaHour.change) {
                    DAY.updatePosition(areaHour.hour, areaHour.minutes)
                    areaHour.change = false
                }
            })

            areaHour.addEventListener('dragleave', () => areaHour.change = true)

            areaHour.addEventListener('mousedown', (e) => {
                if (!e.target.classList.contains('d-area-hour')) return
                CALENDAR.selecting = true
                DAY.objHourDay.initial = areaHour.hour
            })

            areaHour.addEventListener('mousemove', () => {
                if (!CALENDAR.selecting) return
                DAY.objHourDay.final = areaHour.hour
                DAY.arrayHour.forEach(hour => {

                    if (hour.hour <= DAY.objHourDay.initial && hour.hour >= DAY.objHourDay.final ||
                        hour.hour >= DAY.objHourDay.initial && hour.hour <= DAY.objHourDay.final) {
                        hour.classList.add('selected')
                    } else {
                        hour.classList.remove('selected')
                    }
                })
            })

            areaHour.addEventListener('mouseup', () => {
                CALENDAR.selecting = false
                DAY.arrayHour.forEach(hour => hour.classList.remove('selected'))
                MODAL.updateDate(DAY.objHourDay)
                MODAL.open()
            })

            divHorus.appendChild(hour)
            divHorus.appendChild(areaHour)
        }

        return divHorus
    },

    updatePosition(hour, minutes) {
        const eventDragged = CALENDAR.eventDragged
        if (!eventDragged) return

        if (eventDragged.action == 'hourMais') {
            const newDate = new Date(eventDragged.initialDate)
            newDate.setHours(hour, minutes)
            newDate.setMonth(newDate.getMonth() + 1)
            eventDragged.initialDate = CALENDAR.formatDate(newDate)
        }

        if (eventDragged.action == 'hourMenos') {
            const newDate = new Date(eventDragged.finalDate)
            newDate.setHours(hour, minutes)
            newDate.setMonth(newDate.getMonth() + 1)
            eventDragged.finalDate = CALENDAR.formatDate(new Date(newDate).setHours(hour))
        }

        CALENDAR.orderDates(eventDragged)

        eventDragged.elements.forEach(e => e.remove())
        DAY.render([eventDragged])
    },

    render(events) {
        events.forEach(event => {
            const initialDate = new Date(event.initialDate)
            const initialDay = new Date(event.initialDate).getDate()

            const initialHour = new Date(event.initialDate).getHours()
            const finalHour = new Date(event.finalDate).getHours()

            const initialMinutes = new Date(event.initialDate).getMinutes()
            const finalMinutes = new Date(event.finalDate).getMinutes()

            if (initialDay !== CALENDAR.day || initialDate.getMonth() + 1 !== CALENDAR.month || initialDate.getFullYear() !== CALENDAR.year) return

            event.elements = []
            const heightColumn = 32.95

            if (event.allDay) {
                event.height = heightColumn
                const element = DAY.createHtml(event)
                event.elements.push(element)
                document.querySelector('.d-area-all-day').appendChild(element)
                return
            }

            if (initialMinutes >= 30) event.index = initialHour * 2 + 1
            else event.index = initialHour * 2

            if (finalMinutes >= 30) event.height = ((finalHour - initialHour) * 2 + 2) * heightColumn
            else event.height = ((finalHour - initialHour) * 2 + 1) * heightColumn

            const element = DAY.createHtml(event)
            event.elements.push(element)
            document.querySelectorAll('.d-area-hour')[event.index].appendChild(element)
        })
    },

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
            MODAL.open()
            MODAL.renderEvent(event)
        })

        if (event.allDay) return container

        const divHours = document.createElement('div')
        divHours.classList.add('d-tips')
        divHours.innerHTML = '-'
        divHours.addEventListener('mousedown', () => event.action = 'hourMenos')
        container.appendChild(divHours)

        container.draggable = 'true'

        container.addEventListener('dragstart', () => {
            CALENDAR.eventDragged = event
            container.classList.add('dragging')
        })

        container.addEventListener('dragend', () => container.classList.remove('dragging'))

        return container
    }
}

const LIST = {
    name: 'list',

    nextDate() {
        CALENDAR.month++
        if (CALENDAR.month > 12) {
            CALENDAR.month = 1
            CALENDAR.year++
        }

        LIST.init()
        CALENDAR.updateDates()
    },

    previousDate() {
        CALENDAR.month--
        if (CALENDAR.month < 1) {
            CALENDAR.month = 12
            CALENDAR.year--
        }

        LIST.init()
        CALENDAR.updateDates()
    },

    init() {
        CALENDAR.container.innerHTML = ''

        CALENDAR.dayHtml.classList.add('hide')
        CALENDAR.weekHtml.classList.add('hide')
        CALENDAR.monthHtml.classList.remove('hide')

        const container = document.createElement('div')
        container.classList.add('l-container-list')

        LIST.render(container, CALENDAR.events)

        CALENDAR.container.appendChild(container)
    },


    render(containerList, events) {
        const placedDays = []

        const divNone = document.createElement('div')
        divNone.innerHTML = 'Nenhum evento para exibir.'
        divNone.classList.add('l-divNone')
        containerList.appendChild(divNone)

        events.forEach(event => {
            const date = new Date(event.initialDate)
            const existingDay = placedDays.find(dias => dias.date.getTime() === date.getTime())

            if (date.getMonth() + 1 !== CALENDAR.month || date.getFullYear() !== CALENDAR.year) return

            if (existingDay) {
                existingDay.element.appendChild(LIST.createHtml(event, date))
                return
            }

            const container = document.createElement('div')
            container.appendChild(LIST.createListHeader(date))
            container.appendChild(LIST.createHtml(event))

            divNone.remove()

            containerList.appendChild(container)
            placedDays.push({ date: date, element: container })
        })
    },

    createListHeader(date) {
        const daySem = document.createElement('div')
        daySem.classList.add('l-day')

        const span = document.createElement('span')
        span.innerHTML = `${date.getDate().toString().padStart(2, '0')} ${CALENDAR.listMonths[date.getMonth() + 1]},  ${date.getFullYear()}`

        const span2 = document.createElement('span')
        span2.innerHTML = CALENDAR.daysOfWeek[date.getDay()]

        daySem.appendChild(span)
        daySem.appendChild(span2)

        return daySem
    },

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
            MODAL.open()
            MODAL.renderEvent(event)
        })

        eventList.appendChild(container)

        event.elements = [eventList]

        return eventList
    },
}

MODAL.init()
CALENDAR.init()
