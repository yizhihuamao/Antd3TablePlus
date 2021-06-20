import React, { useState } from 'react';
import { Form, Select, Input, Radio, InputNumber, Checkbox, Button, DatePicker, Row, Col } from 'antd';

// 不能写function，会报错：Warning: Function components cannot be given refs.
// https://github.com/reactjs/reactjs.org/issues/2120
class FormCheckbox extends React.PureComponent<any> {
    render() {
        const { onChange, value, options = {}, disabled, otherOptions = {} } = this.props;
        const handleChange = () => {
            onChange(!value);
        };
        return (
            <Checkbox checked={value} onChange={handleChange} disabled={disabled} {...otherOptions}>
                {options && options.label}
            </Checkbox>
        );
    }
}
class FormDate extends React.PureComponent<any> {
    render() {
        const { onChange, dateType, disabled = false, otherOptions = {} } = this.props;
        const handleChange = (date: any) => {
            onChange(date);
        };
        const common: any = {
            disabled,
            allowClear: true,
            style: { width: '100%' },
            ...otherOptions
        };
        if (dateType === 'RangePicker') {
            return <DatePicker.RangePicker onChange={handleChange} {...common} />;
        }
        if (dateType === 'MonthPicker') {
            return <DatePicker.MonthPicker onChange={handleChange} {...common} />;
        }
        if (dateType === 'WeekPicker') {
            return <DatePicker.WeekPicker onChange={handleChange} {...common} />;
        }
        return <DatePicker onChange={handleChange} {...common} />;
    }
}

const { Option } = Select;

