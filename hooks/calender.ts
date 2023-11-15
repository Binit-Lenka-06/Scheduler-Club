export const generateDate = (year:any, month:any) => {
    const month_start_date = new Date (year, month, 1);
    const month_end_date = new Date (year, month+1, 0)
    const previous_month_end_Date = new Date(year, month, 0)
    const dateArray = []
    for (let i = previous_month_end_Date.getDate()-month_start_date.getDay()+1; i <= previous_month_end_Date.getDate(); i++) {
        dateArray.push({current_month:false,  date:new Date(year, month-1, i)})
    }
    for (let i = month_start_date.getDate(); i <= month_end_date.getDate(); i++) {
        dateArray.push({current_month:true, date: new Date(year, month, i), today: new Date().toDateString() === new Date(year, month, i).toDateString()})
    }
    for (let i = 1; i < 42 - (month_end_date.getDate() + month_start_date.getDay()-1); i++) {
        dateArray.push({current_month:false, date: new Date(year, month+1, i)})
    }
    return dateArray
}

export const months = [
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