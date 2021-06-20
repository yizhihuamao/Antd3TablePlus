import React from 'react';
import { Form } from 'antd';
import FormList from './autoRender';

const SrhForm = (props: any) => {
    const {
        layout = 'inline',
        onOk = () => {},
        onCancel = () => {},
        config = {},
        formData = {},
        appendComponent = null,
        appendComponentDiy = null
    } = props;
    return (
        <FormList
            formType="srh"
            key="autoRender"
            layout={layout}
            form={props.form}
            formList={config}
            initialValue={formData}
            // showSubmit={false} // 显示提交按钮
            // initialValue={{ name: 'xx' }} // 回填
            appendComponent={appendComponent}
            appendComponentDiy={appendComponentDiy}
            onFormSubmit={onOk}
            onFormCancel={onCancel}
            submitBtn="搜索"
            cancelBtn="重置"
        />
    );
};
export default Form.create<any>()(SrhForm);
