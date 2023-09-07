import { Card, Col, Row, Select, Tabs } from 'antd';
import { RingProgress, Line } from '@ant-design/charts';
import NumberInfo from '@/components/Dashboard/NumberInfo';
import styles from '../style.less';

const CustomTab = ({ data, currentTabKey: currentKey }) => (
  <Row
    gutter={8}
    style={{
      width: 138,
      margin: '8px 0',
    }}
  >
    <Col span={12}>
      <NumberInfo
        title={data.name}
        subTitle="Risk"
        gap={2}
        // total={`${data.cvr * 100}%`}
        theme={currentKey !== data.name ? 'light' : undefined}
      />
    </Col>
    <Col
      span={12}
      style={{
        paddingTop: 36,
      }}
    >
      <RingProgress forceFit height={60} width={60} percent={data.cvr} />
    </Col>
  </Row>
);

const { TabPane } = Tabs;
const { Option } = Select;

const OfflineData = ({ activeKey, loading, offlineData, offlineChartData, handleTabChange }) => (
  <Card
    loading={loading}
    className={styles.offlineCard}
    bordered={false}
    style={{
      marginBottom: 24,
    }}
  >
    <Row
      gutter={24}
      style={{
        marginBottom: 24,
      }}
      justify="space-around"
      align="middle"
    >
      <Col span={16}>
        <b>Deployment profile</b>:{' '}
        <Select
          defaultValue={activeKey}
          onChange={handleTabChange}
          style={{
            width: 300,
          }}
        >
          {
            offlineData.map((item) => (
              <Option value={item.id} key={item.id}>
                {item.name}
              </Option>
            ))
          }
        </Select>
      </Col>
      <Col span={8}>
        <RingProgress forceFit height={60} width={60} percent={offlineData.find(item => item.id === activeKey).cvr} />
      </Col>
    </Row>

    {/* <Tabs activeKey={activeKey} onChange={handleTabChange}>
      {offlineData.map((shop) => (
        <TabPane tab={<CustomTab data={shop} currentTabKey={activeKey} />} key={shop.name}> */}
    <div
      style={{
        padding: '0 24px',
      }}
    >
      <Line
        forceFit
        height={400}
        data={offlineChartData}
        responsive
        xField="date"
        yField="value"
        seriesField="type"
        interactions={[
          {
            type: 'slider',
            cfg: {},
          },
        ]}
        legend={{
          position: 'top-center',
        }}
      />
    </div>
    {/* </TabPane>
      ))}
    </Tabs> */}
  </Card>
);

export default OfflineData;
