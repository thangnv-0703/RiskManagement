import { Table, Typography } from 'antd';
import { FactorDetail } from '../factor-detail';
const { Paragraph } = Typography;
import React, { useState, useEffect, useRef, useContext } from 'react';
import { Form, Input } from 'antd';
import { FACTOR_DESCRIPTION } from '@/shared/constant';

const EditableContext = React.createContext(null);

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  const handleChange = (e) => {
    const { value: inputValue } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if (reg.test(inputValue) || inputValue === '' || inputValue === '-') {
      onChange(inputValue);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
          {
            validator: (_, value) => {
              if (dataIndex === 'score' || dataIndex === 'weight') {
                if (!value) {
                  return Promise.reject();
                }
                if (isNaN(value)) {
                  return Promise.reject(`${title} has to be a number.`);
                }
                const num = parseFloat(value);
                if (num > 10 || num < 0) {
                  return Promise.reject(`${title} between 0 and 10.`);
                }
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <Input ref={inputRef} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

export const FactorList = (props) => {
  const { dataSource, keyFactor, updateFactor } = props;

  const columns = [
    {
      title: 'Factor name',
      dataIndex: 'name',
      width: '20%',
      render: (val) => val.replaceAll('_', ' '),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      width: '70%',
      render: (val) => <Paragraph ellipsis={{ tooltip: val, rows: 3 }}>{val}</Paragraph>,
    },
    {
      title: 'Score',
      dataIndex: 'score',
      width: '10%',
      editable: false,
    },
  ];

  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.name === item.name);
    newData[index] = {
      ...row,
      score: parseFloat(row.score).toFixed(1),
      weight: parseFloat(row.weight).toFixed(1),
    };
    updateFactor(newData, keyFactor);
  };

  return (
    <Table
      rowKey="name"
      pagination={false}
      toolBarRender={false}
      components={{
        body: {
          row: EditableRow,
          cell: EditableCell,
        },
      }}
      rowClassName={() => 'editable-row'}
      bordered
      dataSource={dataSource}
      columns={columns.map((col) => {
        if (!col.editable) {
          return col;
        }

        return {
          ...col,
          onCell: (record) => ({
            record,
            editable: col.editable,
            dataIndex: col.dataIndex,
            title: col.title,
            handleSave: handleSave,
          }),
        };
      })}
      expandable={{
        expandedRowRender: (record) => <FactorDetail data={FACTOR_DESCRIPTION[record.name]} />,
      }}
    />
  );
};
