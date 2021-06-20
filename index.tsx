import React, { useState, useEffect } from 'react';
import { Form, Card, Table, Button, Icon, Dropdown, Menu, Alert, message, Popconfirm } from 'antd';
import { DownOutlined } from '@ant-design/icons';
// import { PageHeaderWrapper } from '@ant-design/pro-layout';
import AddEditForm from './form';
import SrhForm from './srh';
import styles from './index.less';

const TableList = ({
    form,
    apis: { apiList, apiDel, apiFind, apiEdit }, // 怎删改查接口
    tableConfig: { action = undefined, isMultiSelect = false, pageToSave = false, showSrh = true, isAction = true }, // 表格配置
    // 排序数据格式，需要和后端沟通，也可以在service层改，主要看后端接口怎么约定
    sortFormat = (params: any) => ({ field: params.field, order: params.order }),
    srhCb = (o: any) => o, // 提交列表查询回调
    getListResponseCb = (o: any) => o, // 获取列表数据回调
    getOneResponseCb = (o: any) => o, // 获取单条数据回调
    onOkSubmitCb = (o: any) => o, // 新增、编辑回调
    config = {}, // 基础配置配置，表格显示字段及校验等，搜索显示字段及校验等，新增编辑显示字段及校验等
    targetBlank = false, // 伪新窗口是否打开
    changeTableTitle = () => {}, // 表格标题
    modalOptions = {}, // 弹层属性注入
    diyAction = () => {}, // 自定义操作方法
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    formAppendComponent = (params: any, formType: any) => {}, // 表单末尾附加组件
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    formAppendComponentDiy = (params: any, formType: any) => {}, // 表单自定义附加组件
    srhAppendComponent = null, // 搜索末尾附加组件
    srhAppendComponentDiy = null, // 搜索自定义附加组件
    refresh = null, // 刷新
    // batch = { fn: () => {}, items: [], isDel: false }
    batch = {} // 批量操作扩展
}: any) => {
    const [data, setData] = useState<any>([]); // 列表数据
    const [loading, setLoading] = useState<any>(false); // 列表loading
    const [pageInfo, setPageInfo] = useState<any>({ showSizeChanger: true, pageSize: 10 }); // 分页信息
    const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]); // 多选key
    const [show, setShow] = useState<any>(false); // 显示表单
    const [formType, setFormType] = useState<String>('add'); // 表单类型，新增或修改
    const [formData, setFormData] = useState<any>({}); // 表单数据
    const [formLoading, setFormLoading] = useState<Boolean>(false); // 表单加载
    const [isAllDisabled, setIsAllDisabled] = useState<Boolean>(false); // 表单详情
    const [editId, setEditId] = useState<any>(0); // 当前编辑哪条及提交的时候修改的key
    const [srh, setSrh] = useState<any>({}); // 搜索字段
    const [filter, setFilter] = useState<any>({}); // 表头过滤字段
    const [sort, setSort] = useState<any>({}); // 排序字段

    const formAppendComponentTemp = (params: any) => formAppendComponent(params, formType);
    const formAppendComponentDiyTemp = (params: any) => formAppendComponentDiy(params, formType);
    /**
     * 获取列表
     * @param param
     */
    const getList = async (paramsTemp: any) => {
        const params = srhCb({ ...paramsTemp });
        const pageSizeTemp = params.pageSize ? params.pageSize : pageInfo.pageSize;
        setLoading(true);
        try {
            const res = await apiList({ ...params, pageSize: pageSizeTemp });
            if (res?.code === 10000 && res.data) {
                const dataTemp = getListResponseCb({ ...res.data });
                const { total = 0, pageNo = 1, pageSize = 10 } = dataTemp;
                setPageInfo({
                    ...pageInfo,
                    pageSize: pageSizeTemp,
                    current: params.pageNo || 1,
                    // 总条数需后端返回
                    total,
                    // 显示总条数、分页等信息
                    showTotal: () => `总共 ${total} 条 第 ${pageNo}/${Math.ceil(total / pageSize)} 页`
                });
                setData(dataTemp);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    /**
     * 获取单条
     * @param param
     */
    const getOne = async (param: any) => {
        setFormLoading(true);
        setEditId(param.id);
        try {
            const res = await apiFind(param);
            if (res?.code === 10000 && res.data) {
                setFormData(getOneResponseCb({ ...res.data }));
            }
            setFormType('edit');
            setShow(!show);
            // changeTableTitle(`${isAllDisabled ? '详情' : '编辑'}`);
            setFormLoading(false);
        } catch (error) {
            setFormLoading(false);
        }
    };

    /**
     * 表格变更触发
     * @param pagination
     * @param filters
     * @param sorter
     */
    const handleTableChange = (pagination: any, filters: any, sorter: any) => {
        // 翻页保留多选则不清空
        if (isMultiSelect && !pageToSave) setSelectedRowKeys([]);
        getList({
            ...srh,
            pageSize: pagination.pageSize || 10,
            pageNo: pagination.current || 1,
            sort: sortFormat(sorter),
            ...filters
        });
        setFilter(filters);
        setSort(sorter);
    };

    /**
     * 搜索
     * @param values
     */
    const onOkSrh = (values: any) => {
        getList({
            ...values,
            ...filter,
            sort: sortFormat(sort)
        });
        // 搜索跳第一页
        setPageInfo({ ...pageInfo, current: 1 });
        setSrh(values);
    };

    /**
     * 删除
     * @param id
     */
    const remove = async (params: any) => {
        const res = await apiDel({ ...params });
        if (res?.code === 10000) {
            message.success('删除成功');
            // 清空多选
            if (isMultiSelect) setSelectedRowKeys([]);
            // 计算删除后返回当前页或者最后一条删除返回上一页
            const { total, pageSize, current: pageNo } = pageInfo;
            let pageNoTemp = Math.ceil((total - 1) / pageSize);
            pageNoTemp = pageNoTemp >= pageNo ? pageNo : pageNo - 1;
            // 批量删除是否要跳第一页
            // if (Array.isArray(id)) pageNoTemp = 1;
            // 重新请求
            getList({ ...srh, ...filter, sort: sortFormat(sort), pageNo: pageNoTemp });
        } else {
            message.error('删除失败');
        }
    };

    // 多选
    const rowSelection: any = () => {
        if (!isMultiSelect) return null;
        return {
            onChange: (keys: any) => {
                console.log('keys: ', keys);
                setSelectedRowKeys(keys);
            },
            selectedRowKeys
        };
    };

    /**
     * 初始化
     */
    useEffect(() => {
        getList({});
    }, []);

    /**
     * 处理新增、修改
     * @param values
     */
    const onOk = async (values: any, cb: any) => {
        let valuesTemp = { ...values };
        let typeTitle = '新建';
        if (formType === 'edit') {
            valuesTemp = { ...valuesTemp, id: editId };
            typeTitle = '修改';
        }
        valuesTemp = onOkSubmitCb({ ...valuesTemp });
        if (cb) cb(true);
        try {
            const res = await apiEdit(valuesTemp);
            if (res?.code === 10000) {
                message.success(`${typeTitle}成功`);
                // 清空多选
                if (isMultiSelect) setSelectedRowKeys([]);
                // 重新请求，需要保留搜索，编辑返回当前页，新增返回第一页
                const pageNoTemp = formType === 'edit' ? pageInfo.current : 1;
                getList({ ...srh, ...filter, sort: sortFormat(sort), pageNo: pageNoTemp });
                setShow(!show);
                changeTableTitle('');
            } else {
                message.error(`${typeTitle}失败`);
            }
            if (cb) cb(false);
        } catch (e) {
            console.log('e: ', e);
            if (cb) cb(false);
        }
    };

    /**
     * 新增
     */
    const addBtn = () => {
        setFormType('add');
        setShow(!show);
        setFormData({});
        changeTableTitle('添加');
    };

    /**
     * 表单取消
     */
    const onCancel = () => {
        setShow(!show);
        setIsAllDisabled(false);
        changeTableTitle('');
    };

    /**
     * 搜索重置
     */
    const onReset = () => {
        // 清空表头筛选和排序
        setFilter({});
        setSort({});
        // 清除多选
        setSelectedRowKeys([]);
        form.resetFields();
    };

    /**
     * refresh, 变化触发刷新
     */
    useEffect(() => {
        onReset();
        getList({});
    }, [refresh]);

    /**
     * 生成配置
     */
    const configSrh = config.filter((item: any) => item.isSrh === undefined || item.isSrh);
    const configForm = config.filter((item: any) => item.isForm === undefined || item.isForm);
    const configColumn: any = () => {
        const genConfig = config.map((item: any) => {
            if (item.isTable === false) return {};
            let temp = {
                ...item
            };
            if (item.sort) {
                temp = { ...temp, sortOrder: sort.columnKey === item.dataIndex ? sort.order : false };
            }
            if (item.filters) {
                temp = {
                    ...temp,
                    filteredValue:
                        filter && filter[item.dataIndex] && filter[item.dataIndex].length ? filter[item.dataIndex] : []
                };
            }
            // 删除自定义属性
            delete temp.options;
            delete temp.formOptions;
            delete temp.isTable;
            delete temp.isForm;
            delete temp.isSrh;
            delete temp.srhType;
            delete temp.type;
            return temp;
        });
        let actionConfig = {};
        const judge = action ? Object.values(action).filter(o => o) : [];
        if ((action === undefined || (action && judge.length)) && isAction) {
            actionConfig = {
                title: '管理',
                width: 250,
                render: (record: any) => (
                    <>
                        {(action?.isEdit === undefined || action?.isEdit) && (
                            <a
                                style={{ marginRight: '10px' }}
                                onClick={() => {
                                    getOne({ ...record });
                                    changeTableTitle('编辑');
                                }}
                            >
                                {formLoading && editId === record.id && !isAllDisabled ? (
                                    <Icon type="loading" />
                                ) : (
                                    <Icon type="edit" />
                                )}{' '}
                                编辑
                            </a>
                        )}
                        {(action?.isDetail === undefined || action?.isDetail) && (
                            <a
                                style={{ marginRight: '10px' }}
                                onClick={() => {
                                    setIsAllDisabled(true);
                                    getOne({ ...record });
                                    changeTableTitle('详情');
                                }}
                            >
                                {formLoading && editId === record.id && isAllDisabled ? (
                                    <Icon type="loading" />
                                ) : (
                                    <Icon type="file-text" />
                                )}{' '}
                                详情
                            </a>
                        )}
                        {diyAction(record)}
                        {(action?.isDel === undefined || action?.isDel) && (
                            <Popconfirm
                                title="确认删除？"
                                onConfirm={() => {
                                    remove({ ...record });
                                }}
                            >
                                <a style={{ color: 'red' }}>
                                    <Icon type="delete" /> 删除
                                </a>
                            </Popconfirm>
                        )}
                    </>
                )
            };
        }
        return [...genConfig, actionConfig];
    };

    /**
     * 工具条，新增、批量操作等
     */
    const toolBarRender = () => [
        (action?.isAdd || action === undefined) && (
            <Button key="add" style={{ margin: '10px 10px 10px 0' }} type="primary" onClick={addBtn}>
                <Icon type="plus" />
                新建
            </Button>
        ),
        selectedRowKeys?.length > 0 && (
            <div
                style={{
                    margin: '10px 10px 10px 0',
                    display: action?.isAdd || action === undefined ? 'inline' : 'block'
                }}
                key="del"
            >
                <Dropdown
                    overlay={
                        <Menu
                            onClick={e => {
                                if (e.key === 'remove') {
                                    remove({ id: selectedRowKeys });
                                } else if (batch.cb) batch.cb(selectedRowKeys, e.key);
                            }}
                            selectedKeys={[]}
                        >
                            {(batch.isDel || batch.isDel === undefined) && <Menu.Item key="remove">批量删除</Menu.Item>}
                            {batch.items && batch.items.map((o: any) => <Menu.Item key={o.key}>{o.label}</Menu.Item>)}
                        </Menu>
                    }
                >
                    <Button>
                        批量操作 <DownOutlined />
                    </Button>
                </Dropdown>
            </div>
        )
    ];

    return (
        <div>
            {(!show && targetBlank) || !targetBlank ? (
                <>
                    {showSrh ? (
                        <Card className={styles.tableListForm}>
                            <SrhForm
                                form={form}
                                config={configSrh}
                                onOk={onOkSrh}
                                onCancel={onReset}
                                appendComponent={srhAppendComponent}
                                appendComponentDiy={srhAppendComponentDiy}
                            />
                        </Card>
                    ) : null}
                    <Card style={{ marginTop: '20px' }}>
                        {isMultiSelect && <Alert message={`选中 ${selectedRowKeys.length} 项`} type="info" />}
                        {toolBarRender()}
                        <Table
                            onChange={handleTableChange}
                            columns={configColumn()}
                            rowKey="id"
                            dataSource={
                                data && Object.prototype.toString.call(data.rows) === '[object Array]' ? data.rows : []
                            }
                            pagination={pageInfo}
                            loading={loading}
                            rowSelection={rowSelection()}
                        />
                    </Card>
                </>
            ) : null}
            <AddEditForm
                modalOptions={modalOptions}
                formData={formData}
                formType={formType}
                config={configForm}
                onOk={onOk}
                onCancel={onCancel}
                show={show}
                isAllDisabled={isAllDisabled}
                showSubmit={!isAllDisabled}
                targetBlank={targetBlank}
                appendComponent={formAppendComponentTemp}
                appendComponentDiy={formAppendComponentDiyTemp}
            />
        </div>
    );
};
export default Form.create<any>()(TableList);
