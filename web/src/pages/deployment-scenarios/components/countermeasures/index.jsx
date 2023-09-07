import { DeleteIconAction, EditIconAction } from '@/components/TableAction';
import { AV_ALL, PR_ALL } from '@/shared/constant';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import ProForm, { ModalForm, ProFormDigit, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import ProTable from '@ant-design/pro-table';
import { Button, Col, Form, message, Modal, Row, Space } from 'antd';
import { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { getDeploymentScenario } from '../../service';
import { createCountermeasure, getCountermeasures, deleteCountermeasure, updateCountermeasure } from './service';


const CountermeasureList = ({ deployment_scenario_id }) => {

    const [visibleModal, setVisibleModal] = useState(false)
    const [isAddCountermeasure, setIsAddCountermeasure] = useState(true)
    const [currentRow, setCurrentRow] = useState({})

    const actionRef = useRef();

    const onVisibleModalChange = (value) => {
        setVisibleModal(value)
        if (!value) {
            setCurrentRow({})
            setIsAddCountermeasure(true)
        }
    }

    const columnsTableList = [
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: true,
            width: '30%',
        },
        {
            title: 'Cost',
            dataIndex: 'cost',
            hideInForm: true,
            hideInSearch: true,
            width: '20%',
        },
        {
            title: 'Coverage',
            dataIndex: 'coverage',
            hideInForm: true,
            hideInSearch: true,
            width: '20%',
        },
        {
            title: 'Cover CVE(s)',
            dataIndex: 'cover_cves',
            hideInForm: true,
            hideInSearch: true,
            width: '20%',
            render: (cover_cves) => (
                <ul>
                    {
                        cover_cves.map((cve) => (
                            <li key={cve}>{cve}</li>
                        ))
                    }
                </ul>
            )
        },
        {
            title: 'Action',
            dataIndex: 'option',
            valueType: 'option',
            width: '10%',
            render: (_, record) => [
                <EditIconAction
                    key="edit"
                    onClick={() => {
                        setVisibleModal(true);
                        setIsAddCountermeasure(false);
                        setCurrentRow(record);
                    }}
                />,
                <DeleteIconAction
                    key="delete"
                    onClick={() => {
                        Modal.confirm({
                            title: 'Delete countermeasure',
                            content: 'Are you sure？',
                            okText: 'Ok',
                            cancelText: 'Cancel',
                            onOk: async () => await handleDeleteCountermeasure(record.id),
                        });
                    }}
                />,
            ],
        },
    ];

    const handleDeleteCountermeasure = async (id) => {
        try {
            const success = await deleteCountermeasure(deployment_scenario_id, id)
            if (success) {
                message.success('Delete successful!');
                if (actionRef.current) {
                    actionRef.current.reload();
                }
            }
        } catch {
            message.error('Delete failed!')
        }
    }

    const handleAddEditCountermeasure = async (values) => {
        console.log('Values', values);
        let sendData = { ...values }
        if (!Array.isArray(values.cover_cves)){
            sendData.cover_cves = values.cover_cves.split(/[,]/).filter( e  => e.trim()).map(e => e.trim())
        }        
        const res = isAddCountermeasure ? await createCountermeasure(deployment_scenario_id, sendData) : await updateCountermeasure(deployment_scenario_id, currentRow.id, sendData)
        if (res) {
            message.success(`${isAddCountermeasure ? 'Add' : 'Edit'} countermeasure successful!`);
            if (actionRef.current) {
                actionRef.current.reload();
            }
            setIsAddCountermeasure(true)
            setCurrentRow({})
            return true
        }
        message.error(`${isAddCountermeasure ? 'Add' : 'Edit'} countermeasure failed!`);
        return false

    }

    return (
        <>
            <ProTable
                // headerTitle="查询表格"
                actionRef={actionRef}
                rowKey="id"
                search={false}
                request={async (params) => {
                    return await getCountermeasures(deployment_scenario_id, params)
                }}
                columns={columnsTableList}
                pagination={{
                    pageSize: 10,
                }}
                toolbar={{
                    settings: []
                }}
                toolBarRender={() => [
                    <Button
                        type="primary"
                        key="primary"
                        onClick={() => {
                            setVisibleModal(true);
                        }}
                    >
                        <PlusOutlined /> Add
                    </Button>,
                ]}
                bordered
            />
            <ModalForm
                title={`${isAddCountermeasure ? 'Add' : 'Edit'} countermeasure`}
                visible={visibleModal}
                onVisibleChange={onVisibleModalChange}
                modalProps={{
                    destroyOnClose: true
                }}
                onFinish={handleAddEditCountermeasure}
                initialValues={currentRow}
            >
                <ProFormText
                    label="Name"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                    name="name"
                />
                <ProForm.Group>
                <ProFormDigit
                    label="Cost"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                    name="cost"
                    min={0}
                />
                <ProFormDigit
                    label="Coverage"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                    name="coverage"
                    max={1}
                    min={0}
                />
                </ProForm.Group>
                <ProFormText
                    label="Cover CVE(s)"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                    name="cover_cves"
                    tooltip="CVEs are separated by commas"
                />
            </ModalForm>
        </>
    )
};

export default CountermeasureList;