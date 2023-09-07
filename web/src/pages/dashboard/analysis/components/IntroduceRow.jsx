import Analytic from '@/components/Dashboard/Analytic/CardAnalytic';
import { Card, Col, Row, Tooltip } from 'antd';
import { LaptopOutlined, FileAddFilled, WindowsFilled, BookFilled } from '@ant-design/icons';
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

const IntroduceRow = ({ loading, visitData }) => {
  return (
    <Row gutter={[16, 16]}>
      <Col md={6} xs={12}>
        <Analytic
          type="system profile"
          quantity={visitData?.system_profiles?.total}
          destination="system-profiles"
          icon={<LaptopOutlined />}
        />
      </Col>
      <Col md={6} xs={12}>
        <Analytic
          type="deployment scenario"
          quantity={visitData?.deployment_scenarios?.total}
          destination="deployment-scenarios"
          icon={<FileAddFilled />}
        />
      </Col>
      <Col md={6} xs={12}>
        <Analytic
          type="asset"
          quantity={visitData?.assets?.total}
          destination="assets/dashboard"
          icon={<WindowsFilled />}
        />
      </Col>
      <Col md={6} xs={12}>
        <Analytic
          type="countermeasure"
          quantity={visitData?.countermeasures?.total}
          destination="countermeasures"
          icon={<BookFilled />}
        />
      </Col>
    </Row>
  );
};

export default IntroduceRow;
