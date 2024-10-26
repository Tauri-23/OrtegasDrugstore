/*
|----------------------------------------
| Empty or spaces string checker
|----------------------------------------
*/

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
    const realDateTime = new Date();

    const timeOptions = {hour: 'numeric', minute: 'numeric', hour12: true};
    const formattedTime = realDateTime.toLocaleTimeString('en-PH', timeOptions);

    return `${formatDate(dateTime)} ${formattedTime}`;
}

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