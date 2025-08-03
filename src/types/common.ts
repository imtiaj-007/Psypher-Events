export interface FormFieldConfig {
    key: string;
    type: 'text' | 'select' | 'date' | 'checkbox' | 'radio' | 'textarea';
    label: string;
    placeholder?: string;
    defaultValue?: unknown;
    required?: boolean;
    options?: Array<{
        value: string;
        label: string;
    }>;
    validation?: {
        pattern?: RegExp;
        minLength?: number;
        maxLength?: number;
        custom?: (value: unknown) => string | undefined;
    };
    className?: string;
    disabled?: boolean;
    hidden?: boolean;
}

export interface FormConfig<T = unknown> {
    fields: FormFieldConfig[];
    initialValues?: Partial<T>;
    onSubmit: (values: T) => void | Promise<void>;
    submitText?: string;
    resetText?: string;
    className?: string;
}

export interface TabConfig {
    key: string;
    label: string;
    content: React.ReactNode;
    disabled?: boolean;
    icon?: React.ReactNode;
    className?: string;
}

export interface TabsConfig {
    tabs: TabConfig[];
    filterKey: string;
    defaultActiveKey?: string;
    onChange?: (activeKey: string) => void;
    className?: string;
    tabListClassName?: string;
    tabContentClassName?: string;
}
