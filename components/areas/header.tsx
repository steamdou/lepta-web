import { useState, Fragment, useEffect } from 'react';
import { isNonEmptyString, shortenNumber } from 'douhub-helper-util';
import { useRouter } from 'next/router';
import { Logo, PageHeaderMe, PageHeaderNotification, UserProfileMeModal, AppHeaderSearch, Tooltip } from 'douhub-ui-web';

import { _window, SVG } from 'douhub-ui-web-basic';
import { observer } from 'mobx-react-lite';
import { useEnvStore } from 'douhub-ui-store';

const AppHeader = observer((props: Record<string, any>) => {

    const { hideSearch, title, searchPlaceholder, solution } = props;
    const [showUserProfileModal, setShowUserProfileModal] = useState(false);
    const router = useRouter();
    const totalTokens = shortenNumber(1022020, 2);
    const site = solution?.site;
    const color = isNonEmptyString(props.color) ? props.color : 'red';
    // const messageStore = useMessageStore(props.messageStore);
    // const messageData = JSON.parse(messageStore.content);
    const envStore = useEnvStore();
    const envData = JSON.parse(envStore.data);
    const showLeftDrawer = envData.showLeftDrawer;

    // const contextStore = useContextStore();
    // const context = JSON.parse(contextStore.data);
    // const user = context.user;

    const onClickLogo = () => {
        router.push('/home');
    }

    const onClickToggleLeftArea = () => {
        envStore.setValue('showLeftDrawer', !showLeftDrawer);
    }

    const onClickUserProfile = () => {
        setShowUserProfileModal(true);
    }

    return <header className="flex-shrink-0 relative h-16 bg-white flex items-center">

        <div className="hidden bg-white min-w-0 w-56 border-0 border-r h-full flex-row md:flex px-6">
            <div className="flex items-center justify-center cursor-pointer" onClick={onClickLogo}>
                <Logo id="header-logo" iconSize={32} color={color} />
                <h2 className="flex my-0 text-xl font-bold text-red-500 mx-4">{site?.name}</h2>
            </div>
        </div>

        <div className="flex flex-col justify-center cursor-pointer w-16 min-w-0 border-0 h-full flex-row border-0 border-r md:hidden" onClick={onClickToggleLeftArea}>
            <div className="flex self-center">
                <SVG id="header-menu" style={{ width: 28 }} src={showLeftDrawer ? '/icons/x.svg' : '/icons/menu.svg'} />
            </div>
        </div>

        <div className="flex md:min-w-0 flex-1 md:items-center md:justify-between h-full">
            {isNonEmptyString(title) && <div className="flex overflow-hidden h-full items-center pr-4 pl-5 pr-5 border-r border-dashed"
                style={{ height: 66, maxHeight: 66, maxWidth: 300 }}>
                <h1 className="flex text-xl font-semibold items-center text-gray-700 m-0" style={{ lineHeight: 1.2 }}>{title}</h1>
            </div>}
            {!hideSearch && <AppHeaderSearch placeholder={searchPlaceholder} />}


            <div className="pl-0 pr-4 sm:pr-4 lg:pr-6 flex-shrink-0 flex items-center h-full" >
                <div className="w-full flex items-center space-x-6 lg:space-x-8">

                    <PageHeaderNotification count={20} wrapperClassName="ml-0" />
                    <PageHeaderMe onClickUserProfile={onClickUserProfile} />
                    <UserProfileMeModal
                        show={showUserProfileModal}
                        onClose={() => setShowUserProfileModal(false)} />
                </div>
            </div>
        </div>
    </header>
});

export default AppHeader;