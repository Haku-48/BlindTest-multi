/* Format a second number in mm:ss */
function formatSecond(seconds : number) : string {
    const minutes = Math.floor(seconds/60);
    const sec = seconds%60;

    return `${minutes}:${String(sec).padStart(2,"0")}`
}

export default {
    formatSecond : formatSecond
}