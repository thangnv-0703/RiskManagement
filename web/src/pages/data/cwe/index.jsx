import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import React, { useRef } from 'react';
import { cwe } from './service';


// const handleUpdate = async (fields, currentRow) => {
//   const hide = message.loading('正在配置');

//   try {
//     await updateRule({ ...currentRow, ...fields });
//     hide();
//     message.success('配置成功');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('配置失败请重试！');
//     return false;
//   }
// };

const CWE = () => {
  const actionRef = useRef();

  const columns = [
    {
      title: 'CWE ID',
      dataIndex: 'cwe_id',
      sorter: true,
      width: '10%',
    },
    {
      title: 'CWE Name',
      dataIndex: 'cwe_name',
      sorter: true,
      width: '30%',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      hideInForm: true,
      hideInSearch: true, 
      // ellipsis: true, // oneline - tooltip khi over
    },
  ];
  return (
    <PageContainer>
      <ProTable
        // headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="cwe_id"
        search={{
          labelWidth: 120,
        }}
        request={cwe}
        columns={columns}
        pagination={{
          pageSize: 10,
        }}
        toolbar={{
          settings: []
        }}
        bordered        
      />
    </PageContainer>
  );
};

export default CWE;
