import { Table, Typography } from 'antd';
const { Paragraph } = Typography;
import './index.css';

export const FactorDetail = (props) => {
  const { data } = props;
  const columns = [
    {
      title: 'Score Range',
      width: '15%',
      dataIndex: 'scoreRange',
      valueType: 'string',
    },
    {
      title: 'State',
      width: '15%',
      dataIndex: 'state',
      valueType: 'string',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      width: '70%',
      render: (val) => <Paragraph ellipsis={{ tooltip: val, rows: 3 }}>{val}</Paragraph>,
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={false}
      rowClassName={() => 'factor-detail-row'}
    />
  );
};
