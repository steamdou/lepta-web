import { Fragment, useState, useEffect } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { isNonEmptyString } from 'douhub-helper-util';
import Link from 'next/link';
import { SearchIcon } from '@heroicons/react/solid';
import { observer } from 'mobx-react-lite';
import { useEnvStore } from 'douhub-ui-store';
import { useRouter } from 'next/router';
import { getCurrentPoolUser, _window, SVG } from 'douhub-ui-web-basic';

import Logo from 'douhub-ui-web/build/cjs/controls/logo';
import { isEmpty, isNil } from 'lodash';

const SiteHeader = observer((props: Record<string, any>) => {

    const [user, setUser] = useState<Record<string, any> | null>(null);

    const { solution } = props;
    const router = useRouter();

    const themeColor = solution?.theme?.color;
    const color = themeColor && isNonEmptyString(themeColor["500"]) ? themeColor["500"] : 'black';

    useEffect(() => {
        getCurrentPoolUser(solution)
            .then((curUser: Record<string, any> | null) => {
                setUser(curUser ? curUser : {});
            });
    }, [])

    const onClickLogo = () => {
        router.push('/home');
    }

    const renderSignInUpButtons = () => {
        if (!isEmpty(user)) return null;
        return <div className="flex items-center justify-end flex-1 mr-3">
            <Link href="/auth/sign-in">
                <a className="cursor-pointer whitespace-nowrap inline-flex items-center justify-center px-4 py-2 rounded-md shadow text-base font-medium text-white bg-sky-600 hover:bg-sky-500 hover:shadow-lg">
                    Sign In
        </a>
            </Link>
            {solution?.site?.supportSignUp != false && <Link href="/auth/sign-up">
                <a className="cursor-pointer ml-4 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 rounded-md shadow text-base font-medium text-white bg-green-600 hover:bg-green-500 hover:shadow-lg">
                    Sign up
        </a>
            </Link>}
        </div>
    }

    const renderDashboardButton = () => {
        if (isNil(user) || isEmpty(user)) return null;
        return <div className="flex items-center justify-end flex-1">
            <Link href="/card/list">
                <a className="cursor-pointer ml-4 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow text-base font-medium text-white bg-sky-600 hover:bg-sky-500 hover:shadow-lg hover:text-white">
                    Manage Cards
        </a>
            </Link>
        </div>
    }

    return (
        <div className="sticky top-0 z-50 bg-gray-100">
            <Popover className="relative bg-white border border-gray-200 border-t-0 border-r-0 border-l-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex justify-between items-center pb-4 pt-4 md:justify-start md:space-x-10 w-full">
                        <Logo id="header_logo" textClassName="hidden sm:block" iconSize={32} color={color} text={solution?.site?.name} onClick={onClickLogo} />
                        {/* <div className="hidden sm:block">{renderMenuDesktopView()}</div> */}
                        <div className="visible flex-1 flex px-5 px-3 lg:ml-6">
                            <div className="max-w-xl w-full">
                                <label htmlFor="search" className="sr-only">
                                    Search
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    </div>
                                    <input
                                        id="search"
                                        name="search"
                                        className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-gray-50 text-gray-300 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-white focus:ring-white focus:text-gray-900"
                                        placeholder="Search"
                                        type="search"
                                    />
                                </div>
                            </div>
                        </div>

                        {renderSignInUpButtons()}
                        {renderDashboardButton()}
                    </div>
                </div>

                <Transition
                    as={Fragment}
                    enter="duration-200 ease-out"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="duration-100 ease-in"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <Popover.Panel
                        focus
                        className="absolute top-0 inset-x-0 z-10 p-2 transition transform origin-top-right md:hidden"
                    >
                        <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
                            <div className="py-5 px-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Logo id="header_logo" iconSize={32} color={color} text={solution?.site?.name} onClick={onClickLogo} />
                                    </div>
                                    {renderSignInUpButtons()}
                                    {renderDashboardButton()}
                                    <div className="-mr-2">
                                        <Popover.Button className="bg-white rounded-md ml-2 p-2 inline-flex items-center justify-center text-gray-400 bg-gray-100 hover:bg-gray-100 focus:outline-none">
                                            <span className="sr-only">Close menu</span>
                                            <SVG style={{ width: 20 }} src="/icons/x.svg" />
                                        </Popover.Button>
                                    </div>
                                </div>
                            </div>
                            {/* {renderMenuMobileView()} */}
                        </div>
                    </Popover.Panel>
                </Transition>
            </Popover>
        </div>
    )
});

export default SiteHeader;