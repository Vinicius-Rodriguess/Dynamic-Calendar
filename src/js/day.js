import { MODAL } from "./modal.js"
import { CALENDAR } from "./calendar.js"

export const DAY = {
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