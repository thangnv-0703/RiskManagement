import styles from '../style.less';
import { Column } from '@ant-design/plots';
import { BidirectionalBar } from '@ant-design/plots';
import { Scatter } from '@ant-design/charts';
import {
  likelihoodToType,
  riskLevelNumberToType,
  riskLevelToType,
  riskLikelihoodNumberToType,
  riskSeverityNumberToType,
  severityToType,
  toFixNumber,
  convertImpactToNumber,
} from '@/shared/common';
import {
  CRITICAL_COLOR,
  HIGH_COLOR,
  LOW_COLOR,
  MEDIUM_COLOR,
  NODE_DECISION,
  NODE_DECISION_TRUE,
  RISK_MATRIX,
} from '@/shared/constant';
import { Col, Row, Typography } from 'antd';
import ProTable from '@ant-design/pro-table';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
const { Paragraph } = Typography;

const RiskAssessmentComparison = (props) => {
  const { assessmentResults } = props;
  const assetsCountermeasures = [];
  const assetsNotCountermeasures = [];
  const assetCIA = [];
  const securityGoals = assessmentResults[0]?.deployment_scenario?.security_goals || [];
  const assets = assessmentResults[0]?.deployment_scenario?.assets || [];

  const riskData = [];
  const supplementData = [];
  const dataCountermeasures = [];

  const columnsSeruityGoals = [
    {
      title: 'Security goal name',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
    },
    {
      title: 'Asset',
      dataIndex: 'asset_id',
      key: 'asset_id',
      width: '20%',
      render: (asset_id) => assets?.find((asset) => asset.id === asset_id)?.name,
    },
  ];

  assessmentResults.forEach((assessmentResult) => {
    const { risk_level, likelihood, severity } = assessmentResult.result?.risk;
    const { name } = assessmentResult;
    const supplemntLikelihood = assessmentResult.result.suppliment_likelihood;
    const tmpCoun = assessmentResult?.result?.cia?.countermeasures?.map((as) => ({
      ...as,
      name,
      severity: toFixNumber(`${9 - (as.confidentiality + as.integrity + as.availability)}`),
    }));
    const tmpNotCoun = assessmentResult?.result?.cia?.not_countermeasures?.map((as) => ({
      ...as,
      name,
      severity: toFixNumber(9 - (as.confidentiality + as.integrity + as.availability)),
    }));

    assetsCountermeasures[name] = tmpCoun;
    assetsNotCountermeasures[name] = tmpNotCoun;

    assetCIA.push(
      ...tmpCoun.map((asset) => ({
        assetName: assets.find((as) => as.id === asset.id)?.name,
        countermeasure: 'With countermeasure',
        ...asset,
      })),
      ...tmpNotCoun.map((asset) => ({
        assetName: assets.find((as) => as.id === asset.id)?.name,
        countermeasure: 'Without all countermeasure',
        ...asset,
      })),
    );

    columnsSeruityGoals.push({
      title: name,
      children: [
        {
          title: 'With countermeasures',
          dataIndex: name + 'i_r',
          key: 'i_r',
          align: 'center',
          render: (_, record) => {
            let asset = assetsCountermeasures[name].find((as) => as.id === record.asset_id);
            const flag =
              asset.confidentiality >= convertImpactToNumber(record.confidentiality) - 1 &&
              asset.integrity >= convertImpactToNumber(record.integrity) - 1 &&
              asset.availability >= convertImpactToNumber(record.availability) - 1;
            return flag ? (
              <CheckOutlined style={{ color: 'green', fontSize: '150%' }} />
            ) : (
              <CloseOutlined style={{ color: 'red', fontSize: '150%' }} />
            );
          },
        },
        {
          title: 'Without all countermeasures',
          dataIndex: 'n_r',
          key: 'n_r',
          align: 'center',
          render: (_, record) => {
            let asset = assetsNotCountermeasures[name].find((as) => as.id === record.asset_id);
            const flag =
              asset.confidentiality >= convertImpactToNumber(record.confidentiality) - 1 &&
              asset.integrity >= convertImpactToNumber(record.integrity) - 1 &&
              asset.availability >= convertImpactToNumber(record.availability) - 1;
            return flag ? (
              <CheckOutlined style={{ color: 'green', fontSize: '150%' }} />
            ) : (
              <CloseOutlined style={{ color: 'red', fontSize: '150%' }} />
            );
          },
        },
      ],
    });

    riskData.push({
      name,
      'risk level': toFixNumber(risk_level?.not_countermeasures[1]),
      likelihood: toFixNumber(likelihood?.not_countermeasures[1]),
      severity: toFixNumber(severity?.not_countermeasures[1]),
      countermeasure: 'without all countermeasures',
    });
    riskData.push({
      name,
      'risk level': toFixNumber(risk_level?.countermeasures[1]),
      likelihood: toFixNumber(likelihood?.countermeasures[1]),
      severity: toFixNumber(severity?.countermeasures[1]),
      countermeasure: 'with countermeasures',
    });
    supplementData.push({
      name,
      supplement: 'Attacker Capability',
      percentage: parseFloat((supplemntLikelihood.attacker_capability * 100).toFixed(2)),
    });
    supplementData.push({
      name,
      supplement: 'Effectiveness of Defender',
      percentage: parseFloat((supplemntLikelihood.effectiveness_defender * 100).toFixed(2)),
    });

    const tmpDataCo = [];
    assessmentResult.result?.countermeasures?.map((item) => {
      if (item.type === NODE_DECISION) {
        tmpDataCo.push({
          ...item,
          assessmentResult: name,
          value: item.outcomes.True,
        });
      }
      return item;
    });
    dataCountermeasures.push(
      ...tmpDataCo.map((counter) => ({
        'Assessment Result': counter.assessmentResult,
        Value: counter.value,
        Name: `${counter.name} - (${counter.assessmentResult})`,
        Cost: counter.cost,
      })),
    );
  });

  const configRisk = {
    data: riskData,
    isGroup: true,
    xField: 'name',
    height: 300,
    seriesField: 'countermeasure',
    // dodgePadding: 2,
    // intervalPadding: 20,

    maxColumnWidth: 50,
    label: {
      position: 'middle',
    },

    state: {
      active: {
        style: {
          shadowBlur: 4,
          stroke: '#000',
          fill: 'red',
        },
      },
    },
    interactions: [
      {
        type: 'marker-active',
      },
    ],
  };

  const configRiskChart = {
    ...configRisk,
    yField: 'risk level',
    yAxis: {
      label: {
        formatter: (v) => riskLevelNumberToType(parseInt(v)),
        offset: 1,
      },
      min: 0,
      max: 5,
    },
    tooltip: {
      formatter: (data) => {
        return { name: data.countermeasure, value: riskLevelNumberToType(data['risk level']) };
      },
    },
  };

  const configLikelihoodChart = {
    ...configRisk,
    yField: 'likelihood',
    yAxis: {
      label: {
        formatter: (v) => riskLikelihoodNumberToType(parseInt(v)),
        offset: 1,
      },
      min: 0,
      max: 6,
    },
    tooltip: {
      formatter: (data) => {
        return { name: data.countermeasure, value: riskLikelihoodNumberToType(data['likelihood']) };
      },
    },
  };

  const configSeverityChart = {
    ...configRisk,
    yField: 'severity',
    yAxis: {
      label: {
        formatter: (v) => riskSeverityNumberToType(parseInt(v)),
        offset: 1,
      },
      min: 0,
      max: 6,
    },
    tooltip: {
      formatter: (data) => {
        return { name: data.countermeasure, value: riskSeverityNumberToType(data['severity']) };
      },
    },
  };

  const configSupplement = {
    data: supplementData,
    isGroup: true,
    width: 200,
    xField: 'name',
    seriesField: 'supplement',
    xAxis: {
      position: 'bottom',
    },
    yAxis: {
      min: 0,
      max: 100,
    },
    interactions: [
      {
        type: 'active-region',
      },
    ],
    // color: ['red', 'yellow', 'green', 'blue', 'indigo', 'violet'],
    yField: ['percentage'],
    maxColumnWidth: 50,
    tooltip: {
      shared: true,
      showMarkers: false,
    },
  };

  const configAssetCIA = {
    data: assetCIA,
    xField: 'name',
    yField: 'severity',
    isGroup: true,
    isStack: true,
    seriesField: 'assetName',
    groupField: 'countermeasure',
    // color: ['red', 'yellow', 'green', 'blue', 'indigo', 'violet'],
    maxColumnWidth: 50,
    color: ['violet', 'indigo', 'blue', 'green', 'yellow', 'red'],
  };

  const configScatter = {
    data: dataCountermeasures,
    xField: 'Cost',
    yField: 'Value',
    colorField: 'Name',
    size: 5,
    shape: 'circle',
    tooltip: {
      fields: ['Name', 'Cost', 'Value'],
      showMarkers: false,
      showTitle: false,
    },
    pointStyle: {
      fillOpacity: 1,
    },
    yAxis: {
      nice: true,
      line: {
        style: {
          stroke: '#aaa',
        },
      },
      title: {
        text: 'Value',
        position: 'end',
      },
    },
    xAxis: {
      title: {
        text: 'Cost',
        position: 'end',
      },
    },
    legend: {
      layout: 'vertical',
      position: 'right',
      maxRow: 2,
      itemValue: {
        // formatter: (text, item) => {
        //   const items = data.filter((d) => d.type === item.value);
        //   return items.length ? items.reduce((a, b) => a + b.value, 0) / items.length : '-';
        // },
        style: {
          width: 10,
        },
      },
    },
  };
  // const configAttacker = {
  //   data: attackerData,
  //   xField: 'name',
  //   yField: 'percent',
  //   yAxis: {},
  //   max: 1,
  //   min: 0,
  //   maxAngle: 360,
  //   radius: 0.8,
  //   innerRadius: 0.2,
  //   tooltip: {
  //     formatter: (datum) => {
  //       return {
  //         name: 'star',
  //         value: datum.percent + ' %',
  //       };
  //     },
  //   },
  //   colorField: 'star',
  //   color: ({ star }) => {
  //     if (star > 10000) {
  //       return '#36c361';
  //     } else if (star > 1000) {
  //       return '#2194ff';
  //     }

  //     return '#ff4d4f';
  //   },
  // };

  return (
    <div style={{ overflowY: 'auto', overflowX: 'hidden', height: '100%' }}>
      <Row gutter={12}>
        <Col span={8} style={{ padding: '20px 60px' }}>
          <b>Risk level</b>
          <Column {...configRiskChart} />
        </Col>
        <Col span={8} style={{ padding: '20px 60px' }}>
          <b>Likelihood</b>
          <Column {...configLikelihoodChart} />
        </Col>
        <Col span={8} style={{ padding: '20px 60px' }}>
          <b>Severity</b>
          <Column {...configSeverityChart} />
        </Col>
      </Row>
      <Row gutter={12}>
        <Col span={12} style={{ padding: '20px 60px' }}>
          <Column {...configSupplement} />
          {/* <RadialBar {...configAttacker} /> */}
        </Col>
        <Col span={12} style={{ padding: '20px 60px' }}>
          <Column {...configAssetCIA} />
          {/* <RadialBar {...configAttacker} /> */}
        </Col>
      </Row>
      <Row style={{ marginBottom: '40px' }}>
        <Col span={24}>
          <ProTable
            columns={columnsSeruityGoals}
            dataSource={securityGoals}
            rowKey="id"
            search={false}
            toolBarRender={false}
            pagination={{ hideOnSinglePage: true }}
            bordered
            // bordered
          />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Scatter {...configScatter} />
        </Col>
      </Row>
    </div>
  );
};

export default RiskAssessmentComparison;
