export function hasDatePassed(lastDate: Date) {
    const currentDate = new Date();
    return (currentDate.getFullYear() !== lastDate.getFullYear() ||
        currentDate.getMonth() !== lastDate.getMonth() ||
        currentDate.getDate() !== lastDate.getDate()
    )
}


export function getDayDifference(date1: Date, date2: Date): number {
    // Get the time difference in milliseconds
    const differenceInMs = Math.abs(date2.getTime() - date1.getTime());

    // Convert milliseconds to days
    return Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
}