import { groupBy } from 'lodash';

const generateRandomDate = (start: Date, end: Date) => {
    const startDate = start.getTime();
    const endDate = end.getTime();
    const randomTimestamp = startDate + Math.random() * (endDate - startDate);
    return new Date(randomTimestamp);
};

const startDate = new Date('1300-01-01');
const endDate = new Date('2030-12-31');

export const randomDates = Array.from({ length: 30 }, () => ({
    date: generateRandomDate(startDate, endDate),
}));

// console.log(randomDates);

export interface DateGroup {
    group: string;
    dates: Date[];
    century?: string;
    decade?: string;
    year?: string;
    month?: string;
}

interface ItemItem {
    index: number;
    text: string;
}
const dates: Date[] = [
    new Date('1842-06-17T20:33:51.281Z'),
    new Date('1298-02-24T04:18:39.736Z'),
    new Date('1867-01-15T01:11:06.510Z'),
    new Date('1356-04-30T15:58:47.279Z'),
    new Date('1995-10-22T09:42:01.931Z'),
    new Date('1715-11-28T11:45:55.840Z'),
    new Date('1951-07-01T16:19:40.038Z'),
    new Date('1739-05-06T19:08:02.895Z'),
    new Date('1352-07-15T06:12:18.460Z'),
    new Date('1972-12-14T22:31:14.108Z'),
    new Date('1948-03-25T08:17:36.128Z'),
    new Date('1324-09-06T18:20:11.751Z'),
    new Date('1677-11-11T14:44:17.733Z'),
    new Date('2025-03-20T10:27:44.930Z'),
    new Date('1901-06-27T03:28:48.927Z'),
    new Date('1820-11-30T02:40:34.876Z'),
    new Date('1308-08-01T08:59:58.197Z'),
    new Date('2021-09-01T14:03:27.619Z'),
    new Date('1216-12-26T23:50:50.648Z'),
    new Date('2000-02-28T00:11:12.952Z'),
    new Date('1518-10-19T15:31:37.880Z'),
    new Date('1876-08-06T11:14:57.260Z'),
    new Date('1543-05-14T12:37:19.084Z'),
    new Date('1765-02-09T22:09:36.051Z'),
    new Date('1804-04-16T14:52:25.183Z'),
    new Date('1399-07-04T05:24:43.998Z'),
    new Date('1633-01-22T04:34:13.734Z'),
    new Date('1284-10-03T17:18:11.998Z')
    // Add more dates here
];

const fillEmptyCenturies = (dateGroups: DateGroup[]) => {
    const filledGroups: DateGroup[] = [];
    let minCentury = Number.MAX_SAFE_INTEGER;
    let maxCentury = Number.MIN_SAFE_INTEGER;

    // Find the minimum and maximum centuries in the existing groups
    for (const group of dateGroups) {
        const century = parseInt(group.group, 10);
        minCentury = Math.min(minCentury, century);
        maxCentury = Math.max(maxCentury, century);
    }

    // Fill in missing centuries
    for (let century = minCentury; century <= maxCentury; century++) {
        const centuryGroup = `${century}th Century`;
        const existingGroup = dateGroups.find((group) => group.group === century.toString());
        const dates = existingGroup ? existingGroup.dates : [];
        const dateGroup: DateGroup = {
            group: century.toString(),
            dates,
            century: centuryGroup,
        };
        filledGroups.push(dateGroup);
    }

    return filledGroups;
};



export function aaa() {
    const groupedDates: DateGroup[] = [];

    // Find the minimum and maximum dates
    let minDate = dates[0];
    let maxDate = dates[0];

    for (let i = 1; i < dates.length; i++) {
        if (dates[i] < minDate) {
            minDate = dates[i];
        }
        if (dates[i] > maxDate) {
            maxDate = dates[i];
        }
    }

    const differenceInYears = maxDate.getFullYear() - minDate.getFullYear();

    // Group the dates
    const groups = groupBy(dates, (date) => {
        const century = Math.ceil(date.getFullYear() / 100);
        //   const newItem: ItemItem = {
        //     index: century,
        //     text: `${century}th Century`
        //   }
        return century;
    });

    // Create DateGroup objects and add them to groupedDates
    for (const group in groups) {
        const dateGroup: DateGroup = {
            group,
            dates: groups[group],
            century: `${group}th Century`,
        };

        groupedDates.push(dateGroup);
    }

    const filledGroupedDates = fillEmptyCenturies(groupedDates)

    console.log(groupedDates);

    console.log(groupedDates);
    return filledGroupedDates
}

export function bbbb() {

    const groupedDates: DateGroup[] = [];

    // Group by month
    const groupedByMonth = groupBy(dates, (date) => date.getMonth());
    groupedDates.push({ group: 'Month', dates: groupedByMonth['0'] || [] }); // January
    groupedDates.push({ group: 'Month', dates: groupedByMonth['1'] || [] }); // February
    // Add more months as needed

    // Group by year
    const groupedByYear = groupBy(dates, (date) => date.getFullYear());
    for (const year in groupedByYear) {
        groupedDates.push({ group: 'Year', dates: groupedByYear[year] });
    }

    // Group by decade
    const groupedByDecade = groupBy(dates, (date) => Math.floor(date.getFullYear() / 10) * 10);
    for (const decade in groupedByDecade) {
        groupedDates.push({ group: 'Decade', dates: groupedByDecade[decade] });
    }

    // Group by century
    const groupedByCentury = groupBy(dates, (date) => Math.floor(date.getFullYear() / 100) * 100);
    for (const century in groupedByCentury) {
        groupedDates.push({ group: 'Century', dates: groupedByCentury[century] });
    }

    console.log(groupedDates);

}


// export const groupedDates: DateGroup[] = [];

// // Find the minimum and maximum dates
// let minDate = dates[0];
// let maxDate = dates[0];

// for (let i = 1; i < dates.length; i++) {
//     if (dates[i] < minDate) {
//         minDate = dates[i];
//     }
//     if (dates[i] > maxDate) {
//         maxDate = dates[i];
//     }
// }

// const differenceInYears = maxDate.getFullYear() - minDate.getFullYear();

// if (differenceInYears >= 100) {
//     // Group by century
//     const groupedByCentury = groupBy(dates, (date) => Math.floor(date.getFullYear() / 100) * 100);
//     for (const century in groupedByCentury) {
//         groupedDates.push({ group: 'Century', dates: groupedByCentury[century] });
//     }
// } else if (differenceInYears >= 10) {
//     // Group by decade
//     const groupedByDecade = groupBy(dates, (date) => Math.floor(date.getFullYear() / 10) * 10);
//     for (const decade in groupedByDecade) {
//         groupedDates.push({ group: 'Decade', dates: groupedByDecade[decade] });
//     }
// } else if (differenceInYears >= 1) {
//     // Group by year
//     const groupedByYear = groupBy(dates, (date) => date.getFullYear());
//     for (const year in groupedByYear) {
//         groupedDates.push({ group: 'Year', dates: groupedByYear[year] });
//     }
// } else {
//     // Group by month
//     const groupedByMonth = groupBy(dates, (date) => date.getMonth());
//     for (const month in groupedByMonth) {
//         groupedDates.push({ group: 'Month', dates: groupedByMonth[month] });
//     }
// }

// console.log(groupedDates);