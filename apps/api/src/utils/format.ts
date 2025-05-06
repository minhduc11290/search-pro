export function formatDate(date: Date) {
    const month = date.toLocaleString('en-US', { month: 'short' }); // "Apr"
    const day = String(date.getDate()).padStart(2, '0');            // "09"
    const year = date.getFullYear();                                // 2025
    const hour = String(date.getHours()).padStart(2, '0');          // "11"
    const minute = String(date.getMinutes()).padStart(2, '0');      // "00"

    return `${month}-${day}-${year} ${hour}:${minute}`;
}