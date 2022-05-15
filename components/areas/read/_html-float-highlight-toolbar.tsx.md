import React from 'react';
import { SVG } from 'douhub-ui-web-basic';
import { BubbleMenu } from '@tiptap/react';
import { isFunction, map, isArray } from 'lodash';

const HtmlFieldFloatHighlightToolbar = (props: {
    editor: any,
    onClickCreateNote?: () => void,
    colors: string[]
}) => {

    const { editor } = props;
    const colors = isArray(props.colors) && props.colors.length > 0 ? props.colors : [
        '#ffedd5',
        '#dbeafe',
        '#dcfce7',
        '#f3e8ff'
    ]

    const onClickCreateNote = () => {
        if (isFunction(props.onClickCreateNote)) props.onClickCreateNote();
    }

    const onApplyColor = (color: string) => {

        if (editor.isActive('hightlight', { color })) {
            editor.chain().focus().unsetHighlight();
        }
        else {
            editor.chain().focus().toggleHighlight({ color }).run();
        }
    }

    return <BubbleMenu editor={editor} className="menu-wrapper" >
        {map(colors, (color) => {
            return <div className="menu" key={color}>
                <div
                    onClick={() => onApplyColor(color)}
                    style={{backgroundColor: color}}
                    className={`menu-color ${editor.isActive('hightlight', { color }) ? 'active' : ''}`} />
            </div>
        })}
        {isFunction(props.onClickCreateNote) && <div className="menu border border-0 border-l flex" style={{ marginLeft: 3, paddingLeft: 3 }}>
            <div onClick={onClickCreateNote} className="menu-color" style={{ width: 16, height: 16 }}>
                <SVG src="/icons/page.svg" style={{ width: 18 }} />
            </div>
        </div>}
    </BubbleMenu>
};

export default HtmlFieldFloatHighlightToolbar;