import { MODAL } from './modal.js'
import { MONTH } from './month.js'
import { WEEK } from './week.js'
import { DAY } from './day.js'
import { LIST } from './list.js'

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

MODAL.init()
CALENDAR.init()