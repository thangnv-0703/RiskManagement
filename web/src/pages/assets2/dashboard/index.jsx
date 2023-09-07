import { useState, useEffect } from 'react';
import { PageContainer, GridContent } from '@ant-design/pro-layout';
import { getHardwares } from '../hardware/service';
import { getSourceCodes } from '../sourceCode/service';
import { getDigitalContents } from '../digitalContent/service';
import { getLicenses } from '../license/service';
import { getHardwareModels } from '../more/hardwareModel/service';
import { getStatuses } from '../more/status/service';
import { getSuppliers } from '../more/supplier/service';
import { getManufacturers } from '../more/manufacturer/service';
import { LaptopOutlined, FileAddFilled, WindowsFilled, BookFilled } from '@ant-design/icons';
import Analytic from '@/components/Dashboard/Analytic/CardAnalytic';
import PieChart from '@/components/Dashboard/Analytic/Piechart';
import ColumnChart from '@/components/Dashboard/Analytic/Columnchart';
import { Row, Col, Card } from 'antd';

const Dashboard = () => {
  const [hardwares, setHardwares] = useState([]);
  const [sourceCodes, setSourceCodes] = useState([]);
  const [digitalContents, setDigitalContents] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [hardwareModels, setHardwareModels] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const getData = async () => {
    setIsLoading(true);
    try {
      const hardwares = await getHardwares();
      const sourceCodes = await getSourceCodes();
      const digitalContents = await getDigitalContents();
      const licenses = await getLicenses();
      const hardwareModels = await getHardwareModels();
      const statuses = await getStatuses();
      const suppliers = await getSuppliers();
      const manufacturers = await getManufacturers();
      setHardwares(hardwares);
      setSourceCodes(sourceCodes);
      setDigitalContents(digitalContents);
      setLicenses(licenses);
      setHardwareModels(hardwareModels);
      setStatuses(statuses);
      setSuppliers(suppliers);
      setManufacturers(manufacturers);
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <GridContent>
      <Row gutter={[16, 16]}>
        <Col md={6} xs={12}>
          <Analytic
            type="hardware"
            quantity={hardwares.length}
            destination="hardware"
            icon={<LaptopOutlined />}
          />
        </Col>
        <Col md={6} xs={12}>
          <Analytic
            type="source code"
            quantity={sourceCodes.length}
            destination="source-code"
            icon={<FileAddFilled />}
          />
        </Col>
        <Col md={6} xs={12}>
          <Analytic
            type="digital content"
            quantity={digitalContents.length}
            destination="digital-content"
            icon={<WindowsFilled />}
          />
        </Col>
        <Col md={6} xs={12}>
          <Analytic
            type="license"
            quantity={licenses.length}
            destination="license"
            icon={<BookFilled />}
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col md={12} xs={24}>
          <Card
            title="Hardware by Hardware Model"
            style={{ borderRadius: '5px' }}
            headStyle={{ textAlign: 'center' }}
          >
            {!isLoading && <PieChart items={hardwareModels} valueType={'num_of_assets'} />}
          </Card>
        </Col>
        <Col md={12} xs={24}>
          <Card
            title="Hardware by Status"
            style={{ borderRadius: '5px' }}
            headStyle={{ textAlign: 'center' }}
          >
            {!isLoading && <PieChart items={statuses} valueType={'num_of_assets'} />}
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col md={12} xs={24}>
          <Card
            title="License by Supplier"
            style={{ borderRadius: '5px' }}
            headStyle={{ textAlign: 'center' }}
          >
            {!isLoading && <ColumnChart items={suppliers} />}
          </Card>
        </Col>
        <Col md={12} xs={24}>
          <Card
            title="License by Manufacturer"
            style={{ borderRadius: '5px' }}
            headStyle={{ textAlign: 'center' }}
          >
            {!isLoading && <ColumnChart items={manufacturers} />}
          </Card>
        </Col>
      </Row>
    </GridContent>
  );
};

export default Dashboard;
