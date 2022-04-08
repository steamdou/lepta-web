import StackGrid from "react-stack-grid";
import { useEffect, useState } from "react";

/* This example requires Tailwind CSS v2.0+ */
const post = {
        title: 'Boost your conversion rate',
        href: '#',
        category: { name: 'Article', href: '#' },
        description:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto accusantium praesentium eius, ut atque fuga culpa, similique sequi cum eos quis dolorum.',
        date: 'Mar 16, 2020',
        datetime: '2020-03-16',
        imageUrl:
            'https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1679&q=80',
        readingTime: '6 min',
        author: {
            name: 'Roel Aufderehar',
            href: '#',
            imageUrl:
                'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        }
    }



export default function Rows() {

    const [width, setWidth] = useState(0);
    const [items, setItems] = useState<Record<string,any>[]>([]);

    useEffect(()=>{
        setItems(Array(30).fill(post));
        
    },[])

    console.log({items})

    const getGridColumnCount = () => {
        if (width < 500) return 1;
        if (width < 750) return 2;
        if (width < 1000) return 3;
        return 4;
    }

    const getGutterWidth = () => {
        if (width < 750) return 20;
        if (width < 1000) return 25;
        return 30;
    }

    const getGridColumnWidth = () => {
        const count = getGridColumnCount();
        return (width - getGutterWidth() * (count + 1)) / count;
    }

    const guterWidth = getGutterWidth();

    const colWidth = 300;// getGridColumnWidth();

    console.log({colWidth})

    return (
        <div className="w-full">
                   <StackGrid
                        gutterWidth={guterWidth}
                        gutterHeight={guterWidth}
                        columnWidth={colWidth}
                        style={{ marginTop: guterWidth, marginBottom: guterWidth, marginLeft: guterWidth / 2, marginRight: guterWidth / 2 }}
                        className="w-full">
                        {items.map((post, i: number) => (
                            <div key={i} className="flex flex-col rounded-lg shadow-lg overflow-hidden m-4">
                                <div className="flex-shrink-0">
                                    <img className="h-48 w-full object-cover" src={post.imageUrl} alt="" />
                                </div>
                                <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-indigo-600">
                                            <a href={post.category.href} className="hover:underline">
                                                {post.category.name}
                                            </a>
                                        </p>
                                        <a href={post.href} className="block mt-2">
                                            <p className="text-xl font-semibold text-gray-900">{post.title}</p>
                                            <p className="mt-3 text-base text-gray-500">{post.description}</p>
                                        </a>
                                    </div>
                                    <div className="mt-6 flex items-center">
                                        <div className="flex-shrink-0">
                                            <a href={post.author.href}>
                                                <span className="sr-only">{post.author.name}</span>
                                                <img className="h-10 w-10 rounded-full" src={post.author.imageUrl} alt="" />
                                            </a>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">
                                                <a href={post.author.href} className="hover:underline">
                                                    {post.author.name}
                                                </a>
                                            </p>
                                            <div className="flex space-x-1 text-sm text-gray-500">
                                                <time dateTime={post.datetime}>{post.date}</time>
                                                <span aria-hidden="true">&middot;</span>
                                                <span>{post.readingTime} read</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </StackGrid>
        </div>
    )
}
