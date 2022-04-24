import { getRecordAbstract, isNonEmptyString, shortenString } from 'douhub-helper-util';
import { isArray } from 'lodash';
import { _window, Tags } from 'douhub-ui-web-basic';

const Highlights = (props: Record<string, any>) => {

  const data = isArray(props.data) ? props.data : [];
  const post = data.length > 0 ? data[0] : {};

  const themeColor = _window.solution?.theme?.color;
  const color = themeColor && isNonEmptyString(themeColor["500"]) ? themeColor["500"] : 'black';

  return !post ? <></> :
    <div key={post.title} className="w-full relative lg:max-w-lg bg-white p-8 lg:p-12 rounded-lg pl-0">
      <span
        className="absolute top-0 left-0 inline-flex items-center p-3 text-sm font-medium bg-orange-100"
      >
        Knowlede of the day
      </span>
      <div>
        <div className="inline-block"></div>
      </div>
      <div className="flex flex-col mt-4">
        <div className="text-xl font-semibold text-gray-900 mb-2">{post.title}</div>
        {isArray(post.tags) && post.tags.length > 0 && <div className="w-full">
                <Tags tags={post.tags} wrapperClassName="mt-1" tooltipColor={color}/>
            </div>}
        <div className="mt-3 text-base text-gray-500">{
          isNonEmptyString(post.description) ? shortenString(post.description, 128) : getRecordAbstract(post, 128, true)
        }</div>
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