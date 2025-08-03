import { FormFieldConfig, TabsConfig } from "@/types/common";

export const filterConfig: FormFieldConfig[] = [
    {
        key: 'search',
        type: 'text',
        label: 'Search',
        placeholder: 'Search events...',
        defaultValue: ''
    },
    {
        key: 'from',
        type: 'date',
        label: 'From Date',
        placeholder: 'Select start date'
    },
    {
        key: 'to',
        type: 'date',
        label: 'To Date',
        placeholder: 'Select end date'
    },
    {
        key: 'venue_id',
        type: 'select',
        label: 'Venue',
        placeholder: 'Select venue',
        options: [
            { value: 'venue1', label: 'Venue 1' },
            { value: 'venue2', label: 'Venue 2' },
            // Add more venues as needed
        ]
    }
];

export const tabConfig: TabsConfig = {
    tabs: [
        {
            key: 'upcoming',
            label: 'Upcoming',
            content: null
        },
        {
            key: 'past',
            label: 'Past',
            content: null
        }
    ],
    defaultActiveKey: 'upcoming',
    filterKey: 'tab'
};