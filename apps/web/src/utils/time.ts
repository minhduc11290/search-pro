const formatTime = (timeString: string): string => {
    try {
        const [hourString, minute] = timeString.split(":");
        const hour = +hourString % 24;
        return (hour % 12 || 12) + ":" + minute + (hour < 12 ? "AM" : "PM");
    } catch (ex) {
        console.log(ex);
        return ""
    }

}
export { formatTime }