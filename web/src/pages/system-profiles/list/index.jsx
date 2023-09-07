import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProFormText,
  ProFormTextArea,
  ProForm,
  EditableProTable,
} from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Button, Col, Form, Input, message, Modal, Row, Space } from 'antd';
import React, { useRef, useState } from 'react';
import {
  getSystemProfiles,
  deleteSystemProfile,
  createSystemProfile,
  updateSystemProfile,
} from './service';
import { history } from 'umi';
import './index.less';
import { DeleteIconAction, DetailIconAction, EditIconAction } from '@/components/TableAction';

const SystemProfiles = () => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [isAddSystemProfile, setIsAddSystemProfile] = useState(true);
  const [currentRow, setCurrentRow] = useState({});

  const actionRef = useRef();

  const handleVisibleModalEditAdd = (visible) => {
    setVisibleModal(visible);
    if (!visible) {
      setIsAddSystemProfile(true);
      setCurrentRow({});
    }
  };

  const columnsTableList = [
    {
      title: 'Name',
      dataIndex: 'name',
      // sorter: true,
      width: '20%',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      hideInForm: true,
      hideInSearch: true,
      width: '40%',
    },
    {
      title: 'Other',
      dataIndex: 'custom_fields',
      key: 'custom_fields',
      hideInForm: true,
      hideInSearch: true,
      width: '30%',
      render: (_, record) => (
        <ul>
          {Object.keys(record.custom_fields).map((item) => (
            <li key={item}>{`${item}: ${record.custom_fields[item]}`}</li>
          ))}
        </ul>
      ),
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
            setIsAddSystemProfile(false);
            let tmpCustomFields = Object.keys(record.custom_fields).map((attr) => ({
              attribute: attr,
              value: record.custom_fields[attr],
            }));
            setCurrentRow({
              ...record,
              custom_fields: tmpCustomFields,
            });
          }}
        />,
        <DetailIconAction
          key="detail"
          onClick={() => {
            history.push(`/system-profiles/${record.id}`);
          }}
        />,
        <DeleteIconAction
          key="delete"
          onClick={() => {
            Modal.confirm({
              title: 'Delete system profile',
              content: 'Are you sure？',
              okText: 'Ok',
              cancelText: 'Cancel',
              onOk: async () => await handleDeleteSystemProfile(record.id),
            });
          }}
        />,
      ],
    },
  ];

  const handleDeleteSystemProfile = async (id) => {
    try {
      const success = await deleteSystemProfile(id);
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

  const handleAddEditSystemProfile = async (values) => {
    let sendData = { ...values };
    if (sendData.custom_fields) {
      let customFields = {};
      sendData.custom_fields.map((field) => {
        customFields[field.attribute] = field.value;
      });
      sendData.custom_fields = customFields;
    }
    const res = isAddSystemProfile
      ? await createSystemProfile(sendData)
      : await updateSystemProfile(currentRow.id, sendData);
    if (res) {
      message.success(`${isAddSystemProfile ? 'Add' : 'Edit'} system profile successful!`);
      if (actionRef.current) {
        actionRef.current.reload();
      }
      setIsAddSystemProfile(true);
      setCurrentRow({});
      return true;
    }
    message.error(`${isAddSystemProfile ? 'Add' : 'Edit'} system profile failed!`);
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
        request={getSystemProfiles}
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
        title={`${isAddSystemProfile ? 'Add' : 'Edit'} system profile`}
        width="800px"
        visible={visibleModal}
        onVisibleChange={handleVisibleModalEditAdd}
        modalProps={{
          destroyOnClose: true,
        }}
        onFinish={handleAddEditSystemProfile}
        initialValues={currentRow}
      >
        <Row>
          <Col span={9}>
            <ProFormText
              label="Name"
              rules={[
                {
                  required: true,
                },
              ]}
              name="name"
            />
            <ProFormTextArea
              label="Desciption"
              rules={[
                {
                  required: true,
                },
              ]}
              name="description"
            />
          </Col>
          <Col span={14} offset={1}>
            <Row style={{ marginBottom: 9 }}>Custom fields</Row>
            <Form.List name="custom_fields">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <ProFormText
                        rules={[
                          {
                            required: true,
                          },
                        ]}
                        name={[name, 'attribute']}
                      />
                      <ProFormText
                        rules={[
                          {
                            required: true,
                          },
                        ]}
                        name={[name, 'value']}
                      />
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      Add field
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Col>
        </Row>
      </ModalForm>
    </PageContainer>
  );
};

export default SystemProfiles;
