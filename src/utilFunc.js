export const getDateString = function (date_, format) {
    let date = new Date(date_)
    let day = String(date.getDate());
    if(day.length === 1){
        day = "0" + day;
    }
    let month = String(date.getMonth() + 1);
    if(month.length === 1){
        month = "0" + month;
    }
    let year = String (date.getFullYear());
    var dateString;
    if(format === 1){
        dateString = day + '-' + month + '-' + year;
    }
    else if(format === 0){
        dateString = year + '-' + month + '-' + day;
    }
    return dateString;
}   
