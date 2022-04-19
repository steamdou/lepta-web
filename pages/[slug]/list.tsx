import React from 'react';
import { getServerSidePropsForPage, PageBase, PageLoader } from 'douhub-ui-web';
import { Nothing, useCurrentContext } from 'douhub-ui-web-basic';
import { DetaultLeftArea } from 'douhub-ui-web-platform';
import { PageBase as AppPageBase } from 'douhub-ui-web-platform';
import Header from '../../components/areas/header';
import { settings } from '../../settings';
import 'antd/dist/antd.css';
import solutionProfile from '../../metadata/solution.json';
import solutionUI from '../../metadata/ui.json';
import { getEntityBySlug, getRecordDisplay, isNonEmptyString } from 'douhub-helper-util';
import { isObject } from 'lodash';
import MainArea from '../../components/areas/main/list';
import { observer } from 'mobx-react-lite';
import { useEnvStore } from 'douhub-ui-store';
import RightArea from '../../components/areas/right/default';
import Chat from '../../components/areas/right/chat';

export const getServerSideProps = async (props: Record<string, any>): Promise<Record<string, any>> => {
    return await getServerSidePropsForPage({ settings, solution: { ...solutionProfile, ...solutionUI }, ...props });
}

const ListPage = observer((props: Record<string, any>) => {
    const { solution, slug } = props;
    const entity = getEntityBySlug(solution, slug);
    const context = useCurrentContext(solution, { signInUrl: '/auth/sign-in' });
    const envStore = useEnvStore();
    const envData = JSON.parse(envStore.data);
    const entityName = entity && entity.entityName;
    const rightAreaProps = {
        roomId: isNonEmptyString(envData?.currentRecord?.id)? `${entityName}-${envData?.currentRecord?.id}` :
        `${entityName}-${solution.id}`,
        subTitle: isNonEmptyString(envData?.currentRecord?.id) ? `Room / ${entity && entity.uiName}` : 'Room',
        title: isNonEmptyString(envData?.currentRecord?.id) ? getRecordDisplay(envData?.currentRecord) : entity && entity.uiCollectionName
    }

    console.log({entity})

    const sidePaneKey = entity && `sidePane-${entity.entityName}-${entity.entityType}`;
    return <PageBase solution={solution} >
        <div className="h-full flex flex-col">
            {context ? <>
                {isObject(entity) && <Header
                    {...props}
                    sidePaneKey={sidePaneKey}
                    searchPlaceholder={`Search ${entity?.uiCollectionName ? entity.uiCollectionName.toLowerCase() + ' ...' : '...'}`} />
                }
                {isObject(entity) ? <AppPageBase
                    {...props}
                    entity={entity}
                    sidePaneKey={sidePaneKey}
                    MainArea={MainArea}
                    LeftArea={DetaultLeftArea}
                    RightArea={isNonEmptyString(entityName)?Chat:Nothing}
                    rightAreaProps={rightAreaProps}
                /> :
                    <div className="p-8 text-red-700">There&apos;s no entity defined for the page.</div>
                }
            </> :
                <PageLoader  {...props} />
            }
        </div>
    </PageBase>
});

export default ListPage
