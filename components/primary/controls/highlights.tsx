import React from 'react';
import { getRecordAbstract, isNonEmptyString, shortenString } from 'douhub-helper-util';
import { isArray } from 'lodash';
import { _window, Tags } from 'douhub-ui-web-basic';

const Highlights = (props: Record<string, any>) => {

  const data = isArray(props.data) ? props.data : [];
  const post = data.length > 0 ? data[0] : {};

  const themeColor = _window.solution?.theme?.color;
  const color = themeColor && isNonEmptyString(themeColor["500"]) ? themeColor["500"] : 'black';

  return !post ? <></> :
    <div key={post.title} className="w-full relative hidden lg:max-w-lg bg-white sm:block sm:p-8 lg:p-12 rounded-lg">
      <img src={post.media} className="hidden blog w-full ml-8 mb-4 md:block float-right" style={{ maxWidth: "40%"}}/>
      <div className="w-full">
        <div className="inline-flex items-center px-3 py-2 text-xs mb-6 font-medium bg-orange-100">
          Knowlede of the day
        </div>
        <div className="flex flex-col">
          <div className="text-xl font-semibold text-gray-900 mb-2">{post.title}</div>
          {isArray(post.tags) && post.tags.length > 0 && <div className="w-full mb-2">
            <Tags tags={post.tags} wrapperClassName="mt-1" tooltipColor={color} />
          </div>}
        </div>
        <div className="mt-2">
          <p className="text-base text-gray-600">
            {
              isNonEmptyString(post.description) ? shortenString(post.description, 128) : getRecordAbstract(post, 128, true)
            }</p>
        </div>
      </div>
      {/* <div className="mt-6 flex items-center">
        <div className="flex-shrink-0">
          <a href={post.author.href}>
            <span className="sr-only">{post.author.name}</span>
            <img className="h-10 w-10 rounded-full" src={post.author.imageUrl} alt="" />
          </a>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900">
            <a href={post.author.href}>{post.author.name}</a>
          </p>
          <div className="flex space-x-1 text-sm text-gray-500">
            <time dateTime={post.datetime}>{post.date}</time>
            <span aria-hidden="true">&middot;</span>
            <span>{post.readingTime} read</span>
          </div>
        </div> 
      </div>*/}
    </div>
}

export default Highlights;