import { modal } from './modais.js'

export const calendar = {
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
    mode: 'week',

    eventDragged: null,
    selecting: null,

    dayHtml: document.querySelector('#day'),
    weekHtml: document.querySelector('#week'),
    monthHtml: document.querySelector('#month'),
    yearHtml: document.querySelector('#year'),

    events: [
        { id: 0, title: '1 Lembrete', description: 'Sou um lembre muito importante.', initialDate: '2024-06-10T01:00', finalDate: '2024-06-10T01:00', tag: { name: 'trabalho', color: 'red' }},
        { id: 1, title: '10 Lembrete', description: 'Sou um lembre muito importante.', initialDate: '2024-06-10T01:00', finalDate: '2024-06-10T01:00', tag: { name: 'trabalho', color: 'gray' }},
        { id: 2, title: '2 Lembrete', description: 'Sou um lembre muito importante.', initialDate: '2024-06-10T01:00', finalDate: '2024-06-10T01:00', tag: { name: 'escola', color: 'orange' }},
        // { id: 3, title: '3 Lembrete', description: 'Sou um lembre muito importante.', initialDate: '2024-06-18T05:25', finalDate: '2024-06-20T21:26', tag: { name: 'trabalho', color: 'green' } },
        // { id: 5, title: '5 Lembrete', description: 'Sou um lembre muito importante.', initialDate: '2024-06-11T02:25', finalDate: '2024-06-21T21:26', tag: { name: 'trabalho', color: 'blue' } },
        // { id: 6, title: '66666', description: 'Sou um lembre muito importante.', initialDate: '2024-06-10T02:25', finalDate: '2024-06-10T21:26', tag: { name: 'trabalho', color: 'blue' }, allDay: true },
    ],

    init() {
        document.querySelector('#addEvent').addEventListener('click', () => modal.open())
        document.querySelector('#btnWeek').addEventListener('click', () => mWeek.init())
        document.querySelector('#btnOneDay').addEventListener('click', () => mDay.init())
        document.querySelector('#btnList').addEventListener('click', () => mList.init())
        document.querySelector('#btnMonth').addEventListener('click', () => mMonth.init())
        document.querySelector('#btnBackMonth').addEventListener('click', () => calendar.previusDate())
        document.querySelector('#btnNextMonth').addEventListener('click', () => calendar.nextDate())

        mMonth.init()
        calendar.updateDates()
    },

    today() {
        calendar.month = calendar.currentMonth
        calendar.year = calendar.currentYear
        calendar.day = calendar.currentDay

        if (calendar.mode === 'week') mWeek.init()
        if (calendar.mode === 'day') mDay.init()
        if (calendar.mode === 'list') mList.init()
        if (calendar.mode === 'month') mMonth.init()

        calendar.updateDates()
    },

    validEvent() {
        const fields = [...modal.form]
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
        if (!calendar.validEvent()) return

        const event = {
            id: calendar.events.length + 1,
            title: modal.form.title.value,
            description: modal.form.description.value,
            initialDate: modal.form.initialDate.value,
            finalDate: modal.form.finalDate.value,
            tag: modal.inputTag,
            allDay: modal.form.allDay.checked
        }

        // isso vai ser um fetch
        calendar.events.push(event)

        if (calendar.mode === 'week') mWeek.render([event])
        if (calendar.mode === 'day') mDay.render([event])
        if (calendar.mode === 'list') mList.init()
        if (calendar.mode === 'month') mMonth.render([event])

        modal.close()
    },

    updateEvent(event) {
        if (!calendar.validEvent()) return

        event.elements.forEach(e => e.remove())

        event.title = modal.form.title.value
        event.description = modal.form.description.value
        event.initialDate = modal.form.initialDate.value
        event.finalDate = modal.form.finalDate.value
        event.tag = modal.inputTag
        event.allDay = modal.form.allDay.checked

        if (modal.form.allDay.checked) event.finalDate = modal.form.initialDate.value

        if (calendar.mode === 'week') mWeek.render([event])
        if (calendar.mode === 'day') mDay.render([event])
        if (calendar.mode === 'list') mList.init()
        if (calendar.mode === 'month') mMonth.render([event])
    },

    removeEvent(event) {
        event.elements.forEach(e => e.remove())
        if (calendar.mode === 'list') mList.init()

        // isso vai ser um fetch
        calendar.events = calendar.events.filter(e => e.id != event.id)
    },

    formatDate(date) {
        return `${new Date(date).getFullYear()}-${(new Date(date).getMonth()).toString().padStart(2, '0')}-${new Date(date).getDate().toString().padStart(2, '0')}T${new Date(date).getHours().toString().padStart(2, '0')}:${new Date(date).getMinutes().toString().padStart(2, '0')}`
    },

    getLastDayThisMonth() {
        return new Date(calendar.year, calendar.month, 0).getDate()
    },

    getFirstDayOfWeek() {
        return new Date(calendar.year, calendar.month - 1, 1).getDay() - 1
    },

    orderDates(event) {
        if (new Date(event.initialDate) > new Date(event.finalDate)) {
            [event.initialDate, event.finalDate] = [event.finalDate, event.initialDate]
        }
    },

    nextDate() {
        if (calendar.mode === 'week') mWeek.nextDate()
        if (calendar.mode === 'day') mDay.nextDate()
        if (calendar.mode === 'list') mList.nextDate()
        if (calendar.mode === 'month') mMonth.nextDate()
    },

    previusDate() {
        if (calendar.mode === 'week') mWeek.previusDate()
        if (calendar.mode === 'day') mDay.previusDate()
        if (calendar.mode === 'list') mList.previusDate()
        if (calendar.mode === 'month') mMonth.previusDate()
    },

    updateDates() {
        calendar.dayHtml.innerHTML = calendar.day.toString().padStart(2, '0')
        calendar.weekHtml.innerHTML = calendar.week
        calendar.monthHtml.innerHTML = calendar.listMonths[calendar.month]
        calendar.yearHtml.innerHTML = calendar.year
    },
}

