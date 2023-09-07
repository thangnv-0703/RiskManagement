import { InfoCircleOutlined } from '@ant-design/icons';
import { Col, Row, Tooltip } from 'antd';
import numeral from 'numeral';
import Metric from '@/components/Dashboard/Metric';
import { ChartCard } from '@/components/Dashboard/Charts';
const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: {
    marginBottom: 24,
  },
};

const IntroduceRow = () => (
  <Row gutter={24}>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        title="Total assets"
        action={
          <Tooltip title="指标说明">
            <InfoCircleOutlined />
          </Tooltip>
        }
        // loading={loading}
        total={numeral(12).format('0,0')}
      // footer={<Field label="日销售额" value={`￥${numeral(12423).format('0,0')}`} />}
      contentHeight={150}
      >
        <Metric data={{
          critical: 2,
          high: 3,
          medium: 5,
          low: 6,
        }}/>
      </ChartCard>
    </Col>

    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        // loading={loading}
        title="Total deployment scenarios"
        action={
          <Tooltip title="指标说明">
            <InfoCircleOutlined />
          </Tooltip>
        }
        total={numeral(300).format('0,0')}
        // footer={<Field label="日访问量" value={numeral(1234).format('0,0')} />}
        contentHeight={150}
      >
        <Metric data={{
          critical: 20,
          high: 30,
          medium: 50,
          low: 60,
        }}/>
      </ChartCard>
    </Col>
  </Row>
);

export default IntroduceRow;
