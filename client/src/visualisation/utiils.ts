import { HistoryResultItem } from "../models/HistoryResultItem";

export enum ChoiceSelection {
    Century,
    Decade,
    Year
}

function fillMissedCenturies(groupedDates: { [key: string]: HistoryResultItem[] }): { [key: string]: HistoryResultItem[] } {
    const centuries = Object.keys(groupedDates).filter((value) => !isNaN(Number(value))).map(key => parseInt(key, 10));

    // Find the minimum and maximum centuries
    const minCentury = Math.min(...centuries);
    const maxCentury = Math.max(...centuries);

    // Create a new object to store the filled-in centuries
    const filledGroupedDates: { [key: string]: HistoryResultItem[] } = {};

    // Iterate over the centuries range and fill in any missing centuries
    for (let century = minCentury; century <= maxCentury; century++) {
        const key = `${century}`;
        filledGroupedDates[key] = groupedDates[key] || [];
    }

    return filledGroupedDates;
}

function fillMissingYears(groupedDates: { [key: string]: HistoryResultItem[] }): { [key: string]: HistoryResultItem[] } {
    const filledGroupedDates: { [key: string]: HistoryResultItem[] } = {};

    const years = Object.keys(groupedDates).filter((value) => !isNaN(Number(value))).map((year) => parseInt(year));

    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);

    for (let i = minYear; i <= maxYear; i++) {
        const year = i.toString();
        filledGroupedDates[year] = groupedDates[year] || [];
    }

    return filledGroupedDates;
}

function fillMissingDecades(groupedDates: { [key: string]: HistoryResultItem[] }): { [key: string]: HistoryResultItem[] } {
    const filledGroupedDates: { [key: string]: HistoryResultItem[] } = {};


    const decades = Object.keys(groupedDates).filter((value) => !isNaN(Number(value))).map((decade) => parseInt(decade));

    const minDecade = Math.min(...decades);
    const maxDecade = Math.max(...decades);

    for (let i = minDecade; i <= maxDecade; i += 10) {
        const decade = `${i}`;
        filledGroupedDates[decade] = groupedDates[decade] || [];
    }

    return filledGroupedDates;
}


export function groupDates(data: HistoryResultItem[], choice: ChoiceSelection): { [key: string]: HistoryResultItem[] } {
    let groupedData: { [key: string]: HistoryResultItem[] } = {};


    // Helper function to get the century of a date
    function getCentury(date: Date): number {
        return Math.ceil(date.getFullYear() / 100);
    }

    // Helper function to get the decade of a date
    function getDecade(date: Date): number {
        return Math.floor(date.getFullYear() / 10) * 10;
    }

    // Group the dates based on the chosen option
    data.forEach((item) => {
        const date = new Date(item.value.value);
        const title = item.label.value;

        let key: string;
        switch (choice) {
            case ChoiceSelection.Century:
                key = `${getCentury(date)}`;
                break;
            case ChoiceSelection.Decade:
                key = `${getDecade(date)}`;
                break;
            case ChoiceSelection.Year:
                key = date.getFullYear().toString();
                break;
            default:
                key = 'Invalid grouping option';
        }
        if (!groupedData[key]) {
            groupedData[key] = [];
        }
        groupedData[key].push(item);
    }, {});

    switch (choice) {
        case ChoiceSelection.Century:
            groupedData = fillMissedCenturies(groupedData)
            break;
        case ChoiceSelection.Decade:
            groupedData = fillMissingDecades(groupedData)
            break;
        case ChoiceSelection.Year:
            groupedData = fillMissingYears(groupedData)
            break;
    }

    return groupedData;
}
