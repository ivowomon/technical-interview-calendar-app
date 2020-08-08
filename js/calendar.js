/*
I assume the app doesn't have persistent state.

This implementation don't allow overlap.

This implementation allow the user to edit all the days of the month,
not just current an future.

Tested on chrome.

*/

const calendarElement = document.querySelector('[data-calendar]')
const calendarHeaderElement = document.querySelector('[data-calendar-header]')

const dayHeaderElement = document.querySelector('[data-day-header]')
const saveBtnElement = document.querySelector('[data-save]')
const deleteBtnElement = document.querySelector('[data-delete]')
const appointmentInputElement = document.querySelector('[data-appointment-input]')

const CURRENT_DATE = new Date()
const CURRENT_MONTH_TEXT = CURRENT_DATE.toLocaleString('default', { month: 'long' });
const currentMonthNumberOfDays = (new Date(CURRENT_DATE.getFullYear(), CURRENT_DATE.getMonth(), 0)).getDate()

let GLOBAL_CALENDAR = generateCalendar(currentMonthNumberOfDays)
let SELECTED_DAY = {}

const selectDay = (dayId) => () => {
  SELECTED_DAY = GLOBAL_CALENDAR.find(({ id }) => id === dayId)
  dayHeaderElement.innerHTML = `Day to edit * ${CURRENT_MONTH_TEXT} ${SELECTED_DAY.day}*`
  appointmentInputElement.value = SELECTED_DAY.appointment

  renderCalendar(GLOBAL_CALENDAR)
  appointmentInputElement.focus()
}

const editAppointment = (appointment) => {
  GLOBAL_CALENDAR = GLOBAL_CALENDAR.map((day) => (
    day.id === SELECTED_DAY.id ?
      { ...day, appointment } :
      day
  ))
  
  renderCalendar(GLOBAL_CALENDAR)
}

const deleteAppointment = () => {
  editAppointment('')
  appointmentInputElement.value = '' 
}

const saveAppointment = () => {
  editAppointment(appointmentInputElement.value)
}

function generateCalendar(numberOfDays) {
  const daysRange = [...Array(numberOfDays).keys()]
  const newCalendar = daysRange.map((day, id) => ({
    id,
    day: day + 1,
    appointment: '',
  }))

  return newCalendar
}

function renderCalendar(calendar) {
  const calendarObjects = calendar.map(({ day, id, appointment }) => {
    const dayElement = document.createElement('div')
    const isSelected = id === SELECTED_DAY.id
    const hasAppointment = Boolean(appointment)

    dayElement.innerHTML = day
    dayElement.className = 'calendar-day'
    dayElement.addEventListener("click", selectDay(id))

    if(isSelected) dayElement.className += ' selected' 
    if(hasAppointment) dayElement.className += ' has-appointment' 

    return dayElement
  })
  calendarElement.innerHTML = '';
  calendarElement.append(...calendarObjects)
}

saveBtnElement.addEventListener("click", saveAppointment)
deleteBtnElement.addEventListener("click", deleteAppointment)

// Initial render
calendarHeaderElement.innerHTML = CURRENT_MONTH_TEXT
renderCalendar(GLOBAL_CALENDAR)