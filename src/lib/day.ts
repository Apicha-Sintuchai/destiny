import dayjs from "dayjs"
import "dayjs/locale/th"

dayjs.locale("th")

export const formatDate = (date?: Date) => dayjs(date).format("dddd DD MMMM YYYY")
