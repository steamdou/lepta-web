import { ListHeader, Tooltip, SendInvitationModal } from 'douhub-ui-web';
import {  SVG, _window, Div } from 'douhub-ui-web-basic';
import React, {  useState } from 'react';
import { isArray } from 'lodash';
import emailTemplate from '../../metadata/email-activate-with-password.json';

const ListHeaderUser = (props: Record<string, any>) => {

    const { selectedRecords, entity } = props;

    const [showUserInvite, setShowUserInvite] = useState(false);

    const onClickSendInvitationButton = () => {
        setShowUserInvite(true);
    }

    const hasRecordSelected = isArray(selectedRecords) && selectedRecords.length > 0;
    const TooltipForNoRecordSelected = hasRecordSelected ? Div : Tooltip;

    return <ListHeader {...props}>
        <TooltipForNoRecordSelected placement='bottom' title={`Please select at least one ${entity.uiName}`}>
            <div
                onClick={onClickSendInvitationButton}
                className={`flex cursor-pointer whitespace-nowrap ml-2 inline-flex items-center justify-center p-2 border border-transparent rounded-md text-xs font-medium bg-sky-100 shadow hover:shadow-lg`}>
                <SVG id="invite-user-icon" src="/icons/send-email.svg" style={{ width: 18, height: 18 }} color="#333333" />
                <span className="hidden sm:block ml-2">Invite</span>
            </div>
        </TooltipForNoRecordSelected>
        <SendInvitationModal
            emailTemplate={emailTemplate}
            onSubmitSucceed={()=>{}}
            users={selectedRecords}
            show={showUserInvite}
            onClose={() => { setShowUserInvite(false) }} />
    </ListHeader>
};

export default ListHeaderUser;

