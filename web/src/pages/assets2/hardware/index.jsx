import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Button, message, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormDatePicker,
  ProForm,
  ProFormDigit,
} from '@ant-design/pro-form';
import { DeleteIconAction, EditIconAction } from '@/components/TableAction';
import { getHardwares, deleteHardware, createHardware, updateHardware } from './service';
import { getHardwareModels } from '../more/hardwareModel/service';
import { getDepartments } from '../more/department/service';
import { getSuppliers } from '../more/supplier/service';
import { getStatuses } from '../more/status/service';
import { convertDatetimeISO } from '@/shared/common';

const Hardware = () => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [isAddHardware, setIsAddHardware] = useState(true);
  const [currentRow, setCurrentRow] = useState({});

  const actionRef = useRef();

  const handleVisibleModalEditAdd = (visible) => {
    setVisibleModal(visible);
    if (!visible) {
      setIsAddHardware(true);
      setCurrentRow({});
    }
  };

  const columnsTableList = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: true,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Model',
      dataIndex: 'asset_model',
    },
    {
      title: 'Purchase cost',
      dataIndex: 'purchase_cost',
      render: (cost) => `${cost}đ`,
    },
    {
      title: 'Purchase date',
      dataIndex: 'purchase_date',
      render: (date) => convertDatetimeISO(date),
    },
    {
      title: 'Department',
      dataIndex: 'department',
    },
    {
      title: 'Supplier',
      dataIndex: 'supplier',
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: 'Deployment Scenario',
      dataIndex: 'deployment_scenarios',
      render: (data) => {
        return data.length != 0 ? (
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {data.map((item) => (
              <li>
                <a href={`${window.location.origin}/deployment-scenarios/mapping/${item.id}`}>
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          'N/A'
        );
      },
    },
    {
      title: 'Top CVEs on Asset',
      dataIndex: 'cves',
      // width: '16%',
      render: (data) => {
        if (data.length === 0) return 'N/A';
        else {
          const displayData = data.slice(0, Math.min(data.length, 3));
          return (
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {displayData.map((item) => (
                <li>{item.cve_id}</li>
              ))}
            </ul>
          );
        }
      },
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
            setIsAddHardware(false);
            setCurrentRow(record);
          }}
        />,
        <DeleteIconAction
          key="delete"
          onClick={() => {
            Modal.confirm({
              title: 'Delete hardware',
              content: 'Are you sure?',
              okText: 'Ok',
              cancelText: 'Cancel',
              onOk: async () => await handleDeleteHardware(record.id),
            });
          }}
        />,
      ],
    },
  ];

  const handleDeleteHardware = async (id) => {
    try {
      const success = await deleteHardware({ id });
      if (success) {
        message.success('Delete successful!');
        if (actionRef.current) {
          actionRef.current.reload();
        }
      }
    } catch {
      message.error('Delete failed!');
    }
  };

  const handleAddEditHardware = async (values) => {
    console.log(values);
    const res = isAddHardware
      ? await createHardware(values)
      : await updateHardware({ id: currentRow.id, ...values });
    if (res) {
      message.success(`${isAddHardware ? 'Add' : 'Edit'} hardware successful!`);
      if (actionRef.current) {
        actionRef.current.reload();
      }
      setIsAddHardware(true);
      setCurrentRow({});
      return true;
    }
    message.error(`${isAddHardware ? 'Add' : 'Edit'} hardware failed!`);
    return false;
  };

  return (
    <PageContainer>
      <ProTable
        actionRef={actionRef}
        rowKey="id"
        // search={{
        //   labelWidth: 120,
        // }}
        search={false}
        request={async (params) => {
          const data = await getHardwares({ ...params });
          return {
            data,
            success: true,
          };
        }}
        columns={columnsTableList}
        pagination={{
          pageSize: 10,
        }}
        // headerTitle="Hardware Table"
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
        title={`${isAddHardware ? 'Add' : 'Edit'} hardware`}
        width="600px"
        visible={visibleModal}
        onVisibleChange={handleVisibleModalEditAdd}
        modalProps={{
          destroyOnClose: true,
        }}
        onFinish={handleAddEditHardware}
        initialValues={currentRow}
        layout={'vertical'}
      >
        <ProFormText
          label="Name"
          rules={[
            {
              required: true,
              message: 'Please enter a name',
            },
          ]}
          name="name"
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ flexBasis: '45%' }}>
            <ProFormDigit
              label="Purchase cost"
              rules={[
                {
                  required: true,
                  message: 'Please enter purchase cost',
                },
              ]}
              name="purchase_cost"
            />
          </div>
          <div style={{ flexBasis: '45%' }}>
            <ProFormDatePicker
              label="Purchase date"
              rules={[
                {
                  required: true,
                  message: 'Please enter the purchase date',
                },
              ]}
              name="purchase_date"
              type
            />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ flexBasis: '45%' }}>
            <ProFormSelect
              label="Model"
              rules={[
                {
                  required: true,
                  message: 'Please select a hardware model!',
                },
              ]}
              name="assetModelId"
              request={async () => {
                const hardwareModels = await getHardwareModels();
                return hardwareModels.map((hardwareModel) => ({
                  label: hardwareModel.name,
                  value: hardwareModel.id,
                }));
              }}
              placeholder="Please select a hardware model"
            />
          </div>
          <div style={{ flexBasis: '45%' }}>
            <ProFormSelect
              label="Department"
              rules={[
                {
                  required: true,
                  message: 'Please select a department!',
                },
              ]}
              name="departmentId"
              request={async () => {
                const departments = await getDepartments();
                return departments.map((department) => ({
                  label: department.name,
                  value: department.id,
                }));
              }}
              placeholder="Please select a department"
            />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ flexBasis: '45%' }}>
            <ProFormSelect
              label="Supplier"
              rules={[
                {
                  required: true,
                  message: 'Please select a supplier!',
                },
              ]}
              name="supplierId"
              request={async () => {
                const suppliers = await getSuppliers();
                return suppliers.map((supplier) => ({
                  label: supplier.name,
                  value: supplier.id,
                }));
              }}
              placeholder="Please select a supplier"
            />
          </div>
          <div style={{ flexBasis: '45%' }}>
            <ProFormSelect
              label="Status"
              rules={[
                {
                  required: true,
                  message: 'Please select a status!',
                },
              ]}
              name="statusId"
              request={async () => {
                const statuses = await getStatuses();
                return statuses.map((status) => ({
                  label: status.name,
                  value: status.id,
                }));
              }}
              placeholder="Please select a status"
            />
          </div>
        </div>
      </ModalForm>
    </PageContainer>
  );
};

export default Hardware;
