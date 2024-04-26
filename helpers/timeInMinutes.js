
export const readableTime = (timeInMinutes) => {
    let output = ''
    let hours = timeInMinutes / 60
    let minutes = (parseInt(hours.toString().split('.')[1]) * 60).toString().substring(0,2)
    if(minutes == NaN){output = `${Math.floor(hours)} hour(s)`}
    else{output = `${Math.floor(hours)} hour(s) ${minutes} minutes`}
    return output
}