const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 15 }
};
const AutoRenderForm = ({
    form = {},
    initialValue = {},
    formList = [],
    submitBtn = '提交',
    cancelBtn = '取消',
    onFormSubmit = () => {},
    onFormCancel = () => {},
    layout = 'horizontal', // ["horizontal", "inline", "vertical"]
    appendComponent = () => {},
    appendComponentDiy = () => {},
    showSubmit = true,
    formType = 'form', // ["form", "srh"]
    isAllDisabled = false,
    formOptions = {}
}: any) => {
    const [loading, setLoading] = useState<any>(false); // 列表loading

    const { getFieldDecorator, validateFieldsAndScroll } = form;
    const handleOk = (e: any) => {
        e.preventDefault();
        validateFieldsAndScroll((err: any, values: any) => {
            const valuesTemp = { ...values };
            if (!err) {
                // 去掉所有字符串的左右空格
                Object.keys(valuesTemp).forEach(o => {
                    valuesTemp[o] = typeof valuesTemp[o] === 'string' ? valuesTemp[o].trim() : valuesTemp[o];
                });
                onFormSubmit(valuesTemp, setLoading);
            }
        });
    };
    const renderFormItem = (item: any) => {
        const type = formType === 'srh' && item.srhType ? item.srhType : item.type;
        const options = formType === 'srh' && item.srhOptions ? item.srhOptions : item.options;
        switch (type) {
            case 'input':
            case undefined:
                return <Input allowClear placeholder="请输入" disabled={isAllDisabled} {...options} />;
            case 'password':
            case 'pwd':
                return <Input.Password allowClear placeholder="请输入" disabled={isAllDisabled} {...options} />;
            case 'text':
            case 'textarea':
                return <Input.TextArea allowClear rows={4} disabled={isAllDisabled} {...options} />;
            case 'number':
            case 'inputNumber':
                return (
                    <InputNumber placeholder="请输入" style={{ width: '100%' }} disabled={isAllDisabled} {...options} />
                );
            case 'select':
                return (
                    <Select placeholder="请选择" allowClear disabled={isAllDisabled} {...options}>
                        {(item.data || item.filters || []).map((o: any) => (
                            <Option key={o.value} value={o.value}>
                                {o.text}
                            </Option>
                        ))}
                    </Select>
                );
            case 'radio':
                return (
                    <Radio.Group disabled={isAllDisabled}>
                        {(item.data || item.filters || []).map((o: any) => (
                            <Radio value={o.value} key={o.value}>
                                {o.text}
                            </Radio>
                        ))}
                    </Radio.Group>
                );
            case 'date':
            case 'DatePicker':
            case 'RangePicker':
            case 'MonthPicker':
            case 'WeekPicker':
                return <FormDate disabled={isAllDisabled} dateType={type} otherOptions={item.options} />;
            case 'checkboxGroup':
                return (
                    <Checkbox.Group disabled={isAllDisabled} style={{ width: '100%' }} {...options}>
                        {(item.data || item.filters || []).map((o: any) => (
                            <Checkbox value={o.value} key={o.value}>
                                {o.text}
                            </Checkbox>
                        ))}
                    </Checkbox.Group>
                );
            case 'checkbox':
                return (
                    <FormCheckbox disabled={isAllDisabled} options={item.checkboxOptions} otherOptions={item.options} />
                );
            default:
                return null;
        }
    };
    const getColSetting = () => {
        if (formType === 'srh') {
            return {
                span: 6
            };
        }
        return {};
    };
    // 判断用哪个表单选项
    const getFormOptions = (item: any) => {
        // srh 优先选择对应规则，找不到则用表单的
        if (formType === 'srh') {
            return (item.srhFormOptions && { ...item.srhFormOptions }) || (item.formOptions && { ...item.formOptions });
        }
        return item.formOptions && { ...item.formOptions };
    };
    // 判断用哪个表单formItem选项
    const getFormItemOptions = (item: any) => {
        // srh 优先选择对应规则，找不到则用表单的
        if (formType === 'srh') {
            return (
                (item.formItemSrhOptions && { ...item.formItemSrhOptions }) ||
                (item.formItemOptions && { ...item.formItemOptions })
            );
        }
        return item.formItemOptions && { ...item.formItemOptions };
    };

    return (
        <Form onSubmit={handleOk} {...formItemLayout} layout={layout} {...formOptions}>
            <Row>
                {formList.map((item: any) => {
                    const temp = renderFormItem(item);
                    let appendComponentDiyArr = [];
                    if (appendComponentDiy) appendComponentDiyArr = appendComponentDiy(form);
                    const temp2 = appendComponentDiyArr
                        ? appendComponentDiyArr.find((o: any) => o.name === item.dataIndex)
                        : null;
                    if (temp) {
                        return (
                            <div key={item.dataIndex}>
                                {appendComponentDiyArr && temp2 && <Col {...getColSetting()}>{temp2.component}</Col>}
                                <Col {...getColSetting()}>
                                    <Form.Item
                                        label={item.title}
                                        key={item.dataIndex}
                                        {...item.layout}
                                        {...getFormItemOptions(item)}
                                    >
                                        {getFieldDecorator(item.dataIndex, {
                                            ...getFormOptions(item),
                                            initialValue:
                                                initialValue[item.dataIndex] !== undefined
                                                    ? initialValue[item.dataIndex]
                                                    : item.formOptions && item.formOptions.initialValue
                                        })(temp)}
                                    </Form.Item>
                                </Col>
                            </div>
                        );
                    }
                    return null;
                })}
                {appendComponent && appendComponent(form) && <Col {...getColSetting()}>{appendComponent(form)}</Col>}
                {showSubmit && (
                    <Col {...getColSetting()}>
                        <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
                            <Button loading={loading} type="primary" htmlType="submit" disabled={isAllDisabled}>
                                {submitBtn}
                            </Button>
                            {cancelBtn && (
                                <Button style={{ marginLeft: '10px' }} onClick={onFormCancel}>
                                    {cancelBtn}
                                </Button>
                            )}
                        </Form.Item>
                    </Col>
                )}
            </Row>
        </Form>
    );
};

export default Form.create<any>()(AutoRenderForm);
