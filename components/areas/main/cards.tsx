import React, { useState } from 'react';
import { _window } from 'douhub-ui-web-basic';
import { CardList, ReadCardModal, ReadCard } from 'douhub-ui-web-premium';
import { Notification } from 'douhub-ui-web';

// import ReadCardModal from '../../areas/read/card-modal';
// import ReadCard from '../read/read-card';



import { ListBase } from 'douhub-ui-web';
//import ListBase from './list-base';
import { useEnvStore } from 'douhub-ui-store';
import { newGuid } from 'douhub-helper-util';

const Read = (props: { data: Record<string, any> }) => {
    return <div className={`w-full flex flex-row text-left text-lg`}>
        <ReadCard data={props.data} wrapperStyle={{ padding: 0 }}/>
    </div>
}

const ListMainArea = (props: Record<string, any>) => {

    const [currentReadRecord, setCurrentReadRecord] = useState<Record<string, any> | null>(null);
    const [notification, setNotification] = useState<Record<string, any> | null>(null);
    const envStore = useEnvStore();
    const envData = JSON.parse(envStore.data);
    const currentEditRecord = envData.currentEditRecord;

    const onCloseModal = () => {
        setCurrentReadRecord(null);
    }

    // const onClickRecord = (newCurrentCard: Record<string, any>, action: string) => {
    //     switch (action) {
    //         case 'read':
    //             {
    //                 setCurrentReadRecord(newCurrentCard);
    //                 break;
    //             }
    //     }

    // }

    const onClickEditCard = () => {
        if (currentEditRecord && currentReadRecord && (currentEditRecord.id !== currentReadRecord.id)) {
            setNotification({
                id: newGuid(),
                type: 'warning',
                message: "Another card in the edit form",
                description: "To avoid losing your changes, we do not allow open edit form when there is another record in the edit form.",
                placement: 'top'
            });
        }
        else {
            envStore.setValue('currentEditRecord', currentReadRecord);
            setCurrentReadRecord(null);
        }

    }

    return (
        <>
            <CardList {...props} ListBase={ListBase} Read={Read} />
            {notification && <Notification id={notification.id} {...notification} />}
            {currentReadRecord && <ReadCardModal
                record={currentReadRecord}
                onClose={onCloseModal}
                show={true} buttons={
                    [
                        { text: "Edit Card", onClick: onClickEditCard },
                        { type: "cancel", text: "Close", onClick: () => { setCurrentReadRecord(null) } }
                    ]
                } />}
        </>
    )
}


export default ListMainArea;