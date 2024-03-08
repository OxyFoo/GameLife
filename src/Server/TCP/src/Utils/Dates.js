/**
 * Code inutilisé, mais peut peut-être être utile pour améliorer le prompt de ZapGPT.
 */

const cache = {
    id: -1,
    data: ''
};

function GetStringWithAllMonthDays() {
    const date = new Date();

    if (cache.id === date.getDate()) {
        return cache.data;
    }

    date.setDate(-15);

    const daysMonth = [];
    for (let i = 0; i < 60; i++) {
        const [ year, month, day ] = date.toISOString().split('T')[0].split('-');
        const dayText = date.toLocaleDateString(undefined, { weekday: 'long' });
        daysMonth.push(`${day}/${month}/${year}: ${dayText}`);
        date.setDate(date.getDate() + 1);
    }

    cache.id = date.getDate();
    cache.data = daysMonth.join(' | ');

    return cache.data;
}

export { GetStringWithAllMonthDays };
