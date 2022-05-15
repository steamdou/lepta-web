import React from 'react';
import { SVG } from 'douhub-ui-web-basic';
import { isNonEmptyString } from 'douhub-helper-util';
import {  BubbleMenu  } from '@tiptap/react';


const HtmlFieldFloatEditToolbar = (props: {
    editor: any,
    hideH1?: boolean,
    hideH2?: boolean,
    hideH3?: boolean,
    hideH4?: boolean,
    supportSourceCode?: boolean
}) => {

    const { editor, hideH1, hideH2, hideH3, hideH4, supportSourceCode } = props;

    const onChangeHeader = (level: number) => {
        editor.chain().focus().toggleHeading({ level }).run();
    }

    const onClickLink = () => {

        const hasLink: any = editor.isActive('link');
        if (hasLink) {
            editor.chain().focus().toggleLink().run();
        }
        else {
            const url = window.prompt('URL', editor.getAttributes('link').href);
            if (!isNonEmptyString(url)) return;

            editor
                .chain()
                .focus()
                .extendMarkRange('link')
                .setLink({ href: url })
                .run();
        }
    }


    return <BubbleMenu editor={editor} className="menu-wrapper">
        <div className="menu">
            {!hideH1 && <div
                onClick={() => onChangeHeader(1)}
                className={`menu-text ${editor.isActive('heading', { level: 1 }) ? 'active' : ''}`}>
                H1
            </div>}
            {!hideH2 && <div
                onClick={() => onChangeHeader(2)}
                className={`menu-text ${editor.isActive('heading', { level: 2 }) ? 'active' : ''}`}>
                H2
            </div>}
            {!hideH3 && <div
                onClick={() => onChangeHeader(3)}
                className={`menu-text ${editor.isActive('heading', { level: 3 }) ? 'active' : ''}`}>
                H3
            </div>}
            {!hideH4 && <div
                onClick={() => onChangeHeader(4)}
                className={`menu-text ${editor.isActive('heading', { level: 4 }) ? 'active' : ''}`}>
                H4
            </div>}
            <div className="menu-sp" />
            <div
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`menu-text menu-text-bold ${editor.isActive('bold') ? 'active' : ''}`} >
                B
            </div>
            <div
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`menu-text menu-text-italic ${editor.isActive('italic') ? 'active' : ''}`} >
                I
            </div>
            <div
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`menu-text menu-text-strikethrough ${editor.isActive('strike') ? 'active' : ''}`} >
                T
            </div>
            <div className="menu-sp" />
            <SVG src="/icons/material-bullet-list.svg"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`menu-icon ${editor.isActive('bulletList') ? 'active' : ''}`} />
            <SVG src="/icons/material-numbered-list.svg"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`menu-icon ${editor.isActive('orderedList') ? 'active' : ''}`} />
            <div className="menu-sp" />
            {supportSourceCode && <SVG src="/icons/source-code.svg"
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={`menu-icon ${editor.isActive('codeBlock') ? 'active' : ''}`} />}
            <SVG src="/icons/material-get-quote.svg"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`menu-icon ${editor.isActive('blockquote') ? 'active' : ''}`} />

            <SVG src="/icons/material-link.svg"
                onClick={onClickLink}
                className={`menu-icon ${editor.isActive('link') ? 'active' : ''}`} />
        </div>
    </BubbleMenu>
};

export default HtmlFieldFloatEditToolbar;