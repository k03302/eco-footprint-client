export function hasDatePassed(lastDate: Date) {
    const currentDate = new Date();
    return (currentDate.getFullYear() !== lastDate.getFullYear() ||
        currentDate.getMonth() !== lastDate.getMonth() ||
        currentDate.getDate() !== lastDate.getDate()
    )
}