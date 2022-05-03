import React from 'react';
import { getRecordAbstract, isNonEmptyString, shortenString } from 'douhub-helper-util';
import { isArray, isFunction } from 'lodash';
import { _window, Tags } from 'douhub-ui-web-basic';

const Highlights = (props: Record<string, any>) => {

    const data = isArray(props.data) ? props.data : [];
    const post = data.length > 0 ? data[0] : {};

    const themeColor = _window.solution?.theme?.color;
    const color = themeColor && isNonEmptyString(themeColor["500"]) ? themeColor["500"] : 'black';

    const onClickCard = (clickedCard: any) => {
        if (isFunction(props.onClickCard)) props.onClickCard(clickedCard);
    }

    return !post ? <></> :
        <div key={post.title} className="w-full relative hidden lg:max-w-lg bg-white sm:block sm:p-8 lg:p-12 rounded-lg">
            <img src={post.media} className="hidden blog w-full ml-8 mb-4 md:block float-right cursor-pointer mt-6" style={{ maxWidth: "40%" }} onClick={() => onClickCard(post)} />
            <div className="w-full">
                <h2 className="absolute inline-flex items-center px-3 py-2 text-sm font-medium bg-orange-100" style={{ top: 0, left: 0 }}>
                    Knowledge card of the day
                </h2>
                <div className="flex flex-col mt-6">
                    <div className="text-2xl font-semibold text-gray-900 mb-2 cursor-pointer" onClick={() => onClickCard(post)}>{post.title}</div>
                    {isArray(post.tags) && post.tags.length > 0 && <div className="w-full mb-2">
                        <Tags tags={post.tags} wrapperClassName="mt-1" tooltipColor={color} />
                    </div>}
                </div>
                <div className="mt-2 cursor-pointer" onClick={() => onClickCard(post)}>
                    <p className="text-base text-gray-600">
                        {
                            isNonEmptyString(post.description) ? shortenString(post.description, 128) : getRecordAbstract(post, 128, true)
                        }</p>
                </div>
            </div>
        </div>
}

export default Highlights;