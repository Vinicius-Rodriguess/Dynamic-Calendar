import { MODAL } from "./modal.js"
import { CALENDAR } from "./calendar.js"

export const LIST = {
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