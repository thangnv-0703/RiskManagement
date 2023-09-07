import { DeleteIconAction, EditIconAction } from '@/components/TableAction';
import { ATTACKER_TYPE, AV_ALL, MAX_INT, PR_ALL } from '@/shared/constant';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import ProForm, {
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import ProTable from '@ant-design/pro-table';
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Row,
  Space,
  Table,
  Typography,
} from 'antd';
import { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { getDeploymentScenario } from '../../service';
import { createAttacker, getAttackers, deleteAttacker, updateAttacker } from './service';

const AttackerList = ({ deployment_scenario_id }) => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [isAddAttacker, setIsAddAttacker] = useState(true);
  const [currentRow, setCurrentRow] = useState({});
  const [deploymentScenario, setDeploymentScenario] = useState({});

  const actionRef = useRef();

  const handleVisibleModalEditAdd = (visible) => {
    setVisibleModal(visible);
    if (!visible) {
      setIsAddAttacker(true);
      setCurrentRow({});
    }
  };

  const columnsTableList = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: true,
      width: '10%',
    },
    {
      title: 'Type of threat',
      dataIndex: 'type',
      sorter: true,
      width: '20%',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      hideInForm: true,
      hideInSearch: true,
      width: '30%',
    },
    {
      title: 'Target asset',
      tip: 'Asset name - Attack vector - Privilege',
      dataIndex: 'targets',
      key: 'targets',
      hideInForm: true,
      hideInSearch: true,
      width: '30%',
      render: (targets, record) => (
        <ul>
          {targets.map((target) => (
            <li key={target.asset_id}>
              {`${deploymentScenario?.assets?.find((as) => as.id === target.asset_id)?.name} - ${
                target.attack_vector
              } - ${target.privilege}`}
            </li>
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
            setIsAddAttacker(false);
            setCurrentRow(record);
          }}
        />,
        <DeleteIconAction
          key="delete"
          onClick={() => {
            Modal.confirm({
              title: 'Delete threat',
              content: 'Are you sure？',
              okText: 'Ok',
              cancelText: 'Cancel',
              onOk: async () => await handleDeleteAttacker(record.id),
            });
          }}
        />,
      ],
    },
  ];

  const handleDeleteAttacker = async (id) => {
    try {
      const success = await deleteAttacker(deployment_scenario_id, id);
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

  const handleAddEditAttacker = async (values) => {
    if (!values.targets.length) {
      message.error('Please setup target asset');
      return false;
    }
    let sendData = { ...values };
    const res = isAddAttacker
      ? await createAttacker(deployment_scenario_id, sendData)
      : await updateAttacker(deployment_scenario_id, currentRow.id, sendData);
    if (res) {
      message.success(`${isAddAttacker ? 'Add' : 'Edit'} threat successful!`);
      if (actionRef.current) {
        actionRef.current.reload();
      }
      setIsAddAttacker(true);
      setCurrentRow({});
      return true;
    }
    message.error(`${isAddAttacker ? 'Add' : 'Edit'} threat failed!`);
    return false;
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await getDeploymentScenario(deployment_scenario_id);
      setDeploymentScenario(res.data);
    };
    fetchData();
  }, []);

  return (
    <>
      <ProTable
        // headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="id"
        search={false}
        request={async (params) => {
          return await getAttackers(deployment_scenario_id, params);
        }}
        columns={columnsTableList}
        pagination={{
          pageSize: 10,
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
        title={`${isAddAttacker ? 'Add' : 'Edit'} threat`}
        width="1000px"
        visible={visibleModal}
        onVisibleChange={handleVisibleModalEditAdd}
        modalProps={{
          destroyOnClose: true,
        }}
        onFinish={handleAddEditAttacker}
        initialValues={currentRow}
      >
        <Row gutter={10}>
          <Col span={8}>
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
              label="Type of threat"
              rules={[
                {
                  required: true,
                },
              ]}
              name="type"
              options={ATTACKER_TYPE.map((type) => ({
                label: type,
                value: type,
              }))}
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
          <Col span={16}>
            <div
              style={{
                height: 300,
                overflow: 'auto',
              }}
            >
              <Row style={{ marginBottom: 9 }}>Target assets</Row>
              <Row style={{ marginBottom: 9 }}>
                <Col span={13}>Asset</Col>
                <Col span={4}>Attack vector</Col>
                <Col span={5}>Privilege</Col>
              </Row>
              <Form.List name="targets">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Space
                        key={key}
                        style={{ display: 'flex', marginBottom: 8 }}
                        align="baseline"
                      >
                        <ProFormSelect
                          options={deploymentScenario?.assets?.map((asset) => ({
                            label: asset.name,
                            value: asset.id,
                          }))}
                          rules={[
                            {
                              required: true,
                            },
                          ]}
                          name={[name, 'asset_id']}
                          width="md"
                        />
                        <ProFormSelect
                          options={AV_ALL.map((av) => ({
                            label: av,
                            value: av,
                          }))}
                          rules={[
                            {
                              required: true,
                            },
                          ]}
                          name={[name, 'attack_vector']}
                          width="xs"
                        />
                        <ProFormSelect
                          options={PR_ALL.map((pr) => ({
                            label: pr,
                            value: pr,
                          }))}
                          rules={[
                            {
                              required: true,
                            },
                          ]}
                          name={[name, 'privilege']}
                          width="xs"
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
            </div>
          </Col>
        </Row>
      </ModalForm>
    </>
  );
};

export default AttackerList;
