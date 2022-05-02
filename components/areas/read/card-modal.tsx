import React, { useEffect, useState } from 'react';
import { isFunction, isArray, map, each, without, isNil } from 'lodash';
import { Tags, _window, } from 'douhub-ui-web-basic';
import { observer } from 'mobx-react-lite';
import { useEnvStore } from 'douhub-ui-store';
import { isNonEmptyString } from 'douhub-helper-util';
import { FullCard } from './card';
//import BasicModal from './modal';
import {BasicModal} from 'douhub-ui-web-basic';

const ReadCardModal = observer((props: Record<string, any>) => {

    const { record } = props;
    const [showModal, setShowModal] = useState('');
    const envStore = useEnvStore();
    const { height, width } = envStore;

    useEffect(() => {
        if (isNonEmptyString(record?.id)) setShowModal(record?.id);
    }, [record])



    const onClose = () => {
        setShowModal('');
        if (isFunction(props.onClose)) props.onClose();
    }

    const renderContent = () => {
        return <div className={`w-full flex flex-row text-left`}>
            <FullCard record={record} wrapperStyle={{ padding: 0 }} />
        </div>
    }

    return <>
        <BasicModal
            onClose={onClose}
            overlayClosable={true}
            show={isNonEmptyString(showModal)}
            showCloseIcon={true}
            contentStyle={{ margin: 0 }}
            maxWidth={900}
            content={renderContent()}
        />
    </>
})

export default ReadCardModal;