const mDay = {
    arrayHour: [],
    objHourDay: { mode: 'day' },

    nextDate() {
        calendar.day++

        if (calendar.day > calendar.getLastDayThisMonth()) {
            calendar.day = 1
            calendar.month++

            if (calendar.month > 12) {
                calendar.month = 1
                calendar.year++
            }
        }
        mDay.init()
        calendar.updateDates()
    },

    previusDate() {
        calendar.day--

        if (calendar.day < 1) {
            calendar.month--
            calendar.day = new Date(calendar.year, calendar.month + 1, 0).getDate()

            if (calendar.month < 1) {
                calendar.month = 12
                calendar.year--
            }
        }
        mDay.init()
        calendar.updateDates()
    },

    init() {
        calendar.mode = 'day'
        calendar.container.innerHTML = ''

        calendar.dayHtml.classList.remove('hide')
        calendar.weekHtml.classList.add('hide')
        calendar.monthHtml.classList.remove('hide')

        const container = document.createElement('div')
        container.classList.add('d-container-day')

        container.appendChild(mDay.divWeek())
        container.appendChild(mDay.divAllDay())
        container.appendChild(mDay.divHorus())

        calendar.container.appendChild(container)
        mDay.render(calendar.events)
    },

    divWeek() {
        const divWeek = document.createElement('div')
        const index = new Date(calendar.year, calendar.month, calendar.day).getDay()
        divWeek.innerHTML = calendar.daysOfWeek[index]
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
            modal.updateDate({ day: calendar.day, month: calendar.month, year: calendar.year, mode: 'onlyDay' })
            modal.open()
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

            mDay.arrayHour.push(areaHour)

            areaHour.addEventListener('click', () => modal.open())

            areaHour.addEventListener('dragenter', (e) => {
                if (!e.target.classList.contains('d-area-hour')) return
                if (areaHour.change) {
                    mDay.updatePosition(areaHour.hour, areaHour.minutes)
                    areaHour.change = false
                }
            })

            areaHour.addEventListener('dragleave', () => areaHour.change = true)

            areaHour.addEventListener('mousedown', (e) => {
                if (!e.target.classList.contains('d-area-hour')) return
                calendar.selecting = true
                mDay.objHourDay.initial = areaHour.hour
            })

            areaHour.addEventListener('mousemove', () => {
                if (!calendar.selecting) return
                mDay.objHourDay.final = areaHour.hour
                mDay.arrayHour.forEach(hour => {

                    if (hour.hour <= mDay.objHourDay.initial && hour.hour >= mDay.objHourDay.final ||
                        hour.hour >= mDay.objHourDay.initial && hour.hour <= mDay.objHourDay.final) {
                        hour.classList.add('selected')
                    } else {
                        hour.classList.remove('selected')
                    }
                })
            })

            areaHour.addEventListener('mouseup', () => {
                calendar.selecting = false
                mDay.arrayHour.forEach(hour => hour.classList.remove('selected'))
                modal.updateDate(mDay.objHourDay)
                modal.open()
            })

            divHorus.appendChild(hour)
            divHorus.appendChild(areaHour)
        }

        return divHorus
    },

    updatePosition(hour, minutes) {
        const eventDragged = calendar.eventDragged
        if (!eventDragged) return

        if (eventDragged.action == 'hourMais') {
            const newDate = new Date(eventDragged.initialDate)
            newDate.setHours(hour, minutes)
            newDate.setMonth(newDate.getMonth() + 1)
            eventDragged.initialDate = calendar.formatDate(newDate)
        } 

        if (eventDragged.action == 'hourMenos') {
            const newDate = new Date(eventDragged.finalDate)
            newDate.setHours(hour, minutes)
            newDate.setMonth(newDate.getMonth() + 1)
            eventDragged.finalDate = calendar.formatDate(new Date(newDate).setHours(hour))
        }

        calendar.orderDates(eventDragged)

        eventDragged.elements.forEach(e => e.remove())
        mDay.render([eventDragged])
    },

    render(events) {
        events.forEach(event => {
            const initialDate = new Date(event.initialDate)
            const initialDay = new Date(event.initialDate).getDate()

            const initialHour = new Date(event.initialDate).getHours()
            const finalHour = new Date(event.finalDate).getHours()

            const initialMinutes = new Date(event.initialDate).getMinutes()
            const finalMinutes = new Date(event.finalDate).getMinutes()

            if (initialDay !== calendar.day || initialDate.getMonth() + 1 !== calendar.month || initialDate.getFullYear() !== calendar.year) return

            event.elements = []
            const heightColumn = 32.95

            if (event.allDay) {
                event.height = heightColumn
                const element = mDay.createHtml(event)
                event.elements.push(element)
                document.querySelector('.d-area-all-day').appendChild(element)
                return
            }

            if (initialMinutes >= 30) event.index = initialHour * 2 + 1
            else event.index = initialHour * 2
    
            if (finalMinutes >= 30) event.height = ((finalHour - initialHour) * 2 + 2) * heightColumn
            else event.height = ((finalHour - initialHour) * 2 + 1) * heightColumn

            const element = mDay.createHtml(event)
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
            modal.open()
            modal.renderEvent(event)
        })

        if (event.allDay) return container

        const divHours = document.createElement('div')
        divHours.classList.add('d-tips')
        divHours.innerHTML = '-'
        divHours.addEventListener('mousedown', () => event.action = 'hourMenos')
        container.appendChild(divHours)

        container.draggable = 'true'

        container.addEventListener('dragstart', () => {
            calendar.eventDragged = event
            container.classList.add('dragging')
        })

        container.addEventListener('dragend', () => container.classList.remove('dragging'))

        return container
    }
}

