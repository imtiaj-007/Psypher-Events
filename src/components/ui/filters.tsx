/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormFieldConfig, TabsConfig } from "@/types/common";
import { debounce } from "lodash";
import { cn } from "@/lib/utils";


interface FiltersSectionProps<T> {
    filters: FormFieldConfig[];
    initialValues?: Partial<T>;
    onFilterChange: (filters: Partial<T>) => void;
    debounceTime?: number;
    tabOptions?: TabsConfig & {
        filterKey?: string;
    };
    className?: string;
}

export const FiltersSection = <T extends Record<string, any>>({
    filters,
    initialValues = {},
    onFilterChange,
    debounceTime = 300,
    tabOptions,
    className,
}: FiltersSectionProps<T>) => {
    const [localFilters, setLocalFilters] = useState<Partial<T>>(initialValues);

    const debouncedOnFilterChange = debounce(onFilterChange, debounceTime);

    useEffect(() => {
        debouncedOnFilterChange(localFilters);
        return () => debouncedOnFilterChange.cancel();
    }, [localFilters, debouncedOnFilterChange]);

    const handleFilterChange = (key: string, value: any) => {
        setLocalFilters(prev => ({
            ...prev,
            [key]: value ?? undefined
        }));
    };

    const handleTabChange = (value: string) => {
        if (tabOptions) {
            const filterKey = tabOptions.filterKey || tabOptions.defaultActiveKey || tabOptions.tabs[0].key;
            setLocalFilters(prev => ({
                ...prev,
                [filterKey]: value
            }));
            tabOptions.onChange?.(value);
        }
    };

    const resetFilters = () => {
        const resetValues = filters.reduce((acc, filter) => {
            acc[filter.key as keyof T] = (filter.defaultValue ?? '') as any;
            return acc;
        }, {} as Partial<T>);

        if (tabOptions) {
            const tabKey = tabOptions.filterKey || tabOptions.defaultActiveKey || tabOptions.tabs[0].key;
            resetValues[tabKey as keyof T] = localFilters[tabKey as keyof T];
        }

        setLocalFilters(resetValues);
    };

    const activeTabValue = tabOptions
        ? (localFilters[tabOptions.filterKey || tabOptions.defaultActiveKey || tabOptions.tabs[0].key] as string)
        : undefined;

    return (
        <div className={cn("space-y-4 bg-sidebar border-2 rounded-lg shadow p-4", className)}>
            {tabOptions && (
                <Tabs
                    value={activeTabValue || tabOptions.defaultActiveKey}
                    onValueChange={handleTabChange}
                    className={tabOptions.className || "mb-4"}
                >
                    <TabsList className={tabOptions.tabListClassName || "w-full max-w-80"}>
                        {tabOptions.tabs.map(tab => (
                            <TabsTrigger
                                key={tab.key}
                                value={tab.key}
                                disabled={tab.disabled}
                                className={tab.className}
                            >
                                {tab.icon && tab.icon}
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            )}

            <div className="space-y-4">
                {filters.map(filter => {
                    if (filter.hidden) return null;

                    const fieldValue = localFilters[filter.key as keyof T];

                    return (
                        <div key={filter.key} className={cn("space-y-2", filter.className)}>
                            {filter.type !== 'checkbox' && (
                                <Label className={cn(
                                    "text-sm font-medium",
                                    filter.disabled && "text-muted-foreground"
                                )}>
                                    {filter.label}
                                    {filter.required && <span className="text-destructive ml-1">*</span>}
                                </Label>
                            )}

                            {renderFilterField(filter, fieldValue, handleFilterChange)}
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-end pt-2">
                <Button variant="outline" onClick={resetFilters}>
                    Reset Filters
                </Button>
            </div>
        </div>
    );
};

function renderFilterField(
    filter: FormFieldConfig,
    value: any,
    onChange: (key: string, value: any) => void
) {
    switch (filter.type) {
        case 'text':
        case 'textarea':
            return (
                <Input
                    type={filter.type}
                    placeholder={filter.placeholder}
                    value={value || ''}
                    onChange={(e) => onChange(filter.key, e.target.value)}
                    disabled={filter.disabled}
                    className={filter.className}
                />
            );
        case 'select':
            return (
                <Select
                    value={value || ''}
                    onValueChange={(val) => onChange(filter.key, val)}
                    disabled={filter.disabled}
                >
                    <SelectTrigger>
                        <SelectValue placeholder={filter.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                        {filter.options?.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            );
        case 'date':
            return (
                <DatePicker
                    date={value ? new Date(value) : undefined}
                    onSelect={(date) => onChange(filter.key, date?.toISOString())}
                // disabled={filter.disabled}
                />
            );
        case 'checkbox':
            return (
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={!!value}
                        onChange={(e) => onChange(filter.key, e.target.checked)}
                        disabled={filter.disabled}
                        className={filter.className}
                    />
                    <Label className="text-sm font-medium">{filter.label}</Label>
                </div>
            );
        case 'radio':
            return (
                <div className="space-y-2">
                    {filter.options?.map(option => (
                        <div key={option.value} className="flex items-center gap-2">
                            <input
                                type="radio"
                                id={`${filter.key}-${option.value}`}
                                name={filter.key}
                                value={option.value}
                                checked={value === option.value}
                                onChange={() => onChange(filter.key, option.value)}
                                disabled={filter.disabled}
                                className={filter.className}
                            />
                            <Label htmlFor={`${filter.key}-${option.value}`} className="text-sm font-medium">
                                {option.label}
                            </Label>
                        </div>
                    ))}
                </div>
            );
        default:
            return null;
    }
}