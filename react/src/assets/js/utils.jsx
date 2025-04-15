/*
|----------------------------------------
| Empty or spaces string checker
|----------------------------------------
*/

import dayjs from "dayjs";
import { toast } from "react-toastify";

/**
 * 
 * @param {string} str
 */
export function isEmptyOrSpaces(str) {
    return str === null || str.match(/^ *$/) !== null;
}





/*
|----------------------------------------
| Toast and Modals
|----------------------------------------
*/
/**
@param {string} type - Type of toast (success, default, error).
@param {string} message - Message of the toast.
@param {string} position - Position of the toast (top-left, top-center, top-right, bottom-left bottom-center, bottom-right).
@param {number} ms - Duration of the toast in ms.
*/
export function notify(type, message, position, ms) {
    if(type == 'success') {
        toast.success(message, {
            position: position,
            autoClose: ms,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }
    else if(type === 'default') {
        toast(message, {
            position: position,
            autoClose: ms,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }
    else if(type === 'error') {
        toast.error(message, {
            position: position,
            autoClose: ms,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }
}





/*
|----------------------------------------
| Format Currency to
|----------------------------------------
*/
/**
 * 
 * @param {number} value
 */
export const formatToPhilPeso = (value) => {
    return new Intl.NumberFormat('en-PH', {style: 'currency', currency: 'PHP'}).format(value);
}

export const formatNumbersTwoDec = (value) => {
    return Number(value).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};





/*
|----------------------------------------
| Format Currency to
|----------------------------------------
*/
export const calculatePercentageDifference = (a, b) => {
    const result = (Math.abs(a - b) / ((a + b) / 2)) * 100;
    return parseFloat(result.toFixed(2));
};





/*
|----------------------------------------
| Format Date MM dd, YYYY && MM dd, YYYY h:s a
|----------------------------------------
*/
export const formatDate = (date) => {
    const realDate = new Date(date);
    const options = {month: 'short', day: '2-digit', year: 'numeric'}
    return realDate.toLocaleDateString('en-PH', options);
}

export const formatDateTime = (dateTime) => {
    // Convert the input dateTime string to a Date object
    const realDateTime = new Date(dateTime);

    // Format the date part (assuming you have a formatDate function)
    const formattedDate = formatDate(realDateTime);

    // Format the time part
    const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    const formattedTime = realDateTime.toLocaleTimeString('en-PH', timeOptions);

    return `${formattedDate} ${formattedTime}`;
};

export const getTimeAgo = (timestamp) => {
    // Convert Firestore Timestamp to JavaScript Date object
    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);

    // Calculate the time difference between now and the given timestamp
    const now = new Date();
    const timeDifference = now - date; // Time difference in milliseconds

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (minutes < 1) {
        return "Just now";
    } else if (minutes < 60) {
        return `${minutes}m`;
    } else if (hours < 24) {
        return `${hours}h`;
    } else {
        const days = Math.floor(hours / 24);
        return `${days}d`;
    }
}





/**
 * Interpretations
 * @param {*} forecast 
 * @param {string} mode - Monthly | Weekly
 * @returns 
 */
export const getInterpretationSummary = (forecast, mode) => {
    if (!forecast || forecast.length === 0) return "<p>No forecast data available.</p>";

    const startDate = dayjs(forecast[0].ds).format("MMMM D, YYYY");
    const changes = [];

    let upCount = 0;
    let downCount = 0;

    for (let i = 1; i < forecast.length; i++) {
        const prev = forecast[i - 1];
        const current = forecast[i];
        const diff = current.yhat - prev.yhat;

        if (diff < 0) {
            downCount++;
            changes.push(`<li class="color-red1">On ${formatDate(current.ds)}, it may drop from ${prev.yhat.toFixed(2)} to ${current.yhat.toFixed(2)} ⬇️</li>`);
        } else if (diff > 0) {
            upCount++;
            changes.push(`<li class="color-green1">On ${formatDate(current.ds)}, it may rise from ${prev.yhat.toFixed(2)} to ${current.yhat.toFixed(2)} ⬆️</li>`);
        } else {
            changes.push(`<li>On ${formatDate(current.ds)}, no change is expected (still at ${current.yhat.toFixed(2)}) ➡️</li>`);
        }
    }

    let overallTrend = "remain stable";
    if (upCount > downCount) {
        overallTrend = "slowly go up";
    } else if (downCount > upCount) {
        overallTrend = "slowly go down";
    }

    const summary = `<p>📅 <strong>${mode} Forecast Summary</strong><br>Starting <strong>${startDate}</strong>, values are expected to <strong>${overallTrend}</strong>.</p>`;

    const warning =
        downCount >= 5
            ? "<p>⚠️ This shows a steady decrease in demand for the week.</p>"
            : upCount >= 5
            ? "<p>📈 This indicates a consistent upward trend.</p>"
            : "";

    return summary + "<ul>" + changes.join("") + "</ul>" + warning;
};
