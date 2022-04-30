import React, { useState } from 'react';
import { isNonEmptyString } from 'douhub-helper-util';

const WRAPPER_STYLE = {
    position: 'absolute',
    maxWidth: 250,
    width: 'max-content',
    bottom: '100%',
    left: '50%',
    marginBottom: '10px',
    padding: '5px 8px',
    WebkitTransform: 'translateX(-50%)',
    msTransform: 'translateX(-50%)',
    OTransform: 'translateX(-50%)',
    transform: 'translateX(-50%)',
    borderRadius: 5
};

const TEXT_STYLE = {
    display: 'inline',
    padding: 2,
    float: 'left'
}

const ARROW_STYLE = {
    position: 'absolute',
    width: '0',
    height: '0',
    bottom: '-5px',
    left: '50%',
    marginLeft: '-5px',
    borderLeft: 'solid transparent 5px',
    borderRight: 'solid transparent 5px'
}

const Tooltip = (props: Record<string, any>) => {

    const { title } = props;
    const color = isNonEmptyString(props.color) ? props.color : '#333333';
    const textColor = isNonEmptyString(props.textColor) ? props.textColor : '#ffffff';

    const wrapperStyle:any = {
        ...WRAPPER_STYLE,
        background: color,
        ...(props.wrapperStyle ? props.wrapperStyle : {})
    };

    const textStyle:any = {
        ...TEXT_STYLE,
        background: color,
        color: textColor,
        ...(props.textStyle ? props.textStyle : {})
    }

    const arrowStyle:any = {
        ...ARROW_STYLE,
        borderTop: `solid ${color} 5px`,
    }

    const [show, setShow] = useState(false);
    return <div
        onMouseEnter={() => { setShow(true) }}
        onMouseLeave={() => { setShow(false) }}
        style={{
            position: 'relative',
            display: 'inline-block'
        }}>
        {props.children}
        {show && <div style={wrapperStyle}>
            <div style={textStyle}>{isNonEmptyString(title) ? title.trim() : ''}</div>
            <div style={arrowStyle} />
        </div>}
    </div>
}

export default Tooltip;