import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Button, message, Modal } from 'antd';
import React, { useRef, useState } from 'react';
import {
  getCountermeasures,
  deleteCountermeasure,
  createCountermeasure,
  updateCountermeasure,
} from './service';

import './index.less';
import { convertDatetimeISO } from '@/shared/common';
import { DeleteIconAction, DetailIconAction, EditIconAction } from '@/components/TableAction';

const Countermeasures = () => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [isAddCountermeasure, setIsAddCountermeasure] = useState(true);
  const [currentRow, setCurrentRow] = useState({});

  const handleVisibleModalEditAdd = (visible) => {
    setVisibleModal(visible);
    if (!visible) {
      setIsAddCountermeasure(true);
      setCurrentRow({});
    }
  };

  const actionRef = useRef();

  const columnsTableList = [
    {
      title: 'Name',
      dataIndex: 'name',
      // sorter: true,
      width: '40%',
    },
    {
      title: 'Cover CVE',
      dataIndex: 'cover_cves',
      width: '30%',
      render: (_, record) => (
        <ul>
          {record.cover_cves.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ),
    },
    {
      title: 'Created at',
      dataIndex: 'created_at',
      width: '10%',
      hideInForm: true,
      hideInSearch: true,
      render: (date) => convertDatetimeISO(date),
    },
    {
      title: 'Updated at',
      dataIndex: 'updated_at',
      width: '10%',
      hideInForm: true,
      hideInSearch: true,
      render: (date) => convertDatetimeISO(date),
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
            setCurrentRow({
              ...record,
              cover_cves: record.cover_cves.join(','),
            });
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
      const success = await deleteCountermeasure(id);
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

  const handleAddEditCountermeasure = async (values) => {
    let sendData = { ...values };
    sendData.cover_cves = sendData.cover_cves.split(',');
    const res = isAddCountermeasure
      ? await createCountermeasure(sendData)
      : await updateCountermeasure(currentRow.id, sendData);
    if (res) {
      message.success(`${isAddCountermeasure ? 'Add' : 'Edit'} countermeasure successful!`);
      if (actionRef.current) {
        actionRef.current.reload();
      }
      setIsAddCountermeasure(true);
      setCurrentRow({});
      return true;
    }
    message.error(`${isAddCountermeasure ? 'Add' : 'Edit'} countermeasure failed!`);
    return false;
  };

  return (
    <PageContainer>
      <ProTable
        // headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        request={getCountermeasures}
        columns={columnsTableList}
        pagination={{
          pageSize: 10,
          hideOnSinglePage: true,
        }}
        toolbar={{
          settings: [],
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
        width="600px"
        visible={visibleModal}
        onVisibleChange={handleVisibleModalEditAdd}
        modalProps={{
          destroyOnClose: true,
        }}
        onFinish={handleAddEditCountermeasure}
        initialValues={currentRow}
        layout={'vertical'}
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

        <ProFormText
          label="Cover CVE"
          rules={[
            {
              required: true,
            },
          ]}
          name="cover_cves"
        />
      </ModalForm>
    </PageContainer>
  );
};

export default Countermeasures;
