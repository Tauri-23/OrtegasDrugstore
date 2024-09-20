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