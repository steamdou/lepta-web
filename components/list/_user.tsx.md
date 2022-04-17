import React, { useEffect, useState } from 'react';
import { DEFAULT_EDIT_COLUMN, DEFAULT_ACTION_COLUMN, SendInvitationModal, Tooltip } from 'douhub-ui-web';

import { Avatar, SVG, _window } from 'douhub-ui-web-basic';
import { shortenNumber, isObject, getRecordFullName, formatText, hasRole, isNonEmptyString } from 'douhub-helper-util';
import ListHeaderUser from './list-header-user';
import UserForm from '../form/user';
import ACTIVATE_WITHOUT_PASSWOR_EMAIL_TEMPLATE from '../../metadata/email-activate-without-password.json';
import { map, isArray, without } from 'lodash';
import { observer } from 'mobx-react-lite';
import { useContextStore } from 'douhub-ui-store';

// import ListBase from './list-base';
import { ListBase } from 'douhub-ui-web';

const UserList = observer((props: Record<string, any>) => {
    const { entity, height, search, webQuery } = props;
    const [toInviteUser, setToInviteUser] = useState<Record<string, any> | null>(null);

    const contextStore = useContextStore();
    const context = JSON.parse(contextStore.data);
    const solution = _window.solution;
    const allowCreate = hasRole(context, 'ORG-ADMIN') || hasRole(context, 'USER-MANAGER');
    const recordForMembership = context.recordByMembership;
    const deleteButtonLabel = isNonEmptyString(recordForMembership?.id) ? 'Remove' : 'Deactivate';
    const deleteConfirmationMessage = isNonEmptyString(recordForMembership?.id) ? 'Remove the user from this project?' : 'Deactivate the user?';


    const columns = (
        onClick: (record: Record<string, any>, action: string) => {},
        entity: Record<string, any>
    ) => {
        return [
            {
                title: 'Name',
                dataIndex: 'fullName',
                id: 'fullName',
                render: (v: string, user: Record<string, any>) => {
                    const fullName = getRecordFullName(user);
                    let roles: any = [];
                    const userRoles = isArray(user.roles) ? `,${user.roles.join(',')},` : '';
                    if (userRoles) {
                        roles = without(map(solution.roles, (r: any) => {
                            return userRoles.indexOf(`,${r.value},`) >= 0 ?
                                <Tooltip key={r.value} color="#999999" placement='top' title={r.title}>
                                    <span className="rounded-sm bg-gray-100 mr-1 px-1 text-2xs mt-1 leading-none" >{formatText(r.title, 'initials').replace(/[ ]/gi, '')}</span>
                                </Tooltip>
                                : null;
                        }), null)
                    }

                    return <div className="flex w-full overflow-hidden items-center">
                        <div className="flex-shrink-0 h-10 w-10 mr-4">
                            <Avatar data={user} />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-900 leading-none">{fullName}</div>
                            {(user.email || user.mobile) && <div className="text-xs text-gray-500">
                                {user.email}{user.mobile ? `,${user.mobile}` : ''}
                            </div>}
                            {roles.length > 0 && <div className="w-full flex">{roles}</div>}
                        </div>
                    </div>
                },
            },
            {
                title: 'Status',
                dataIndex: 'statusCode',
                id: 'statusCode',
                width: 100,
                render: (v: string, user: Record<string, any>) => {
                    let status = 'Created';
                    let state = user.statusCode < 0 ? 'off' : 'on';
                    switch (user.statusCode) {
                        case 0:
                            {
                                state = 'off';
                                status = 'Created';
                                break;
                            }
                        case 5:
                            {
                                state = 'off';
                                status = 'Invited';
                                break;
                            }
                        // case 10:
                        //     {
                        //         status= 'Invite Accepted';
                        //         break;
                        //     }
                        default: {
                            status = user.statusCode >= 0 ? 'Active' : 'Inactive';
                            break;
                        }
                    }

                    return <div className="flex items-center">
                        <SVG src={`/icons/user-active-${state}.svg`} color={state == 'on' ? 'green' : 'red'} style={{ width: 16, height: 16 }} />
                        <div className="text-xs text-gray-600 ml-2 whitespace-nowrap">{status}</div>
                    </div>
                },
            },
            {
                title: () => <div className="w-full flex flex-row justify-end">Rewards</div>,
                dataIndex: 'totalPoints',
                id: 'totalPoints',
                width: 100,
                render: (v: number) => {
                    return <div className="w-full flex flex-row justify-end items-center">
                        <span className="mx-1 text-orange-600">{shortenNumber(v)}</span> <SVG src="/icons/coins.svg" className="flex-shrink-0 ml-1.5 h-4 w-4" />
                    </div>
                }
            },
            DEFAULT_EDIT_COLUMN(onClick, entity),
            DEFAULT_ACTION_COLUMN(onClick, entity, [{ title: "Invite", action: "invite" }],
                { deleteButtonLabel, deleteConfirmationMessage })
        ]
    };

    const onClickRecord = (record: Record<string, any>, action: string) => {
        switch (action) {
            case 'invite':
                {
                    setToInviteUser({ ...record });
                }
        }
    }


    return (
        <>
            <ListBase
                allowUpload={isNonEmptyString(recordForMembership)}
                allowCreate={allowCreate}
                queryId={webQuery.query}
                statusId={webQuery.status}
                search={search}
                recordForMembership={recordForMembership}
                onClickRecord={onClickRecord}
                selectionType="checkbox"
                width={500}
                Header={ListHeaderUser}
                height={height}
                entity={entity}
                columns={columns}
                Form={UserForm}
                deleteButtonLabel={deleteButtonLabel}
                deleteConfirmationMessage={deleteConfirmationMessage}
            />
            <SendInvitationModal
                emailTemplate={ACTIVATE_WITHOUT_PASSWOR_EMAIL_TEMPLATE}
                onSubmitSucceed={() => { }}
                users={toInviteUser ? [toInviteUser] : []}
                show={isObject(toInviteUser) ? true : false}
                onClose={() => { setToInviteUser(null) }} />
        </>
    )
});


export default UserList;