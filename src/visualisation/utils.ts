import { Node } from "../models/types/Node"
import { Connection } from "../models/types/Connection"
import { TimelineResultItem } from "../dbpedia/models/TimelineResultItem";
import { TimePeriod } from "./models/ChoiceSelection";

// Helper function to get the century of a date
function getCentury(date: Date): number {
    return Math.ceil(date.getFullYear() / 100);
}

// Helper function to get the decade of a date
function getDecade(date: Date): number {
    return Math.floor(date.getFullYear() / 10) * 10;
}

/**
 * Fills in any missing centuries in the grouped dates.
 * 
 * @param {Object} groupedDates - The grouped dates object.
 * @returns {Object} - The grouped dates object with filled centuries.
 */
function fillMissedCenturies(groupedDates: { [key: string]: TimelineResultItem[] }): { [key: string]: TimelineResultItem[] } {
    const centuries = Object.keys(groupedDates).filter((value) => !isNaN(Number(value))).map(key => parseInt(key, 10));

    const minCentury = Math.min(...centuries);
    const maxCentury = Math.max(...centuries);

    const filledGroupedDates: { [key: string]: TimelineResultItem[] } = {};

    for (let century = minCentury; century <= maxCentury; century++) {
        const key = `${century}`;
        filledGroupedDates[key] = groupedDates[key] || [];
    }

    return filledGroupedDates;
}

/**
 * Fills in any missing years in the grouped dates.
 * 
 * @param {Object} groupedDates - The grouped dates object.
 * @returns {Object} - The grouped dates object with filled years.
 */
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

/**
 * Fills in any missing decades in the grouped dates.
 * 
 * @param {Object} groupedDates - The grouped dates object.
 * @returns {Object} - The grouped dates object with filled decades.
 */
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

/**
 * Groups the given data based on the chosen option.
 * 
 * @param {TimelineResultItem[]} data - The data to be grouped.
 * @param {TimePeriod} choice - The chosen time period for grouping.
 * @returns {Object} - The grouped data.
 */
export function groupDates(data: TimelineResultItem[], choice: TimePeriod): { [key: string]: TimelineResultItem[] } {
    let groupedData: { [key: string]: TimelineResultItem[] } = {};

    // Group the dates based on the chosen option
    data.forEach((item) => {
        const date = new Date(item.value.value);

        let key: string;
        switch (choice) {
            case TimePeriod.Century:
                key = `${getCentury(date)}`;
                break;
            case TimePeriod.Decade:
                key = `${getDecade(date)}`;
                break;
            case TimePeriod.Year:
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

    // Fill in any missing dates based on the chosen option
    switch (choice) {
        case TimePeriod.Century:
            groupedData = fillMissedCenturies(groupedData)
            break;
        case TimePeriod.Decade:
            groupedData = fillMissingDecades(groupedData)
            break;
        case TimePeriod.Year:
            groupedData = fillMissingYears(groupedData)
            break;
    }

    return groupedData;
}

/**
 * Creates a mapping of node IDs to their coordinates (cx, cy).
 * 
 * @param {Node[]} list - The list of nodes.
 * @returns {Map<string, { x: number, y: number }>} - The map of node IDs to coordinates.
 */
export const getIdsMapping = (list: Node[]): Map<string, { x: number, y: number }> => {
    const res = new Map();
    list.forEach((x) => {
        res.set(x.id, { "x": x.cx, "y": x.cy });
    });
    return res;
}

/**
 * Adds coordinates to connection links based on their source and target nodes.
 * 
 * @param {Connection[]} links - The list of connection links.
 * @param {Map<string, { x: number, y: number }>} coords - The map of node IDs to coordinates.
 * @returns {Connection[]} - The updated list of connection links with added coordinates.
 */
export const AddCoords = (links: Connection[], coords: Map<string, { x: number, y: number }>): Connection[] => {
    links.forEach(item => {
        item.source = [coords.get(item.from)?.x, coords.get(item.from)?.y];
        item.target = [coords.get(item.to)?.x, coords.get(item.to)?.y];
    });
    return links;
}
