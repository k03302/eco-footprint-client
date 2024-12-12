export function hasDatePassed(lastDate: Date) {
    const currentDate = new Date();
    return (currentDate.getFullYear() !== lastDate.getFullYear() ||
        currentDate.getMonth() !== lastDate.getMonth() ||
        currentDate.getDate() !== lastDate.getDate()
    )
}


export function getDayDifference({ from, to }: { from: number, to: number }): number {
    // Get the time difference in milliseconds

    const differenceInMs = Math.abs(from - to);

    // Convert milliseconds to days
    return Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
}

export function getDateFromToday({ dayDiff }: { dayDiff: number }) {
    const currentTime = Date.now();
    const dayTime = 1000 * 60 * 60 * 24;
    return currentTime + dayDiff * dayTime
}