import moment from 'moment'

export function formatDate(date: Date) {
  return moment(date).format('DD/MM/YYYY HH:mm:ss')
}
