import { Node } from "../models/types/Node"
import { Connection } from "../models/types/Connection"
import { TimelineResultItem } from "../dbpedia/models/TimelineResultItem";
import { ChoiceSelection } from "./models/ChoiceSelection";

function fillMissedCenturies(groupedDates: { [key: string]: TimelineResultItem[] }): { [key: string]: TimelineResultItem[] } {
    const centuries = Object.keys(groupedDates).filter((value) => !isNaN(Number(value))).map(key => parseInt(key, 10));

    // Find the minimum and maximum centuries
    const minCentury = Math.min(...centuries);
    const maxCentury = Math.max(...centuries);

    // Create a new object to store the filled-in centuries
    const filledGroupedDates: { [key: string]: TimelineResultItem[] } = {};

    // Iterate over the centuries range and fill in any missing centuries
    for (let century = minCentury; century <= maxCentury; century++) {
        const key = `${century}`;
        filledGroupedDates[key] = groupedDates[key] || [];
    }

    return filledGroupedDates;
}

function fillMissingYears(groupedDates: { [key: string]: TimelineResultItem[] }): { [key: string]: TimelineResultItem[] } {
    const filledGroupedDates: { [key: string]: TimelineResultItem[] } = {};

    const years = Object.keys(groupedDates).filter((value) => !isNaN(Number(value))).map((year) => parseInt(year));

    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);

    for (let i = minYear; i <= maxYear; i++) {
        const year = i.toString();
        filledGroupedDates[year] = groupedDates[year] || [];
    }

    return filledGroupedDates;
}

function fillMissingDecades(groupedDates: { [key: string]: TimelineResultItem[] }): { [key: string]: TimelineResultItem[] } {
    const filledGroupedDates: { [key: string]: TimelineResultItem[] } = {};


    const decades = Object.keys(groupedDates).filter((value) => !isNaN(Number(value))).map((decade) => parseInt(decade));

    const minDecade = Math.min(...decades);
    const maxDecade = Math.max(...decades);

    for (let i = minDecade; i <= maxDecade; i += 10) {
        const decade = `${i}`;
        filledGroupedDates[decade] = groupedDates[decade] || [];
    }

    return filledGroupedDates;
}


export function groupDates(data: TimelineResultItem[], choice: ChoiceSelection): { [key: string]: TimelineResultItem[] } {
    let groupedData: { [key: string]: TimelineResultItem[] } = {};


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

export const getIdsMapping = (list: Array<Node>) => {
    const res = new Map()
    list.map((x) => {
        res.set(x.id, { "x": x.cx, "y": x.cy })
    })
    return res
}

export const AddCoords = (links: Array<Connection>, coords: Map<string, {
    x: number;
    y: number;
}>) => {
    links.forEach(item => {
        item.source = [coords.get(item.from)?.x, coords.get(item.from)?.y]
        item.target = [coords.get(item.to)?.x, coords.get(item.to)?.y]
    })
    return links
}