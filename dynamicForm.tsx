import React, { useState } from 'react';
import { Form, Icon, Button } from 'antd';

/**
 * 动态表单容器组件
 */
const DynamicForm = ({ form, diyItem = {}, formItemLayoutWithOutLabel = {} }: any) => {
    const [keys, setKeys] = useState<any>([0]);
    const [id, setId] = useState<any>(1);
    // 删除
    const remove = (k: any) => {
        if (keys.length === 1) {
            return;
        }
        setKeys(keys.filter((key: any) => key !== k));
    };
    // 增加
    const add = () => {
        const nextKeys = keys.concat(id);
        setId(id + 1);
        setKeys(nextKeys);
    };

    /**
     * 生成动态表单元素
     * @param fromTemp form
     * @param index 实际key
     * @param k 索引
     * @param keys 当前动态表单keys, Array
     * @param remove 删除方法
     */
    const formItems = keys.map((k: any, index: any) => (
        <span key={k}>
            {typeof diyItem.cb === 'function' && diyItem.cb(form, index, k, keys, remove, diyItem.rest)}
        </span>
    ));
    return (
        <>
            {formItems}
            <Form.Item {...formItemLayoutWithOutLabel}>
                <Button type="dashed" onClick={add} style={{ width: '60%' }}>
                    <Icon type="plus" /> Add
                </Button>
            </Form.Item>
        </>
    );
};
export default DynamicForm;
