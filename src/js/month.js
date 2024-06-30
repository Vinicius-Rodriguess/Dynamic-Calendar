import { MODAL } from "./modal.js"
import { CALENDAR } from "./calendar.js"

export const MONTH = {
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