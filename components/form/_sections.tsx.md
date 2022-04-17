import React, { useEffect, useState } from 'react';
import { isFunction, isArray, cloneDeep, map, isNil } from 'lodash';
import { HtmlField } from 'douhub-ui-web';
import { _window } from 'douhub-ui-web-basic';

const DISPLAY_NAME = 'SectionsField';

const SectionsField = (props: Record<string, any>) => {

    const { name } = props;
    const [value, setValue] = useState<Record<string, any>>([]);

    useEffect(() => {
        let newValue = isArray(props.value) ? cloneDeep(props.value) : null;
        if (!isArray(newValue)) newValue = isArray(props.record[name]) ? cloneDeep(props.record[name]) : [];
        setValue(isNil(newValue) ? [] : newValue);
    }, [props.record]);


    const onChangeSection = (v: any, index: number) => {
        const newValue = cloneDeep(value);
        newValue[index].value = v;
        if (isFunction(props.onChange)) props.onChange(newValue, v);
    }

    const renderSections = () => {
        return map(value, (section: any, index: number) => {
            switch (section.type) {
                default: {
                    return <HtmlField
                        key={index}
                        record={value}
                        {...section}
                        onChange={(v: any) => onChangeSection(v, index)} />
                }
            }
        })
    }

    return <div className="flex flex-col w-full">
        {renderSections()}
    </div>
};

SectionsField.displayName = DISPLAY_NAME;
export default SectionsField;