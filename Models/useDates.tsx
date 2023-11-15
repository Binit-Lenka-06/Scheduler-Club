import dayjs from "dayjs";


export const generateDate = (
    month = dayjs().month(),
    year = dayjs().year()
) => {
    const firstDayOfMonth = dayjs().year(year).month(month).startOf("month")
    const lastDayOfMonth = dayjs().year(year).month(month).endOf("month")

    const arrayofDate = [];

    for(let i=0; i<firstDayOfMonth.day(); i++){
        const date = firstDayOfMonth.day(i);

        arrayofDate.push({currentMonth:false, date})
        
    }
    for (let i = firstDayOfMonth.date(); i <= lastDayOfMonth.date(); i++) {
		arrayofDate.push({
			currentMonth: true,
			date: firstDayOfMonth.date(i),
			today:firstDayOfMonth.date(i).toDate().toDateString() === dayjs().toDate().toDateString(),
		});
	}

    const remaining = 42 - arrayofDate.length;

    for(let i = lastDayOfMonth.date()+1; i<= lastDayOfMonth.date()+remaining; i++){
        arrayofDate.push({
            currentMonth: false,
            date: lastDayOfMonth.date(i)
        })
    }
    return arrayofDate
}

export const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

export default function cn(...classes) {
    return classes.filter(Boolean).join(" ")
}