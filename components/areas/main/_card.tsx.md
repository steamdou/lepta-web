import React from 'react';
import { isNonEmptyString, isObject } from 'douhub-helper-util';
import { isFunction, isArray } from 'lodash';
import { Tags } from 'douhub-ui-web-basic';

export const CardLayoutImageLeft = (props: Record<string, any>) => {

    const { media, item, display, content, tags, tooltipColor, className, style, Tooltip, onClick, onLoadImageError, onLoadImageSuccess } = props;

    return <div
        style={isObject(style) ? style : {}}
        className={`flex flex-row rounded-lg border border-gray-100 shadow hover:shadow-lg ${isNonEmptyString(className) ? className : ''}`}>
        {isNonEmptyString(media) && <div className="flex flex-row cursor-pointer bg-gray-100 float-left p-3 rounded-tl-lg rounded-bl-lg overflow-hidden" style={{ maxWidth: 120 }} onClick={onClick} >
            <img className="w-full self-center" src={media} alt="" onLoad={onLoadImageSuccess} onError={onLoadImageError} />
        </div>}
        <div className="w-full flex flex-col p-4">
            <div className="w-full overflow-hidden text-base mb-2 font-semibold text-gray-900 leading-5 cursor-pointer" dangerouslySetInnerHTML={{ __html: display }} onClick={onClick} />
            {isArray(item.tags) && item.tags.length > 0 && <div className="w-full">
                <Tags tags={item.tags} wrapperClassName="mt-1" selectedTags={tags} tooltipColor={tooltipColor} Tooltip={Tooltip} />
            </div>}
            
            <div className="w-full overflow-hidden text-sm mt-2 text-gray-700 cursor-pointer" dangerouslySetInnerHTML={{ __html: content }} onClick={onClick} />
        </div>

    </div>
}

export const CardLayoutDefault = (props: Record<string, any>) => {

    const { media, item, display, content, tags, tooltipColor, className, style, Tooltip, onClick, onLoadImageError, onLoadImageSuccess } = props;

    return <div
        style={isObject(style) ? style : {}}
        className={`flex flex-col bg-white rounded-lg border border-gray-100 shadow hover:shadow-lg ${isNonEmptyString(className) ? className : ''}`}>
        {isNonEmptyString(media) && <div className="flex-shrink-0 cursor-pointer rounded-tl-lg rounded-tr-lg overflow-hidden" onClick={onClick}>
            <img className="w-full" src={media} alt="" onLoad={onLoadImageSuccess} onError={onLoadImageError} />
        </div>}
        <div className="flex-1 p-4 flex flex-col justify-between" >
            <div className="flex-1">
                <div className="w-full block mt-2 flex flex-col">
                    <div className="w-full overflow-hidden text-base mb-2 font-semibold text-gray-900 leading-5 cursor-pointer" dangerouslySetInnerHTML={{ __html: display }} onClick={onClick} />
                    {isArray(item.tags) && item.tags.length > 0 && <div className="w-full">
                        <Tags tags={item.tags} wrapperClassName="mt-1" selectedTags={tags} tooltipColor={tooltipColor} Tooltip={Tooltip} />
                    </div>}
                    <div className="w-full overflow-hidden mt-2 text-sm text-gray-700 cursor-pointer" dangerouslySetInnerHTML={{ __html: content }} onClick={onClick} />
                </div>
            </div>
        </div>
    </div>
}


const Card = (props: Record<string, any>) => {

    const { media, item, layout } = props;

    const onClick = () => {
        if (isFunction(props.onClick)) props.onClick(item);
    }

    const onLoadImageSuccess = () => {
        if (isFunction(props.onLoadImage)) props.onLoadImage(media, true);
        if (isFunction(props.onLoadImageSuccess)) props.onLoadImageSuccess(media);
    }

    const onLoadImageError = () => {
        if (isFunction(props.onLoadImage)) props.onLoadImage(media, false);
        if (isFunction(props.onLoadImageError)) props.onLoadImageError(media);
    }

    const renderLayout = () => {
        switch (layout) {
            case 'image-left':
                {
                    return <CardLayoutImageLeft {...props} onLoadImageSuccess={onLoadImageSuccess} onClick={onClick} onLoadImageError={onLoadImageError} />
                }
            default:
                {
                    return <CardLayoutDefault {...props} onLoadImageSuccess={onLoadImageSuccess} onClick={onClick} onLoadImageError={onLoadImageError} />
                }
        }
    }

    return renderLayout();
}

export default Card