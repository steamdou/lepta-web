import React, { useEffect, useState } from 'react';
import { isFunction, isArray, map, each, without, isNil } from 'lodash';
import { Tags, _window } from 'douhub-ui-web-basic';
 import { BasicModal } from 'douhub-ui-web';
// import BasicModal from './basic';
import { observer } from 'mobx-react-lite';
import { useEnvStore } from 'douhub-ui-store';
import { isNonEmptyString } from 'douhub-helper-util';
import { FullCard } from './card';

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
        return <div className={`w-full flex flex-row text-left p-2`}>
            <FullCard record={record} wrapperStyle={{ padding: 0 }} />
        </div>
    }

    return <>
        <BasicModal
            titleClassName={"hidden"}
            onClose={onClose}
            overlayClosable={true}
            title="Card"
            show={isNonEmptyString(showModal)}
            showCloseIcon={true}
            contentHeightAdjust={-140}
            contentStyle={{ margin: 0 }}
            content={renderContent()}
            style={{ width: width * 0.8, height: height * 0.9, maxWidth: 900 }}
        />
    </>
})

export default ReadCardModal;