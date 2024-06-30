import { CALENDAR } from './calendar.js'

export const MODAL = {
    element: document.querySelector('.mod-add-event'),
    form: document.querySelector('#modal-form'),

    elementTag: document.querySelector('.mod-tags'), 
    formTag: document.querySelector('#form-modalTags'),

    elementEvents: document.querySelector('.mod-events-hidden'),

    btnSave: document.querySelector('#btn-save-modal'),
    btnEdit: document.querySelector('#btn-edit-modal'),
    btnRemove: document.querySelector('#btn-remove'),
    btnClose: document.querySelector('#btn-close-modal'),
    event: null,
    inputTag: null,
    optionSelect: document.createElement('p'),

    tags: [
        { name: 'Urgente', color: 'red', },
        { name: 'Importante', color: 'orange', },
        { name: 'Normal', color: 'blue', },
        { name: 'Secretaria', color: 'purple', },
        { name: 'Financeiro', color: 'gray', },
    ],

    init() {
        document.querySelector('#btn-close-events').addEventListener("click", () => {
            MODAL.close(MODAL.elementEvents)
        })

        document.querySelector('#btn-close-modal-tag').addEventListener('click', () => {
            MODAL.close(MODAL.elementTag)
        })
        document.querySelector('#btn-save-modal-tag').addEventListener('click', () => {
            MODAL.createTag()
        })

        MODAL.btnClose.addEventListener('click', () => {
            MODAL.close()
        })

        MODAL.btnSave.addEventListener('click', () => {
            CALENDAR.addEvent()
        })

        MODAL.btnEdit.addEventListener('click', () => {
            CALENDAR.updateEvent(MODAL.event)
            MODAL.close()
        })

        MODAL.btnRemove.addEventListener('click', () => {
            CALENDAR.removeEvent(MODAL.event)
            MODAL.close()
        })

        MODAL.form.initialDate.addEventListener('input', () => {
            if (MODAL.form.finalDate.value == '' || MODAL.form.allDay.checked) {
                MODAL.form.finalDate.value = MODAL.form.initialDate.value
            }
        })

        MODAL.form.allDay.addEventListener('input', () => {
            if (MODAL.form.finalDate.disabled) {
                MODAL.form.finalDate.disabled = false
                MODAL.form.finalDate.value = MODAL.form.initialDate.value
                return
            }
            MODAL.form.finalDate.disabled = true
            MODAL.form.finalDate.value = MODAL.form.initialDate.value
        })

        MODAL.createTags()
    },

    open( element = MODAL.element ) {
        element.classList.remove('hide')
    },

    close( element = MODAL.element ) {
        MODAL.clean()
        element.classList.add('hide')
    },

    clean() {
        MODAL.optionSelect.innerHTML = 'Escolha uma Tag'
        MODAL.form.reset()
        MODAL.formTag.reset()
        MODAL.btnRemove.classList.add('hide')
        MODAL.btnEdit.classList.add('hide')
        MODAL.btnSave.classList.remove('hide')
        MODAL.event = null
    },

    updateDate(data) {
        if (data.mode == 'onlyDay') {
            const date = CALENDAR.formatDate(new Date(data.year, data.month, data.day))
            MODAL.form.initialDate.value = date
            MODAL.form.finalDate.value = date
            return
        }

        let dateInitial = CALENDAR.formatDate(data.initial)
        let dateFinal = CALENDAR.formatDate(data.final)

        if (data.mode == 'day') {            
            dateInitial = CALENDAR.formatDate(new Date(CALENDAR.year, CALENDAR.month, CALENDAR.day).setHours(data.initial))
            dateFinal = CALENDAR.formatDate(new Date(CALENDAR.year, CALENDAR.month, CALENDAR.day).setHours(data.final))
        }

        if (data.mode == 'gridWeek') {
            dateInitial = CALENDAR.formatDate(data.initial)
            dateFinal = CALENDAR.formatDate(data.final)
        }

        if (new Date(dateInitial) < new Date(dateFinal)) {
            MODAL.form.initialDate.value = dateInitial
            MODAL.form.finalDate.value = dateFinal
        } else {
            MODAL.form.initialDate.value = dateFinal
            MODAL.form.finalDate.value = dateInitial
        }
    },

    renderEvent(event) {
        MODAL.event = event
        MODAL.form.title.value = event.title
        MODAL.form.description.value = event.description
        MODAL.form.initialDate.value = event.initialDate
        MODAL.form.finalDate.value = event.finalDate
        if (event.allDay) MODAL.form.allDay.checked = true
        MODAL.changeOptionSelect(event.tag)
        MODAL.btnRemove.classList.remove('hide')
        MODAL.btnEdit.classList.remove('hide')
        MODAL.btnSave.classList.add('hide')
    },

    createTags() {
        MODAL.element.addEventListener('click', (e) => {
            if (e.target.classList.contains('mod-option-select') || e.target.classList.contains('mod-container-tag')) return
            if (!e.target.classList.contains('mod-container-options')) containerOptions.classList.add('hide')
        })

        const containerTag = document.querySelector('.mod-container-tag')
        containerTag.addEventListener('click', () => containerOptions.classList.toggle('hide'))

        MODAL.optionSelect.classList.add('mod-option-select')
        MODAL.optionSelect.innerHTML = 'Escolha uma Tag'

        const containerOptions = document.createElement('div')
        containerOptions.classList.add('mod-container-options', 'hide')

        MODAL.tags.forEach(tag => {
            const option = document.createElement('p')
            option.classList.add('mod-option')

            const color = MODAL.createColor(tag)

            option.appendChild(color)
            option.innerHTML += tag.name

            option.addEventListener('click', () => MODAL.changeOptionSelect(tag))

            containerOptions.appendChild(option)
        })

        const newTag = document.createElement('p')
        newTag.classList.add('mod-option')
        newTag.innerHTML = '+ Nova Tag'
        newTag.addEventListener('click', () => MODAL.open(MODAL.elementTag))

        containerOptions.appendChild(newTag)

        containerTag.appendChild(MODAL.optionSelect)
        containerTag.appendChild(containerOptions)
    },

    createColor(tag) {
        const color = document.createElement('span')
        color.classList.add('mod-circle')
        color.style.backgroundColor = tag.color
        return color
    },

    changeOptionSelect(tag) {
        MODAL.optionSelect.innerHTML = ''
        MODAL.optionSelect.appendChild(MODAL.createColor(tag))
        MODAL.optionSelect.innerHTML += tag.name
        MODAL.inputTag = tag
    },

    createTag() {
        const newTag = {
            name: MODAL.formTag.title.value,
            color: MODAL.formTag.color.value
        }

        MODAL.tags.push(newTag)
        MODAL.createTags()
        MODAL.close(MODAL.elementTag)
    },

    showEvent(hiddenChildren) {
        hiddenChildren.forEach(children => {
            children.classList.remove("hide")
            document.querySelector(".results").appendChild(children)
        })
    },
}