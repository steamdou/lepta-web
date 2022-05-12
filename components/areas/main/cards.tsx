import React, { useState } from 'react';
import { _window } from 'douhub-ui-web-basic';
import { CardList } from 'douhub-ui-web-premium';
import { Notification } from 'douhub-ui-web';
import ReadCardModal from '../../areas/read/card-modal';
import ListBase from './list-base';
import { useEnvStore, useContextStore } from 'douhub-ui-store';
import { newGuid } from 'douhub-helper-util';
const ListMainArea = (props: Record<string, any>) => {

    const [currentRecord, setCurrentRecord] = useState<Record<string, any> | null>(null);
    const [notification, setNotification] = useState<Record<string, any> | null>(null);
    const envStore = useEnvStore();
    const envData = JSON.parse(envStore.data);
    const currentEditRecord = envData.currentRecord;

    const onCloseModal = () => {
        setCurrentRecord(null);
    }

    const onClickRecord = (newCurrentCard: Record<string, any>) => {
        setCurrentRecord(newCurrentCard);
    }

    const onClickEditCard = () => {
        if (currentEditRecord) {
            if (currentRecord && currentEditRecord.id !== currentRecord.id) {
                setNotification({
                    id: newGuid(),
                    type: 'warning',
                    message: "Another card in the edit form",
                    description: "To avoid losing your changes, we do not allow open edit form when there is another record in the edit form.",
                    placement: 'top'
                });
            }
            else {
                setCurrentRecord(null);
            }
        }
        else {
            envStore.setValue('currentRecord', currentRecord);
            setCurrentRecord(null);
        }

    }

    return (
        <>
            <CardList {...props} onClickRecord={onClickRecord} ListBase={ListBase} />
            {notification && <Notification {...notification} />}
            {currentRecord && <ReadCardModal 
            
            record={currentRecord} 
            onClose={onCloseModal} 
            show={true} buttons={
                [
                    { text: "Edit Card", onClick: onClickEditCard },
                    { type: "cancel", text: "Close", onClick: () => { setCurrentRecord(null) } }
                ]
            } />}
        </>
    )
}


export default ListMainArea;