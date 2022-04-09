import React, { useEffect, useState } from 'react';
import { useContextStore } from 'douhub-ui-store';
import { isFunction,  map } from 'lodash';
import { hasRole,  isObject } from 'douhub-helper-util';
import {  FormBase, Uploader} from 'douhub-ui-web';
import {  _window } from 'douhub-ui-web-basic';

const DISPLAY_NAME = 'UserForm';
const UserForm = (props: Record<string, any>) => {

    const { doing } = props;
    const [data, setData] = useState<Record<string, any> | null>(isObject(props.data)?{ ...props.data }:null);

    const contextStore = useContextStore();
    const context = JSON.parse(contextStore.data);
    const solution = _window.solution;

    const hasPermissionToChangeRole = (
        hasRole(context, 'ORG-ADMIN') ||
        hasRole(context, 'ROLE-ADMIN')
    ) ? true : false;

    useEffect(() => {
        setData(isObject(props.data)?{ ...props.data }:null);
    }, [props.data]);

    const onChange = (newData: Record<string, any>) => {
        setData({ ...newData });
        if (isFunction(props.onChange)) props.onChange({ ...newData });
    }

    const onSuccessUploadAvatar = (uploadResult: Record<string, any>) => {
        onChange({ ...data, avatar: uploadResult.cfSignedResult.signedUrl });
    }

    const formFirstNameLastName = {
        rows: [
            {
                fields: [
                    {
                        name: 'firstName',
                        type: 'text',
                        placeholder: "Type first name here",
                        label: "First Name",
                        alwaysShowLabel: true,
                        value: data?.firstName
                    }
                ]
            },
            {
                fields: [
                    {
                        name: 'lastName',
                        type: 'text',
                        placeholder: "Type last name here",
                        label: "Last Name",
                        alwaysShowLabel: true,
                        value: data?.lastName
                    }
                ]
            }
        ]
    }

    const formInfo = {
        rows: [
            {
                fields: [
                    {
                        name: 'email',
                        type: 'email',
                        label: "Email",
                        placeholder: "Type email here",
                        alwaysShowLabel: true,
                        value: data?.email,
                        disabled: data?.emailVerifiedOn || data?._rid?true:false
                    }
                ]
            },
            {
                fields: [
                    {
                        name: 'mobile',
                        type: 'phone-number',
                        label: "Mobile",
                        placeholder: "Type mobile number here",
                        note: "Format +0(000)0000000",
                        alwaysShowLabel: true,
                        value: data?.mobile,
                        disabled: data?.mobileVerifiedOn?true:false
                    }
                ]
            },
            {
                fields: [
                    {
                        name: 'introduction',
                        type: 'text',
                        label: "Introduction",
                        alwaysShowLabel: true,
                        value: data?.introduction
                    }
                ]
            },
            {
                fields: [
                    {
                        name: 'rolesSection',
                        type: 'section',
                        title: "Roles"
                    }
                ]
            },
            ...map(solution.roles, (r: Record<string, any>) => {
                return {
                    fields: [
                        {
                            name: 'roles',
                            label: r.title,
                            groupValue: r.value,
                            disabled: !hasPermissionToChangeRole,
                            type: 'checkbox',
                            value: data?.roles,
                        }
                    ]
                }
            })
        ]
    }

    return <div className="flex flex-col w-full">
        <div className="flex mb-6">
            <Uploader
                uiFormat='photo'
                value={data?.avatar}
                fileType="Photo"
                entityName="User"
                attributeName="avatar"
                recordId={data?.id}
                label="Avatar"
                signedUrlSize={480}
                signedUrlFormat="webp"
                onSuccess={onSuccessUploadAvatar}
                wrapperStyle={{ height: 120, marginRight: 20, width: 120, minWidth: 120 }} />
                <FormBase data={data} form={formFirstNameLastName} onChange={onChange}
            />
        </div>
        <FormBase data={data} form={formInfo} onChange={onChange} />
    </div>
};

UserForm.displayName = DISPLAY_NAME;
export default UserForm;
