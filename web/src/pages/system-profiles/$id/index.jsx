import { convertDatetimeISO } from '@/shared/common';
import { GridContent, PageContainer } from '@ant-design/pro-layout';
import { Card, Col, Descriptions, Row } from 'antd';
import { useState } from 'react';
import { useEffect } from 'react';
import IntroduceRow from '../components/IntroduceRow';
import SystemProfileTopFive from '../components/SystemProfileTopFive';
import './index.less';
import { getSystemProfile } from './service';

const SystemProfileDetail = (props) => {
  const { id } = props?.match?.params;
  const [systemProfile, setSystemProfile] = useState({});

  // const fetchData = async () => {
  //   const res = await getSystemProfile(id)
  //   console.log('Res', res);
  //   setSystemProfile(res.data)
  // }

  useEffect(() => {
    const fetchData = async () => {
      const res = await getSystemProfile(id);
      console.log('Res', res);
      setSystemProfile(res.data);
    };
    fetchData();
  }, []);

  return (
    <PageContainer
      header={{
        title: 'System profile detail',
      }}
      content={
        <Descriptions column={2} style={{ marginBottom: -16 }}>
          <Descriptions.Item label="System profile">
            <a onClick={() => {}}>{systemProfile.name}</a>
          </Descriptions.Item>
        </Descriptions>
      }
    >
      <GridContent>
        <IntroduceRow />
        <Card
          title="System profile detail"
          style={{
            marginBottom: 24,
          }}
        >
          {systemProfile?.name && (
            <ul>
              <li>{`Name: ${systemProfile?.name}`}</li>
              <li>{`Description: ${systemProfile?.description}`}</li>
              {Object.keys(systemProfile?.custom_fields).map((field) => (
                <li key={field}>{`${field}: ${systemProfile?.custom_fields[field]}`}</li>
              ))}
              <li>{`Created at: ${convertDatetimeISO(systemProfile?.created_at)}`}</li>
              <li>{`Updated at: ${convertDatetimeISO(systemProfile?.updated_at)}`}</li>
            </ul>
          )}
        </Card>
        <SystemProfileTopFive />
      </GridContent>
    </PageContainer>
  );
};

export default SystemProfileDetail;
