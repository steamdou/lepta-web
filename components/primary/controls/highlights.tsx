import { map } from 'lodash';

const post = {
  title: 'Boost your conversion rate',
  href: '#',
  category: { name: 'Knowlede of the day', href: '#', color: 'bg-indigo-100 text-indigo-800' },
  description:
    'Nullam risus blandit ac aliquam justo ipsum. Quam mauris volutpat massa dictumst amet. Sapien tortor lacus arcu.',
  date: 'Mar 16, 2020',
  datetime: '2020-03-16',
  author: {
    name: 'Paul York',
    href: '#',
    imageUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  readingTime: '6 min',
}

const Highlights = () => {
  return (
    <div key={post.title} className="w-full lg:max-w-lg bg-white p-12 rounded-lg">
      <div>
        <a href={post.category.href} className="inline-block">
          <span
            className={post.category.color + 'inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium'}
          >
            {post.category.name}
          </span>
        </a>
      </div>
      <a href={post.href} className="block mt-4">
        <p className="text-xl font-semibold text-gray-900">{post.title}</p>
        <p className="mt-3 text-base text-gray-500">{post.description}</p>
      </a>
      <div className="mt-6 flex items-center">
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
      </div>
    </div>
  )
}

export default Highlights;