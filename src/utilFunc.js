
// format - 1 ------> dd-mm-yyyy
// format - 0 ------> yyyy-mm-dd
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

//format hh:mm:ss
export const getTimeString = function (date_) {
    let date = new Date(date_)
    let hours = String(date.getHours());
    let seconds = String(date.getSeconds());
    let minutes = String(date.getMinutes());

    return hours + '-' + minutes + '-' + seconds;
}