const mList = {

    nextDate() {
        calendar.month++
        if (calendar.month > 12) {
            calendar.month = 1
            calendar.year++
        }

        mList.init()
        calendar.updateDates()
    },

    previusDate() {
        calendar.month--
        if (calendar.month < 1) {
            calendar.month = 12
            calendar.year--
        }

        mList.init()
        calendar.updateDates()
    },

    init() {
        calendar.mode = 'list'
        calendar.container.innerHTML = ''

        calendar.dayHtml.classList.add('hide')
        calendar.weekHtml.classList.add('hide')
        calendar.monthHtml.classList.remove('hide')

        const container = document.createElement('div')
        container.classList.add('l-container-list')

        mList.render(container, calendar.events)

        calendar.container.appendChild(container)
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

            if (date.getMonth() + 1 !== calendar.month || date.getFullYear() !== calendar.year) return

            if (existingDay) {
                existingDay.element.appendChild(mList.createHtml(event, date))
                return
            }

            const container = document.createElement('div')
            container.appendChild(mList.createListHeader(date))
            container.appendChild(mList.createHtml(event))

            divNone.remove()

            containerList.appendChild(container)
            placedDays.push({ date: date, element: container })
        })
    },

    createListHeader(date) {
        const daySem = document.createElement('div')
        daySem.classList.add('l-day')

        const span = document.createElement('span')
        span.innerHTML = `${date.getDate().toString().padStart(2, '0')} ${calendar.listMonths[date.getMonth() + 1]},  ${date.getFullYear()}`

        const span2 = document.createElement('span')
        span2.innerHTML = calendar.daysOfWeek[date.getDay()]

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
            modal.open()
            modal.renderEvent(event)
        })

        eventList.appendChild(container)

        event.elements = [eventList]

        return eventList
    },
}

