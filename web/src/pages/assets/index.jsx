import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Button, message, Modal } from 'antd';
import React, { useRef, useState } from 'react';
import { getAssets, deleteAsset, createAsset, updateAsset } from './service';

import './index.less';
import { convertDatetimeISO } from '@/shared/common';
import { DeleteIconAction, EditIconAction } from '@/components/TableAction';
import { ASSET_APPLICATION, ASSET_OS, ASSET_HARDWARE } from '@/shared/constant';

const Assets = () => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [isAddAsset, setIsAddAsset] = useState(true);
  const [currentRow, setCurrentRow] = useState({});

  const actionRef = useRef();

  const handleVisibleModalEditAdd = (visible) => {
    setVisibleModal(visible);
    if (!visible) {
      setIsAddAsset(true);
      setCurrentRow({});
    }
  };

  // console.log('test debug ');

  const columnsTableList = [
    {
      title: 'Name',
      dataIndex: 'name',
      // sorter: true,
      width: '50%',
    },
    {
      title: 'Asset type',
      dataIndex: 'part',
      valueType: 'select',
      valueEnum: {
        o: { text: ASSET_OS },
        a: { text: ASSET_APPLICATION },
        h: { text: ASSET_HARDWARE },
      },
      width: '20%',
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
            setIsAddAsset(false);
            setCurrentRow(record);
          }}
        />,
        // <DetailIconAction
        //     key="detail"
        //     onClick={() => {

        //     }}
        // />,
        <DeleteIconAction
          key="delete"
          onClick={() => {
            Modal.confirm({
              title: 'Delete asset',
              content: 'Are you sure?',
              okText: 'Ok',
              cancelText: 'Cancel',
              onOk: async () => await handleDeleteAsset(record.id),
            });
          }}
        />,
      ],
    },
  ];

  const handleDeleteAsset = async (id) => {
    try {
      const success = await deleteAsset(id);
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

  const handleAddEditAsset = async (values) => {
    let sendData = { ...values };
    const res = isAddAsset
      ? await createAsset(sendData)
      : await updateAsset(currentRow.id, sendData);
    if (res) {
      message.success(`${isAddAsset ? 'Add' : 'Edit'} asset successful!`);
      if (actionRef.current) {
        actionRef.current.reload();
      }
      setIsAddAsset(true);
      setCurrentRow({});
      return true;
    }
    message.error(`${isAddAsset ? 'Add' : 'Edit'} asset failed!`);
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
        request={getAssets}
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
        title={`${isAddAsset ? 'Add' : 'Edit'} asset`}
        width="600px"
        visible={visibleModal}
        onVisibleChange={handleVisibleModalEditAdd}
        modalProps={{
          destroyOnClose: true,
        }}
        onFinish={handleAddEditAsset}
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

        <ProFormSelect
          name="part"
          label="Asset type"
          valueEnum={{
            o: 'OS',
            a: 'APPLICATION',
            h: 'HARDWARE',
          }}
          placeholder="Please select a asset type"
          rules={[{ required: true }]}
        />
      </ModalForm>
    </PageContainer>
  );
};

export default Assets;
