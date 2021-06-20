import React from 'react';
import { Form, Modal, Card } from 'antd';
import FormList from './autoRender';

const AddEditForm = (props: any) => {
    const {
        formType,
        show,
        onOk,
        onCancel,
        config,
        formData,
        isAllDisabled = false,
        targetBlank = true,
        appendComponent = null,
        appendComponentDiy = null,
        modalOptions = {}
    } = props;
    let title = '新建';
    // 过滤掉不显示的字段
    let configTemp = config.filter((o: any) => o.isAdd || o.isAdd === undefined);
    if (formType === 'edit') {
        title = '修改';
        // 过滤掉不显示的字段
        configTemp = config.filter((o: any) => o.isEdit || o.isEdit === undefined);
    }
    if (isAllDisabled) {
        title = '详情';
    }
    const FormListRender = (
        <FormList
            key="autoRender"
            form={props.form}
            formList={configTemp}
            initialValue={formData}
            // showSubmit={false} // 显示提交按钮
            // initialValue={{ name: 'xx' }} // 回填
            appendComponent={appendComponent}
            appendComponentDiy={appendComponentDiy}
            onFormSubmit={onOk}
            onFormCancel={onCancel}
            isAllDisabled={isAllDisabled}
            cancelBtn={targetBlank ? '返回列表' : '取消'}
        />
    );
    return (
        <>
            {!targetBlank ? (
                <Modal
                    destroyOnClose
                    title={title}
                    visible={show}
                    onCancel={onCancel}
                    width={600}
                    footer={null}
                    {...modalOptions}
                >
                    {FormListRender}
                </Modal>
            ) : (
                <Card>{FormListRender}</Card>
            )}
        </>
    );
};
export default Form.create<any>()(AddEditForm);