const mWeek = {
    matrizWeek: [],
    matrizHourDay: [],
    currentWeek: null,

    allDayDays: [],


    objDateDay: {},
    objDateWeek: { mode: 'gridWeek' },

    nextDate() {
        calendar.day = calendar.day + 7

        if (calendar.day > calendar.getLastDayThisMonth()) {
            calendar.day = 1
            calendar.month++

            if (calendar.month > 12) {
                calendar.month = 1
                calendar.year++
            }
        }

        mWeek.init()
    },

    previusDate() {
        calendar.day = calendar.day - 7

        if (calendar.day < 1) {
            calendar.month--
            calendar.day = new Date(calendar.year, calendar.month + 1, 0).getDate()

            if (calendar.month < 1) {
                calendar.month = 12
                calendar.year--
            }
        }

        mWeek.init()
    },

    changeWeek() {
        let line = []

        for (let i = -calendar.getFirstDayOfWeek(); i < 42 - calendar.getFirstDayOfWeek(); i++) {
            const date = new Date(calendar.year, calendar.month, i)

            const day = {}
            day.day = date.getDate()
            day.month = date.getMonth()

            line.push(day)
            if (line.length == 7) {
                mWeek.matrizWeek.push(line)
                line = []
            }
        }

        const lines = +(((calendar.day + calendar.getFirstDayOfWeek()) / 7).toString().slice(0, 1))
        const initialDate = mWeek.matrizWeek[lines][0]
        const finalDate = mWeek.matrizWeek[lines][6]

        const date = `${initialDate.day.toString().padStart(2, '0')} ${calendar.listMonths[initialDate.month]} - ${finalDate.day.toString().padStart(2, '0')} ${calendar.listMonths[finalDate.month]}`
        mWeek.currentWeek = mWeek.matrizWeek[lines]

        calendar.week = date
        calendar.updateDates()
    },

    init() {
        calendar.mode = 'week'
        calendar.container.innerHTML = ''

        calendar.dayHtml.classList.add('hide')
        calendar.weekHtml.classList.remove('hide')
        calendar.monthHtml.classList.add('hide')

        mWeek.matrizHourDay = []
        mWeek.matrizWeek = []

        const container = document.createElement('div')
        container.classList.add('w-container-week')

        mWeek.changeWeek()

        container.appendChild(mWeek.divWeek())
        container.appendChild(mWeek.divAllDay())
        container.appendChild(mWeek.divHours())

        calendar.container.appendChild(container)

        mWeek.render(calendar.events)
    },

    divWeek() {
        const divWeek = document.createElement('div')
        divWeek.classList.add('w-grid')

        const firstChild = document.createElement('div')
        firstChild.classList.add('w-day-week')
        divWeek.appendChild(firstChild)

        calendar.daysOfWeek.forEach((day, i) => {
            const child = document.createElement('div')
            child.innerHTML += `${day.slice(0, 3)} ${mWeek.currentWeek[i].day.toString().padStart(2, '0')}/${mWeek.currentWeek[i].month.toString().padStart(2, '0')}`
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

            day.day = mWeek.currentWeek[i].day
            day.month = mWeek.currentWeek[i].month
            day.year = calendar.year
            day.date = new Date(day.year, day.month, day.day)

            if (day.day == calendar.currentDay && day.month == calendar.currentMonth && day.year == calendar.currentYear) day.classList.add('w-today')

            mWeek.allDayDays.push(day)

            day.addEventListener('dragenter', () => mWeek.updatePosition({ day: calendar.formatDate(new Date(day.year, day.month, day.day)) }))

            day.addEventListener('click', () => {
                modal.updateDate({ day: day.day, month: day.month, year: day.year, mode: 'onlyDay' })
                modal.open()
            })

            day.addEventListener('mousedown', (e) => {
                if (!e.target.classList.contains('w-all-day')) return
                calendar.selecting = true
                mWeek.objDateDay.initial = day.date
            })

            day.addEventListener('mousemove', () => {
                if (!calendar.selecting) return
                mWeek.objDateDay.final = day.date
                const D = mWeek.objDateDay
                mWeek.allDayDays.forEach(day => {
                    day.classList.remove('selected')
                    const isDayInRange = (day.date >= D.initial && day.date <= D.final) || (day.date <= D.initial && day.date >= D.final)
                    if (isDayInRange) day.classList.add('selected')
                })
            })

            day.addEventListener('mouseup', () => {
                calendar.selecting = false
                mWeek.allDayDays.forEach(day => day.classList.remove('selected'))
                modal.open()
                modal.updateDate(mWeek.objDateDay)
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
        
                area.day = mWeek.currentWeek[j].day
                area.month = mWeek.currentWeek[j].month
                area.year = calendar.year
                area.date = new Date(calendar.year, mWeek.currentWeek[j].month, mWeek.currentWeek[j].day).setHours(hours, minutes)
        
                if (area.day == calendar.currentDay && area.month == calendar.currentMonth && area.year == calendar.currentYear) area.classList.add('w-today')

                area.addEventListener('click', () => modal.open())

                area.addEventListener('dragenter', () => {
                    if (area.change) {
                        mWeek.updatePosition({
                            dataHour: calendar.formatDate(new Date(new Date(area.date).setHours(hours, minutes))),
                            day: calendar.formatDate(new Date(area.date)),
                        })
                        area.change = false
                    }
                })

                area.addEventListener('dragleave', () => area.change = true)

                area.addEventListener('mousedown', (e) => {
                    if (!e.target.classList.contains('w-hour')) return
                    calendar.selecting = true
                    mWeek.objDateWeek.initial = area.date
                })

                area.addEventListener('mousemove', () => {
                    if (!calendar.selecting) return
                    mWeek.objDateWeek.final = area.date

                    mWeek.matrizHourDay.forEach(line => {
                        line.forEach(hour => {
                            if (hour.date <= mWeek.objDateWeek.initial && hour.date >= mWeek.objDateWeek.final ||
                                hour.date >= mWeek.objDateWeek.initial && hour.date <= mWeek.objDateWeek.final) {
                                hour.classList.add('selected')
                            } else {
                                hour.classList.remove('selected')
                            }
                        })
                    })
                })

                area.addEventListener('mouseup', () => {
                    calendar.selecting = false
                    mWeek.matrizHourDay.forEach(line => line.forEach(hour => hour.classList.remove('selected')))
                    modal.updateDate(mWeek.objDateWeek)
                    modal.open()
                })

                line.push(area)
                divHours.appendChild(area)
            }
            mWeek.matrizHourDay.push(line)
        }

        return divHours
    },

    render(event) {
        event.forEach(event => {
            const initialDate = new Date(event.initialDate)

            const diaInicialDaSemana = mWeek.currentWeek[0].day
            const diaFinalDaSemana = mWeek.currentWeek[6].day

            if (initialDate.getDate() < diaInicialDaSemana ||
                initialDate.getDate() > diaFinalDaSemana ||
                initialDate.getMonth() + 1 !== calendar.month ||
                initialDate.getFullYear() !== calendar.year) return

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
                const element = mWeek.createHtml(event)
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
        
                const element = mWeek.createHtml(event)
                mWeek.matrizHourDay[event.index][initialDate.getDay()].appendChild(element)
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

                    const element = mWeek.createHtml(event)
                    mWeek.matrizHourDay[event.index][index].appendChild(element)
                    event.elements.push(element)
                }

                if (i > initialDay && i < finalDay) {
                    event.height = 48 * heightColumn
                    const element = mWeek.createHtml(event)
                    mWeek.matrizHourDay[0][index].appendChild(element)
                    event.elements.push(element)
                }

                if (i == finalDay) {
                    if (finalMinutes >= 30) event.height = ((finalHour * 2) + 2) * heightColumn
                    else event.height = ((finalHour * 2) + 1) * heightColumn

                    const element = mWeek.createHtml(event)
                    mWeek.matrizHourDay[0][index].appendChild(element)
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
            modal.open()
            modal.renderEvent(event)
        })

        container.addEventListener('dragstart', () => {
            calendar.eventDragged = event
            container.classList.add('dragging')
        })

        container.addEventListener('dragend', () => container.classList.remove('dragging'))

        return container
    },

    updatePosition(data) {
        const eventDragged = calendar.eventDragged
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

            eventDragged.initialDate = calendar.formatDate(dataInicial)
            eventDragged.finalDate = calendar.formatDate(dataFinal)

        } else {
            eventDragged.finalDate = data.dataHour
        }

        calendar.orderDates(eventDragged)

        eventDragged.elements.forEach(element => element.remove())
        mWeek.render([eventDragged])
    },
}

const mMonth = {
    matrizDays: [],
    areas: 42,
    dates: {},

    nextDate() {
        calendar.month++
        if (calendar.month > 12) {
            calendar.month = 1
            calendar.year++
        }

        mMonth.init()
        calendar.updateDates()
    },

    previusDate() {
        calendar.month--
        if (calendar.month < 1) {
            calendar.month = 12
            calendar.year--
        }

        mMonth.init()
        calendar.updateDates()
    },

    init() {
        calendar.mode = 'month'
        calendar.container.innerHTML = ''

        calendar.dayHtml.classList.add('hide')
        calendar.weekHtml.classList.add('hide')
        calendar.monthHtml.classList.remove('hide')

        mMonth.matrizDays = []

        const container = document.createElement('div')
        container.classList.add('m-container-month')

        container.appendChild(mMonth.createWeek())
        container.appendChild(mMonth.createDays())

        calendar.container.appendChild(container)
        mMonth.resize()
        mMonth.render(calendar.events)
    },

    createWeek() {
        const container = document.createElement('div')
        container.classList.add('m-weeks')

        calendar.daysOfWeek.forEach(d => {
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

        const indexArea = mMonth.areas - calendar.getFirstDayOfWeek()
        let line = []

        for (let i = -calendar.getFirstDayOfWeek(); i < indexArea; i++) {
            const date = new Date(calendar.year, calendar.month, i)

            const day = document.createElement('div')
            day.classList.add('m-day')

            day.day = date.getDate()
            day.month = date.getMonth()
            day.year = date.getFullYear()
            day.date = date

            day.innerHTML += `<div class='m-value-day'>${date.getDate()}</div>`

            if (date.getFullYear() == calendar.currentYear &&
                date.getMonth() == calendar.currentMonth &&
                date.getDate() == calendar.currentDay) {
                day.classList.add('m-today')
            }

            if (i < 1 || i > calendar.getLastDayThisMonth()) day.classList.add('disable')

            line.push(day)
            if (line.length == 7) {
                mMonth.matrizDays.push(line)
                line = []
            }

            day.addEventListener('dragenter', () => {
                if (day.change) {
                    mMonth.updatePosition(day)
                    day.change = false
                }
            })

            day.addEventListener('dragleave', () => day.change = true)

            day.addEventListener('click', () => {
                modal.updateDate({ day: day.day, month: day.month, year: day.year, mode: 'onlyDay' })
                modal.open()
            })

            day.addEventListener('mousedown', (e) => {
                if (!e.target.classList.contains('m-day')) return
                calendar.selecting = true
                mMonth.dates.initial = day.date
            })

            day.addEventListener('mousemove', () => {
                if (!calendar.selecting) return
                mMonth.dates.final = day.date
                const D = mMonth.dates
                mMonth.matrizDays.forEach(semana => {
                    semana.forEach(day => {
                        day.classList.remove('selected')
                        const isDayInRange = (day.date >= D.initial && day.date <= D.final) || (day.date <= D.initial && day.date >= D.final)
                        if (isDayInRange) day.classList.add('selected')
                    })
                })
            })

            day.addEventListener('mouseup', () => {
                calendar.selecting = false
                mMonth.matrizDays.forEach(sem => sem.forEach(day => day.classList.remove('selected')))
                modal.updateDate(mMonth.dates)
                modal.open()
            })

            containerDays.appendChild(day)
        }

        return containerDays
    },

    render(events) {
        events.forEach(event => {
            const initialDate = new Date(event.initialDate)
            const finalDate = new Date(event.finalDate)
            const line = +(((initialDate.getDate() + calendar.getFirstDayOfWeek()) / 7).toString().slice(0, 1))

            const widthEvent = document.querySelector('.m-day').clientWidth

            let daysLong = finalDate.getDate() - initialDate.getDate() + 1

            if (initialDate.getMonth() + 1 !== calendar.month || initialDate.getFullYear() !== calendar.year) return

            event.elements = []

            if ((initialDate.getDay() + daysLong) > 7) {
                event.width = (7 - initialDate.getDay()) * widthEvent
                const element = mMonth.createEvent(event)
                event.elements.push(element)
                mMonth.matrizDays[line][initialDate.getDay()].appendChild(element)
                daysLong = daysLong - (7 - initialDate.getDay())
                let i = 1

                while (daysLong > 7) {
                    event.width = 7 * widthEvent
                    const element2 = mMonth.createEvent(event)
                    event.elements.push(element2)
                    mMonth.matrizDays[line + i][0].appendChild(element2)
                    daysLong = daysLong - 7
                    i++

                }

                event.width = daysLong * widthEvent
                const element3 = mMonth.createEvent(event)
                event.elements.push(element3)
                mMonth.matrizDays[line + i][0].appendChild(element3)

                return
            }

            event.width = daysLong * widthEvent
            const element = mMonth.createEvent(event)
            event.elements.push(element)

            mMonth.matrizDays[line][initialDate.getDay()].appendChild(element)
            mMonth.agroupChildren(mMonth.matrizDays[line][initialDate.getDay()])
        })
    },

    agroupChildren(day){
        if ( day.children.length > 2) return

        const array = [...day.children]
        console.log(array)

        console.log("foi")
    }, 

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
            modal.open()
            modal.renderEvent(event)
        })

        container.addEventListener('dragstart', () => {
            calendar.eventDragged = event
            container.classList.add('dragging')
        })

        container.addEventListener('dragend', () => container.classList.remove('dragging'))

        return container
    },

    updatePosition(date) {
        const eventDragged = calendar.eventDragged
        if (!eventDragged) return

        if (eventDragged.action == 'arrastaMenos') {
            eventDragged.initialDate = calendar.formatDate(new Date(calendar.year, date.month, date.day))
        }

        if (eventDragged.action == 'arrastaTudo') {
            const initialDate = new Date(eventDragged.initialDate)
            const finalDate = new Date(eventDragged.finalDate)
            const duration = finalDate.getDate() - initialDate.getDate()

            const newDate = new Date(calendar.year, date.month, date.day)
            eventDragged.initialDate = calendar.formatDate(newDate)
            eventDragged.finalDate = calendar.formatDate(new Date(newDate.setDate(newDate.getDate() + duration)))
        }

        if (eventDragged.action == 'arrastaMais') {
            eventDragged.finalDate = calendar.formatDate(new Date(calendar.year, date.month, date.day))
        }

        calendar.orderDates(eventDragged)

        eventDragged.elements.forEach(e => e.remove())
        mMonth.render([eventDragged])
    },

    resize() {
        window.addEventListener('resize', () => {
            calendar.events.forEach(e => e.elements.forEach(event => event.remove()))
            mMonth.render(calendar.events)
        })
    },
}

modal.initialize()
calendar.init()