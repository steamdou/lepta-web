import React, { useEffect, useState } from 'react';
import { isFunction } from 'lodash';
import { _window, BasicModal} from 'douhub-ui-web-basic';
import { observer } from 'mobx-react-lite';
import { isNonEmptyString } from 'douhub-helper-util';
import ReadCard from './read-card';

const ReadCardModal = observer((props: Record<string, any>) => {

    const { record, buttons } = props;
    const [showModal, setShowModal] = useState('');

    useEffect(() => {
        if (isNonEmptyString(record?.id)) setShowModal(record?.id);
    }, [record])


    const onClose = () => {
        setShowModal('');
        if (isFunction(props.onClose)) props.onClose();
    }

    const renderContent = () => {
        return <div className={`read-card w-full flex flex-col md:flex-row text-left`}>
            <div className="flex-1 text-xl">
                <ReadCard data={record} wrapperStyle={{ padding: 0 }} />
            </div>
        </div>
    }

    return <>
        <BasicModal
            buttons={buttons}
            onClose={onClose}
            overlayClosable={true}
            show={isNonEmptyString(showModal)}
            showCloseIcon={true}
            contentStyle={{ margin: 0 }}
            maxWidth={600}
            content={renderContent()}
        />
    </>
})

export default ReadCardModal;