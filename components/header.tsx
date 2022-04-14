import { Fragment, useState, useEffect } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { isObject, isNonEmptyString } from 'douhub-helper-util';
import Link from 'next/link';
import { SearchIcon } from '@heroicons/react/solid';
import { observer } from 'mobx-react-lite';
import { useEnvStore } from 'douhub-ui-store';
import { useRouter } from 'next/router';
import { getCurrentPoolUser, _window, SVG } from 'douhub-ui-web-basic';

import BasicModal from 'douhub-ui-web/build/cjs/controls/modals/basic';
import PageHeaderMenuItem from 'douhub-ui-web/build/cjs/controls/page/header/menu-item';
import PageHeaderMenuItems from 'douhub-ui-web/build/cjs/controls/page/header/menu-items';

import Logo from 'douhub-ui-web/build/cjs/controls/logo';
import { isEmpty, isNil, map } from 'lodash';

const SiteHeader = observer((props: Record<string, any>) => {

  const envStore = useEnvStore();
  const height = envStore.height;

  const [user, setUser] = useState<Record<string, any> | null>(null);

  const { solution } = props;
  const site = solution?.site;
  const header = site?.header;
  const navigation = header?.navigation;

  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);

  const themeColor = solution?.theme?.color;
  const color = themeColor && isNonEmptyString(themeColor["500"]) ? themeColor["500"] : 'black';

  // const [message, setMessage] = useState({});

  // useEffect(()=>{
  //   setMessage(message);
  // }, [messageData])

  useEffect(() => {
    getCurrentPoolUser(solution)
      .then((curUser: Record<string, any> | null) => {
        setUser(curUser ? curUser : {});
      });
  }, [])

  const onClickLogo = () => {
    router.push('/home');
  }

  const renderMenuDesktopView = () => {
    return map(navigation, (menu) => {
      return <PageHeaderMenuItem key={menu.title} {...menu} />
    });
  }

  const renderMenuMobileView = () => {
    return <div className="overflow-hidden overflow-y-auto" style={{ height: height - 95 }}>
      {map(navigation, (menu) => {
        return map(menu.sections && menu.sections.length > 0 ? menu.sections : [], (section) => {
          return <div className="pb-6 px-5 space-y-6">
            <div className="mt-6">
              <nav className="grid gap-y-8">
                <PageHeaderMenuItems mobileView={true} key={section.title ? section.title : menu.title}
                  href={section.href ? section.href : menu.href}
                  title={section.title ? section.title : menu.title}
                  {...section} />
              </nav>
            </div>
          </div>
        });
      })}
    </div>
  }

  const renderSignInUpButtons = () => {
    if (!isEmpty(user)) return null;
    return <div className="flex items-center justify-end flex-1 mr-3">
      <Link href="/auth/sign-in">
        <a className="cursor-pointer whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-gray-100 rounded-md shadow-sm text-xs font-medium bg-gray-50 hover:bg-gray-100">
          Contributor
        </a>
      </Link>
      {solution?.site?.supportSignUp != false && <Link href="/auth/sign-in">
        <a className="cursor-pointer ml-4 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-green-600 hover:bg-green-700">
          Sign up
        </a>
      </Link>}
    </div>
  }

  const renderDashboardButton = () => {
    if (isNil(user) || isEmpty(user)) return null;
    return <div className="flex items-center justify-end flex-1">
      <Link href="/dashboard">
        <a className="cursor-pointer ml-4 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-blue-600 hover:bg-blue-700">
          Dashboard
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
            <div className="hidden sm:block">{renderMenuDesktopView()}</div>
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
                    className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-gray-50 text-gray-300 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-white focus:ring-white focus:text-gray-900 sm:text-sm"
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
              {renderMenuMobileView()}
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>
      <BasicModal
        show={openDialog}
        onClose={() => { setOpenDialog(false) }}
        title="The site is coming soon"
        content="Now that the dust has settled from the frenzy of token investments, it’s time to evaluate what we learned. In the long term, we believe that token-funded startups will become more common and that traditional venture investors will have to be open to investing in tokens."
        buttons={
          [{
            text: "Great",
            type: "danger"
          },

          {
            text: "Cancel",
            type: "cancel"
          }
          ]}
      />
    </div>
  )
});

export default SiteHeader;