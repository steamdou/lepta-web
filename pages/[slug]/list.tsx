import React from 'react';
import { getServerSidePropsForPage, PageBase, PageLoader } from 'douhub-ui-web';
import { useCurrentContext } from 'douhub-ui-web-basic';
import { DetaultLeftArea, PageBase as AppPageBase } from 'douhub-ui-web-platform';
import Header from '../../components/areas/header';
import { settings } from '../../settings';
import 'antd/dist/antd.css';
import solutionProfile from '../../metadata/solution.json';
import solutionUI from '../../metadata/ui.json';
import { getEntityBySlug } from 'douhub-helper-util';
import { isObject } from 'lodash';
import MainArea from '../../components/areas/main/list';

export const getServerSideProps = async (props: Record<string, any>): Promise<Record<string, any>> => {
    return await getServerSidePropsForPage({ settings, solution: { ...solutionProfile, ...solutionUI }, ...props });
}

const ListPage = (props: Record<string, any>) => {
    const { solution, slug } = props;
    const entity = getEntityBySlug(solution, slug);
    const context = useCurrentContext(solution, { signInUrl: '/auth/sign-in' });

    return <PageBase solution={solution} >
        <div className="h-full flex flex-col">
            {context ? <>
                {isObject(entity) && <Header
                    {...props}
                    searchPlaceholder={`Search ${entity?.uiCollectionName ? entity.uiCollectionName.toLowerCase() + ' ...' : '...'}`} />
                }
                {isObject(entity) ? <AppPageBase
                    {...props}
                    MainArea={MainArea}
                    LeftArea={DetaultLeftArea}
                    RightArea={null}
                /> :
                    <div className="p-8 text-red-700">There&apos;s no entity defined for the page.</div>
                }
            </> :
                <PageLoader />
            }
        </div>
    </PageBase>
};

export default ListPage
