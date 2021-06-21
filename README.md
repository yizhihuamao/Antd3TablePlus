这是我参与更文挑战的第4天，活动详情查看：[更文挑战](https://juejin.cn/post/6967194882926444557)

> github地址：https://github.com/yizhihuamao/Antd3TablePlus

### tableConfig = {}
名称 | 备注
---|---
action={} | isAdd: Boolean，是否显示新增按钮<br>isEdit: Boolean，是否显示编辑按钮<br>isDetail: Boolean，是否显示详情按钮<br>isDel: Boolean，是否显示删除按钮
modalOptions={} | [Antd Modal ](https://3x.ant.design/components/modal-cn/#API)
isMultiSelect | Boolean，多选，默认关闭
pageToSave | Boolean，翻页保存多选，默认关闭
targetBlank | Boolean，伪新窗口打开，默认关闭
title | String，标题
showSrh | Boolean，是否显示搜索

### config = {}，包含 [Antd Table Column](https://3x.ant.design/components/table-cn/#Column)，不列出来
名称 | 备注
---|---
isTable | Boolean，是否在表格显示，默认是
isSrh | Boolean，是否在表格搜索显示，默认是
isForm | Boolean，是否在新增、修改表单显示，默认是
isAdd | Boolean，是否在新增表单显示，默认是
isEdit | Boolean，是否在修改表单显示，默认是
type | 见表格下面
options | 对应 type 的 Antd 组件选项
formOptions | [form.getFieldDecorator](https://3x.ant.design/components/form-cn/#getFieldDecorator(id,-options)-%E5%8F%82%E6%95%B0) 参数，如：rules，initialValue
srhOptions | 同 formOptions，为空则不做校验，搜索时覆盖 formOptions
srhType | 搜索的时候使用该类型，覆盖 type，默认同 type
checkboxOptions={} | label: String，单个复选框 label
formItemSrhOptions={} | [Form.Item 属性](https://3x.ant.design/components/form-cn/#Form.Item)，搜索栏，没设置会读取 formItemOptions
formItemOptions={} | [Form.Item 属性](https://3x.ant.design/components/form-cn/#Form.Item)，表格
filters | 同 [Antd Table Column filters](https://3x.ant.design/components/table-cn/#Column)
data | 不在表头显示过滤可以用这个，会覆盖filters，包含：select，radio，checkboxGroup

##### type:
1. input：[Antd Input](https://3x.ant.design/components/input-cn/#Input)，默认，即不设置type
2. select：[Antd Select](https://3x.ant.design/components/select-cn/#API)
3. textarea：[Antd Input.TextArea](https://3x.ant.design/components/input-cn/#Input.TextArea)
4. password/pwd：[Antd Input.Password ](https://3x.ant.design/components/input-cn/#Input.Password-(3.12.0-中新增))
5. number/inputNumber：[Antd InputNumber](https://3x.ant.design/components/input-number-cn/#API)
6. radio：[Antd Radio](https://3x.ant.design/components/radio-cn/#Radio)
7. date/DatePicker：[Antd DatePicker](https://3x.ant.design/components/date-picker-cn/#共同的-API)，另有：RangePicker，MonthPicker，WeekPicker，参考Antd文档
8. checkboxGroup：[Antd Checkbox](https://3x.ant.design/components/checkbox-cn/#Checkbox)
9. checkbox：[Antd Checkbox.Group](https://3x.ant.design/components/checkbox-cn/#Checkbox)

##### 待新增
1. 富文本
2. 上传组件
3. 各种自定义联动组件

### API
```
<TablePlus
    changeTableTitle={changeTableTitle} // targetBlank=true，需要根据操作修改标题
    config={config} // 见上面说明
    apis={apis} // 异步调用接口，默认要求：apiList, apiDel, apiFind, apiEdit
    tableConfig={tableConfig} // 见上面说明
    onOkSubmitCb={onOkSubmitCb} // 新增、修改提交数据调整
    srhCb={srhCb} // 搜索提交数据调整
    targetBlank={tableConfig?.targetBlank}
    modalOptions={tableConfig?.modalOptions}
    diyAction={diyAction} // 自定义操作方法，附加在（编辑）详情和删除中间
    srhAppendComponent={srhAppendComponent} // 搜索末尾附加组件
    srhAppendComponentDiy={srhAppendComponentDiy} // 搜索自定义附加组件
    formAppendComponent={formAppendComponent} // 表单末尾附加组件
    formAppendComponentDiy={formAppendComponentDiy} // 表单自定义附加组件
    refresh={refresh} // 刷新列表, 该数据有变更就会刷新列表数据
    // 批量操作可以新增
    batch={{
        items: [
            { label: '批量开启', key: 'open' },
            { label: '批量关闭', key: 'close' },
            { label: '批量直达', key: 'direct' },
            { label: '批量关闭直达', key: 'closeDirect' }
        ],
        fn: (selects:any, key:String) => {
            console.log('e,ee: ', selects, key);
        }
        // isDel: false // 可以不显示批量删除
    }}
/>
```
### FAQ
1. 单设置页面模板，可用表单生成组件生成
2. 搜索默认值和表单要分开, 比如勾选。可以建立多个同名表单元素, 仅搜索显示即可

### Roadmap
- 优化响应式表格搜索
- 表头筛选在搜索体现, 并且可以删除单个筛选
- 提交表单需要loading, 防止多次点击(已实现)
- 联动校验(已实现)
- 动态表单, 封装通用动态表单
- 订单多状态表格, 可加入Radio.Button实现, 塞入到最顶部作为一个表单元素即可
- 生成api, 前端代码, 直接可用, 用json动态生成
- tab 表格是否实现?
- 详情页区块开发

### Bug
- 搜索条校验时跑位

### Demo
##### index.tsx
```
// TablePlus 通用组件说明
// http://note.youdao.com/noteshare?id=e0f039a208092ab2d7df731e87308d9d&sub=470C3EC2BFC046DA83AC1157EECCE410
import React, { useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Tag, Icon, message } from 'antd';
import apis from './services/global';
import apisAliasGlobal from './services/aliasGlobal';
import TablePlus from '@/components/TablePlus/index';
import AddEditForm from '@/components/TablePlus/form';

const TableList = () => {
    const [show, setShow] = useState<Boolean>(false); // 显示表单
    const [refresh, setRefresh] = useState<Boolean>(false); // 显示表单
    const [formData, setFormData] = useState<any>({}); // 表单数据

    // 表格配置
    const tableConfig: any = {
        action: {
            isAdd: true, // 显示删除按钮
            isDel: true, // 显示删除按钮
            isEdit: true, // 显示编辑按钮
            isDetail: false // 显示详情按钮
        },
        isMultiSelect: true,
        pageToSave: true,
        modalOptions: {
            width: 700
        }
    };
    // 添加别名
    const configForm = [
        {
            dataIndex: 'alias',
            title: '别名',
            formOptions: {
                rules: [
                    {
                        required: true,
                        message: '请输入别名'
                    }
                ]
            }
        },
        {
            dataIndex: 'command',
            title: '命令',
            options: {
                disabled: true
            }
        }
    ];
    // 表单配置
    const config = [
        {
            dataIndex: 'id',
            title: 'ID',
            width: 100,
            isSrh: false,
            isForm: false
        },
        {
            dataIndex: 'addtime',
            title: '添加时间',
            type: 'RangePicker',
            isTable: false,
            isAdd: false,
            isEdit: false
        },
        {
            dataIndex: 'command',
            title: '命令',
            width: 150,
            formOptions: {
                rules: [
                    {
                        required: true,
                        message: '请输入命令'
                    }
                ]
            },
            srhFormOptions: {}
        },
        {
            dataIndex: 'tag',
            title: '标签',
            width: 150,
            type: 'checkboxGroup',
            render: (item: any) =>
                item?.split(',').map((o: any) => {
                    const style = { marginBottom: '8px' };
                    if (o - 0 === 1) {
                        return (
                            <Tag key={o} style={style} color="red">
                                动漫
                            </Tag>
                        );
                    }
                    if (o - 0 === 2) {
                        return (
                            <Tag key={o} style={style} color="green">
                                音乐
                            </Tag>
                        );
                    }
                    if (o - 0 === 3) {
                        return (
                            <Tag key={o} style={style} color="blue">
                                影视
                            </Tag>
                        );
                    }
                    return '';
                }),
            isSrh: false,
            filters: [
                {
                    text: '动漫',
                    value: 1
                },
                {
                    text: '音乐',
                    value: 2
                },
                {
                    text: '影视',
                    value: 3
                }
            ]
        },
        {
            dataIndex: 'url',
            title: '地址',
            width: 350,
            formItemOptions: {
                help: "必须是完整的网址, 非直达网址可以用 '$str' 替换动态字符串"
            },
            formItemSrhOptions: {},
            formOptions: {
                rules: [
                    {
                        required: true,
                        message: '请输入地址'
                    }
                ]
            },
            type: 'input',
            srhFormOptions: {}
        },
        {
            dataIndex: 'is_pass',
            title: '直达',
            render: (item: any) => <span style={{ color: item ? 'green' : 'red' }}>{item ? '是' : '否'}</span>,
            type: 'checkbox',
            isSrh: false,
            filters: [
                {
                    text: '是',
                    value: 1
                },
                {
                    text: '否',
                    value: 0
                }
            ],
            checkboxOptions: {
                label: '勾选为直达'
            },
            filterMultiple: false,
            width: 100
        },
        {
            dataIndex: 'click',
            title: '点击',
            render: (item: any) => <span>{item} 次</span>,
            type: 'number',
            width: 80
        },
        {
            dataIndex: 'pr',
            title: 'PR',
            type: 'number',
            width: 100
        },
        {
            dataIndex: 'is_diy',
            title: 'DIY',
            type: 'radio',
            render: (item: any) => <span style={{ color: item ? 'green' : 'red' }}>{item ? '是' : '否'}</span>,
            filters: [
                {
                    text: '是',
                    value: 1
                },
                {
                    text: '否',
                    value: 0
                }
            ],
            filterMultiple: false,
            isSrh: false,
            width: 100
        },
        {
            dataIndex: 'is_show',
            title: '状态',
            type: 'select',
            render: (item: any) => <span style={{ color: item ? 'green' : 'red' }}>{item ? '开启' : '关闭'}</span>,
            filters: [
                {
                    text: '开启',
                    value: 1
                },
                {
                    text: '关闭',
                    value: 0
                }
            ],
            filterMultiple: false,
            formOptions: {
                initialValue: 0
            },
            isSrh: false,
            width: 100
        },
        {
            dataIndex: 'method',
            title: '方法',
            isSrh: false,
            type: 'select',
            formOptions: {
                initialValue: 'get'
            },
            filters: [
                {
                    text: 'get',
                    value: 'get'
                },
                {
                    text: 'post',
                    value: 'post'
                }
            ],
            filterMultiple: false,
            width: 100
        },
        {
            dataIndex: 'memo',
            title: '备注',
            type: 'textarea',
            width: 200,
            srhFormOptions: {}, // 为空则不做校验，搜索时覆盖 formOptions
            srhType: 'input' // 搜索的时候使用该类型
        }
    ];

    // 新增、修改提交数据调整
    const onOkSubmitCb = (values: any) => {
        const valuesTemp = { ...values };
        if (!valuesTemp.is_diy) valuesTemp.is_diy = 0;
        if (!valuesTemp.is_pass) valuesTemp.is_pass = 0;
        return valuesTemp;
    };
    // 获取单条记录返回回调
    const getOneResponseCb = (values: any) => {
        const valuesTemp = { ...values };
        if (valuesTemp?.tag) valuesTemp.tag = valuesTemp.tag.split(',').map((o: any) => o - 0);
        return valuesTemp;
    };
    // 搜索提交数据调整
    const srhCb = (values: any) => {
        const valuesTemp = { ...values };
        return valuesTemp;
    };
    // 添加别名管理按钮
    const diyAction = (values: any) => (
        <span>
            <a style={{ marginRight: '10px' }} onClick={() => {
                setShow(true);
                setFormData({ command: values.command })
            }}>
                <Icon type="plus" /> 别名
            </a>
            <br />
        </span>
    );
    // 添加别名
    const addAliasGlobal = async (values:any, cb:any) => {
        if (cb)cb(true);
        try {
            const res = await apisAliasGlobal.apiEdit(values);
            if (res?.code === 10000) {
                setShow(false);
                setRefresh(!refresh);
                message.success('添加成功');
            } else {
                message.error('添加失败');
            }
            if (cb)cb(false);
        } catch (e) {
            console.log('e: ', e);
            if (cb)cb(false);
        }
    };
    return (
        <PageHeaderWrapper title="全局命令">
            <TablePlus
                config={config}
                apis={apis}
                tableConfig={tableConfig}
                onOkSubmitCb={onOkSubmitCb}
                getOneResponseCb={getOneResponseCb}
                srhCb={srhCb}
                targetBlank={tableConfig?.targetBlank}
                modalOptions={tableConfig?.modalOptions}
                diyAction={diyAction}
                refresh={refresh}
                batch={{
                    items: [
                        { label: '批量开启', key: 'open' },
                        { label: '批量关闭', key: 'close' },
                        { label: '批量直达', key: 'direct' },
                        { label: '批量关闭直达', key: 'closeDirect' }
                    ],
                    fn: (selects:any, key:String) => {
                        console.log('e,ee: ', selects, key);
                    }
                    // isDel: false
                }}
            />
            {/* 添加别名 */}
            {show ? (
                <AddEditForm
                    modalOptions={{ title: '添加别名' }}
                    formData={formData}
                    config={configForm}
                    onOk={addAliasGlobal}
                    onCancel={() => { setShow(false) }}
                    show={show}
                    targetBlank={false}
                />
            ) : null}
        </PageHeaderWrapper>
    );
};
export default TableList;
```
##### ./services/aliasGlobal.ts，在这里和后端api的数据做映射，也可在TablePlus暴露的方法修改

```
import request from '@/utils/request';

async function apiList(params: any) {
    return request('http://172.16.54.48:8011/mock/vv-api/cmdGlobal.php?api=list', {
        method: 'POST',
        data: params
    });
}
// 最大限度支持后端删除的key
async function apiDel(params: any) {
    return request('http://172.16.54.48:8011/mock/vv-api/cmdGlobal.php?api=del', {
        method: 'POST',
        data: { id: params.id }
    });
}
async function apiEdit(params: any) {
    return request('http://172.16.54.48:8011/mock/vv-api/cmdGlobal.php?api=edit', {
        method: 'POST',
        data: { ...params }
    });
}
// 最大限度支持后端查询的key
async function apiFind(params: any) {
    return request('http://172.16.54.48:8011/mock/vv-api/cmdGlobal.php?api=find', {
        method: 'GET',
        params: { id: params.id }
    });
}

export default { apiList, apiDel, apiFind, apiEdit };

```
##### ./services/aliasGlobal.ts，在这里和后端api的数据做映射，也可在TablePlus暴露的方法修改

```
import request from '@/utils/request';

async function apiList(params: any) {
    return request('http://172.16.54.48:8011/mock/vv-api/aliasGlobal.php?api=list', {
        method: 'POST',
        data: params
    });
}
// 最大限度支持后端删除的key
async function apiDel(params: any) {
    return request('http://172.16.54.48:8011/mock/vv-api/aliasGlobal.php?api=del', {
        method: 'POST',
        data: { id: params.id }
    });
}
async function apiEdit(params: any) {
    return request('http://172.16.54.48:8011/mock/vv-api/aliasGlobal.php?api=edit', {
        method: 'POST',
        data: { ...params }
    });
}
// 最大限度支持后端查询的key
async function apiFind(params: any) {
    return request('http://172.16.54.48:8011/mock/vv-api/aliasGlobal.php?api=find', {
        method: 'GET',
        params: { id: params.id }
    });
}

export default { apiList, apiDel, apiFind, apiEdit };
```

##### ./pwd.tsx，修改密码，类似设置页面可以直接参考食用，支持联动校验（内有联动校验Demo）

```
import React from 'react';
import { Form, Card, Input } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import FormList from '@/components/TablePlus/autoRender';

const Pwd = (props: any) => {
    const { form, formData = {} } = props;
    const config = [
        {
            dataIndex: 'username',
            title: '账号',
            options: {
                disabled: true
            },
            formItemOptions: {
                wrapperCol: { span: 6 }
            },
            formOptions: {
                initialValue: 'woojufon@qq.com'
            }
        },
        {
            dataIndex: 'pwd',
            title: '原密码',
            type: 'pwd',
            formItemOptions: {
                wrapperCol: { span: 6 }
            },
            formOptions: {
                rules: [
                    {
                        required: true,
                        message: '请输入原密码'
                    }
                ]
            }
        }
        // {
        //     dataIndex: 'newPwd',
        //     title: '输入密码',
        //     type: 'pwd',
        //     formItemOptions: {
        //         wrapperCol: { span: 6 }
        //     },
        //     formOptions: {
        //         rules: [
        //             {
        //                 required: true,
        //                 message: '不能为空'
        //             }
        //         ]
        //     }
        // },
        // {
        //     dataIndex: 'newPwd2',
        //     title: '确认密码',
        //     type: 'pwd',
        //     formItemOptions: {
        //         wrapperCol: { span: 6 }
        //     },
        //     formOptions: {
        //         rules: [
        //             {
        //                 required: true,
        //                 message: '不能为空'
        //             }
        //         ]
        //     }
        // }
    ];
    const appendComponent = (formTemp: any) => {
        const { getFieldDecorator, getFieldValue } = formTemp;
        const temp = (
            <>
                <Form.Item label="输入密码" wrapperCol={{ span: 6 }}>
                    {getFieldDecorator('newPwd', {
                        rules: [
                            {
                                required: true,
                                message: '请输入密码'
                            },
                            {
                                validator: (_: any, value: any, callback: any) => {
                                    try {
                                        const newPwd = getFieldValue('newPwd2');
                                        if (newPwd && value && newPwd !== value) callback('两次密码不一致，请重试');
                                        callback();
                                    } catch (error) {
                                        console.log('error: ', error);
                                    }
                                }
                            }
                        ]
                    })(
                        <Input.Password
                            allowClear
                            onChange={() => {
                                setTimeout(() => {
                                    if (getFieldValue('newPwd2'))form.validateFields(['newPwd2']);
                                }, 0);
                            }}
                        />
                    )}
                </Form.Item>
                <Form.Item label="确认密码" wrapperCol={{ span: 6 }}>
                    {getFieldDecorator('newPwd2', {
                        rules: [
                            {
                                required: true,
                                message: '请输入确认密码'
                            },
                            {
                                validator: (_: any, value: any, callback: any) => {
                                    try {
                                        const newPwd = getFieldValue('newPwd');
                                        if (newPwd && value && newPwd !== value) {
                                            callback('两次密码不一致，请重试');
                                        }
                                        callback();
                                    } catch (error) {
                                        console.log('error: ', error);
                                    }
                                }
                            }
                        ]
                    })(
                        <Input.Password
                            allowClear
                            onChange={() => {
                                setTimeout(() => {
                                    if (getFieldValue('newPwd'))form.validateFields(['newPwd']);
                                }, 0);
                            }}
                        />
                    )}
                </Form.Item>
            </>
        );
        return temp;
    };
    const onOk = (values: any) => {
        console.log('values: ', values);
    };
    return (
        <PageHeaderWrapper title="修改密码">
            <Card>
                <FormList
                    key="autoRender"
                    form={form}
                    formList={config}
                    initialValue={formData}
                    onFormSubmit={onOk}
                    cancelBtn=""
                    submitBtn="修改密码"
                    appendComponent={appendComponent} // 表单末尾附加组件
                />
            </Card>
        </PageHeaderWrapper>
    );
};
export default Form.create<any>()(Pwd);

```
