import React, { useEffect, useRef } from 'react';
import { throttle, isFunction, isNumber } from 'lodash';
import { _window } from 'douhub-ui-web-basic';

const ListFormResizer = (props: Record<string, any>) => {

    const { className, style, id, defaultWidth } = props;
    const BORDER_SIZE = 5;

    useEffect(() => {
        if (isNumber(defaultWidth)) {
            const currentWrapper = _window.document.getElementById("list-resizer-wrapper");
            if (currentWrapper?.style) currentWrapper.style.width = defaultWidth + 'px';
        }
    }, [id]);

    const resize = throttle((e: any) => {
        const dx = _window.m_pos - e.x;
        _window.m_pos = e.x;
        const currentWrapper = _window.document.getElementById("list-resizer-wrapper");
        if (currentWrapper && currentWrapper.offsetWidth) {
            const newWidth = currentWrapper.offsetWidth + dx;
            currentWrapper.style.width = newWidth + "px";
            if (isFunction(props.onChangeSize)) props.onChangeSize(newWidth);
        }
    },50);

    const onMouseDown = (e: any) => {
        if (
            e.offsetX > 0 && e.offsetX < BORDER_SIZE && e.target.className && e.target.className.indexOf('list-form-body') < 0
        ) {
            _window.m_pos = e.x;
            if (_window.addEventListener) {
                _window.addEventListener("mousemove", resize);
            }
            else {
                _window.attachEvent("mousemove", resize);
            }
        }
    }

    const onMouseUp = () => {
        if (_window.removeEventListener) {
            _window.removeEventListener("mousemove", resize);
        }
        else {
            _window.detachEvent("mousemove", resize);
        }
    }

    useEffect(() => {

        const currentBody = _window.document.getElementById("list-resizer-body");
        const currentWrapper = _window.document.getElementById("list-resizer-wrapper");
      
        if (_window.addEventListener) {
            if (currentBody) currentBody.addEventListener("mousedown", onMouseUp);
            if (currentWrapper) currentWrapper.addEventListener("mousedown", onMouseDown);
            if (currentWrapper) currentWrapper.addEventListener("mouseup", onMouseUp);
            _window.addEventListener("mouseup", onMouseUp);
        }
        else {
            if (currentBody) currentBody.attachEvent("mousedown", onMouseUp);
            if (currentWrapper) currentWrapper.attachEvent("mousedown", onMouseDown);
            if (currentWrapper) currentWrapper.attachEvent("mouseup", onMouseUp);
            _window.attachEvent("mouseup", onMouseUp);
        }

        return () => {
            
            if (_window.removeEventListener) {
                if (currentBody) currentBody.removeEventListener("mousedown", onMouseUp);
                if (currentWrapper) currentWrapper.removeEventListener("mousedown", onMouseDown);
                if (currentWrapper) currentWrapper.removeEventListener("mouseup", onMouseUp);
                _window.removeEventListener("mousemove", resize);
                _window.removeEventListener("mouseup", onMouseUp);
            } else {
                if (currentBody) currentBody.detachEvent("mousedown", onMouseUp);
                if (currentWrapper) currentWrapper.detachEvent("mousedown", onMouseDown);
                if (currentWrapper) currentWrapper.detachEvent("mouseup", onMouseUp);
                _window.detachEvent("mousemove", resize);
                _window.detachEvent("mouseup", onMouseUp);
            }
        }
    }, [])


    return <div
        id="list-resizer-wrapper"
        className={`list-resizer-wrapper ${className}`}
        style={{ ...style, display: 'flex' }}
    >
        <div className="cursor-col-resize bg-white h-full" style={{ width: 5 }}></div>
        <div id="list-resizer-body" className="list-resizer-body" style={{ width: 'calc(100% - 4px)' }}>
            {props.children}
        </div>

    </div>
};

export default ListFormResizer;

