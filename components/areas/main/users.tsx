import React from 'react';
import { UserList } from 'douhub-ui-web-premium';
import ACTIVATE_WITHOUT_PASSWOR_EMAIL_TEMPLATE from '../../../metadata/email-activate-without-password.json';

const ListMainArea = (props: Record<string, any>) => {

    return (
        <UserList
            {...props}
            emailTemplateForInvitation={ACTIVATE_WITHOUT_PASSWOR_EMAIL_TEMPLATE}
        />
    )
}


export default ListMainArea;