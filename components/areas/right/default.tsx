import React, { useEffect, useState } from "react";

const DetaultRightArea = (props: Record<string, any>) => {

    const [name, setName] = useState('Aimee Douglas');

    return (
        <div className="px-10 py-8">
            <h3 className="font-medium text-gray-900 border-b border-gray-200 pb-2">Assistant</h3>
            <ul role="list" className="mt-2 border-gray-200 mb-6" onClick={()=>{setName(`${new Date()}`)}}>
                <li className="py-3 flex justify-between items-center">
                    <div className="flex items-center">
                        <img src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=1024&amp;h=1024&amp;q=80" alt="" className="w-8 h-8 rounded-full" />
                        <p className="ml-4 text-sm font-medium text-gray-900">{name}</p>
                    </div>
                </li>
            </ul>
            <h3 className="font-medium text-gray-900 border-b border-gray-200 pb-2">Moderators</h3>
            <ul role="list" className="mt-2 mb-6">
                <li className="py-3 flex justify-between items-center">
                    <div className="flex items-center">
                        <img src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=1024&amp;h=1024&amp;q=80" alt="" className="w-8 h-8 rounded-full" />
                        <p className="ml-4 text-sm font-medium text-gray-900">Aimee Douglas</p>
                    </div>
                </li>
                <li className="py-3 flex justify-between items-center">
                    <div className="flex items-center">
                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&amp;ixqx=oilqXxSqey&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80" alt="" className="w-8 h-8 rounded-full" />
                        <p className="ml-4 text-sm font-medium text-gray-900">Andrea McMillan</p>
                    </div>
                </li>
                <li className="py-2 flex justify-between items-center">
                    <button type="button" className="group -ml-1 bg-white p-1 rounded-md flex items-center focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <span className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                            <svg className="h-5 w-5" x-description="Heroicon name: solid/plus-sm" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path>
                            </svg>
                        </span>
                        <span className="ml-4 text-sm font-medium text-indigo-600 group-hover:text-indigo-500">Share</span>
                    </button>
                </li>
            </ul>
            <ul role="list" className="-mb-8">

                <li>
                    <div className="relative pb-8">

                        <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                        <div className="relative flex items-start space-x-3">

                            <div className="relative">
                                <img className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white" src="https://images.unsplash.com/photo-1520785643438-5bf77931f493?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=8&amp;w=256&amp;h=256&amp;q=80" alt="" />

                                <span className="absolute -bottom-0.5 -right-1 bg-white rounded-tl px-0.5 py-px">
                                    <svg className="h-5 w-5 text-gray-400" x-description="Heroicon name: solid/chat-alt" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd"></path>
                                    </svg>
                                </span>
                            </div>
                            <div className="min-w-0 flex-1">
                                <div>
                                    <div className="text-sm">
                                        <a href="#" className="font-medium text-gray-900">Eduardo Benz</a>
                                    </div>
                                    <p className="mt-0.5 text-sm text-gray-500">
                                        Commented 6d ago
                                    </p>
                                </div>
                                <div className="mt-2 text-sm text-gray-700">
                                    <p>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt nunc ipsum tempor purus vitae id. Morbi in vestibulum nec varius. Et diam cursus quis sed purus nam.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>

                <li>
                    <div className="relative pb-8">

                        <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                        <div className="relative flex items-start space-x-3">

                            <div>
                                <div className="relative px-1">
                                    <div className="h-8 w-8 bg-gray-100 rounded-full ring-8 ring-white flex items-center justify-center">
                                        <svg className="h-5 w-5 text-gray-500" x-description="Heroicon name: solid/user-circle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="min-w-0 flex-1 py-1.5">
                                <div className="text-sm text-gray-500">
                                    <a href="#" className="font-medium text-gray-900">Hilary Mahy</a>
                                    assigned
                                    <a href="#" className="font-medium text-gray-900">Kristin Watson</a>
                                    <span className="whitespace-nowrap">2d ago</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>

                <li>
                    <div className="relative pb-8">

                        <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                        <div className="relative flex items-start space-x-3">

                            <div>
                                <div className="relative px-1">
                                    <div className="h-8 w-8 bg-gray-100 rounded-full ring-8 ring-white flex items-center justify-center">
                                        <svg className="h-5 w-5 text-gray-500" x-description="Heroicon name: solid/tag" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="min-w-0 flex-1 py-0">
                                <div className="text-sm leading-8 text-gray-500">
                                    <span className="mr-0.5">
                                        <a href="#" className="font-medium text-gray-900">Hilary Mahy</a>

                                        added tags
                                    </span>

                                    <span className="mr-0.5">

                                        <a href="#" className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5 text-sm">
                                            <span className="absolute flex-shrink-0 flex items-center justify-center">
                                                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" aria-hidden="true"></span>
                                            </span>
                                            <span className="ml-3.5 font-medium text-gray-900">Bug</span>
                                        </a>

                                        <a href="#" className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5 text-sm">
                                            <span className="absolute flex-shrink-0 flex items-center justify-center">
                                                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" aria-hidden="true"></span>
                                            </span>
                                            <span className="ml-3.5 font-medium text-gray-900">Accessibility</span>
                                        </a>

                                    </span>
                                    <span className="whitespace-nowrap">6h ago</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>

                <li>
                    <div className="relative pb-8">
                        <div className="relative flex items-start space-x-3">

                            <div className="relative">
                                <img className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white" src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=8&amp;w=256&amp;h=256&amp;q=80" alt="" />

                                <span className="absolute -bottom-0.5 -right-1 bg-white rounded-tl px-0.5 py-px">
                                    <svg className="h-5 w-5 text-gray-400" x-description="Heroicon name: solid/chat-alt" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd"></path>
                                    </svg>
                                </span>
                            </div>
                            <div className="min-w-0 flex-1">
                                <div>
                                    <div className="text-sm">
                                        <a href="#" className="font-medium text-gray-900">Jason Meyers</a>
                                    </div>
                                    <p className="mt-0.5 text-sm text-gray-500">
                                        Commented 2h ago
                                    </p>
                                </div>
                                <div className="mt-2 text-sm text-gray-700">
                                    <p>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt nunc ipsum tempor purus vitae id. Morbi in vestibulum nec varius. Et diam cursus quis sed purus nam. Scelerisque amet elit non sit ut tincidunt condimentum. Nisl ultrices eu venenatis diam.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>

            </ul>
        </div>
   )

}

export default DetaultRightArea;