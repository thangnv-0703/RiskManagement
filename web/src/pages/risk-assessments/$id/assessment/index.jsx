import {
  convertImpactToNumber,
  likelihoodToType,
  likelihoodTypeToColor,
  riskLevelToType,
  severityToType,
  severityTypeToColor,
  toFixNumber,
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
import { Scatter, Heatmap, RingProgress } from '@ant-design/charts';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { Collapse, Row, Col, Table } from 'antd';
import React, { useState } from 'react';
import { useEffect } from 'react';

const { Panel } = Collapse;

const ResultDetail = ({ riskAssessmentReport }) => {
  const [dataSystem, setDataSystem] = useState([
    {
      attribute: 'Severity',
      not_implemented: '',
      implemented: '',
    },
    {
      attribute: 'Likelihood',
      not_implemented: '',
      implemented: '',
    },
    {
      attribute: 'Risk level',
      not_implemented: '',
      implemented: '',
    },
  ]);
  const [supplimentLikelihood, setSupplimentLikelihood] = useState(null);
  const [dataCountermeasures, setDataCountermeasures] = useState([]);

  const [assetsCountermeasures, setAssetsCountermeasures] = useState([]);
  const [assetsNotCountermeasures, setAssetsNotCountermeasures] = useState([]);
  const [securityGoals, setSecurityGoals] = useState([]);
  const [attackers, setAttackers] = useState([]);

  useEffect(() => {
    handleClickButtonStartAssessment();
  }, []);

  const handleClickButtonStartAssessment = () => {
    const assessmentRes = {
      data: riskAssessmentReport?.result,
    };
    let tmpDataCo = [];
    assessmentRes?.data?.countermeasures?.map((item) => {
      if (item.type === NODE_DECISION) {
        tmpDataCo.push({
          ...item,
          value: item.outcomes.True,
        });
      }
      return item;
    });
    const tmpCoun = assessmentRes?.data?.cia?.countermeasures?.map((as) => ({
      ...as,
      severity: toFixNumber(`${9 - (as.confidentiality + as.integrity + as.availability)}`),
    }));
    const tmpNotCoun = assessmentRes?.data?.cia?.not_countermeasures?.map((as) => ({
      ...as,
      severity: toFixNumber(9 - (as.confidentiality + as.integrity + as.availability)),
    }));

    const s_n = assessmentRes.data.risk.severity.not_countermeasures;
    const s_i = assessmentRes.data.risk.severity.countermeasures;
    const l_n = assessmentRes.data.risk.likelihood.not_countermeasures;
    const l_i = assessmentRes.data.risk.likelihood.countermeasures;
    setAttackers(riskAssessmentReport?.deployment_scenario?.attackers);

    setDataSystem([
      {
        attribute: 'Severity',
        not_implemented: s_n[0],
        implemented: s_i[0],
      },
      {
        attribute: 'Likelihood',
        not_implemented: l_n[0],
        implemented: l_i[0],
      },
      {
        attribute: 'Risk level',
        not_implemented: riskLevelToType(s_n[1], l_n[1]),
        implemented: riskLevelToType(s_i[1], l_i[1]),
      },
    ]);
    if (assessmentRes.data.suppliment_likelihood) {
      setSupplimentLikelihood(assessmentRes.data.suppliment_likelihood);
    }
    setAssetsCountermeasures(tmpCoun);
    setAssetsNotCountermeasures(tmpNotCoun);
    setSecurityGoals(riskAssessmentReport?.deployment_scenario?.security_goals);
    // setDataVuls(tmpDataVuls)
    setDataCountermeasures(
      tmpDataCo.map((counter) => ({
        Value: counter.value,
        Name: counter.name,
        Cost: counter.cost,
      })),
    );
  };

  const configScatter = {
    data: dataCountermeasures,
    xField: 'Cost',
    yField: 'Value',
    colorField: 'Name',
    tooltip: {
      fields: ['Name', 'Cost', 'Value'],
      showMarkers: false,
      showTitle: false,
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
    },
  };

  const configHeadmap = {
    data: RISK_MATRIX,
    xField: 'Likelihood',
    yField: 'Severity',
    colorField: 'value',
    interactions: [{ type: 'element-active' }],
    tooltip: {
      fields: ['Risk level', 'Severity', 'Likelihood'],
      showMarkers: false,
      showTitle: false,
    },
    yAxis: {
      title: {
        text: 'Severity',
        position: 'center',
      },
    },
    xAxis: {
      title: {
        text: 'Likelihood',
        position: 'center',
      },
    },
    label: {
      style: {
        fontSize: 24,
        fontWeight: 500,
        textAlign: 'center',
        fill: 'black',
      },
    },
    color: (obj) => {
      const { value } = obj;
      if (value <= 3) return LOW_COLOR;
      if (value <= 7) return MEDIUM_COLOR;
      if (value <= 12) return HIGH_COLOR;
      return CRITICAL_COLOR;
    },
  };

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
      render: (asset_id) => assetsCountermeasures?.find((asset) => asset.id === asset_id)?.name,
    },
    {
      title: 'C - I - A',
      children: [
        {
          title: 'With countermeasures',
          children: [
            {
              title: 'C',
              dataIndex: 'i_c',
              key: 'i_c',
              align: 'center',
              render: (_, record) => {
                let asset = assetsCountermeasures.find((as) => as.id === record.asset_id);
                const flag =
                  asset.confidentiality >= convertImpactToNumber(record.confidentiality) - 1;
                return (
                  <b style={{ color: flag ? LOW_COLOR : CRITICAL_COLOR }}>
                    {record.confidentiality}
                  </b>
                );
              },
            },
            {
              title: 'I',
              dataIndex: 'i_i',
              key: 'i_i',
              align: 'center',
              render: (_, record) => {
                let asset = assetsCountermeasures.find((as) => as.id === record.asset_id);
                const flag = asset.integrity >= convertImpactToNumber(record.integrity) - 1;
                return (
                  <b style={{ color: flag ? LOW_COLOR : CRITICAL_COLOR }}>{record.integrity}</b>
                );
              },
            },
            {
              title: 'A',
              dataIndex: 'i_a',
              key: 'i_a',
              align: 'center',
              render: (_, record) => {
                let asset = assetsCountermeasures.find((as) => as.id === record.asset_id);
                const flag = asset.availability >= convertImpactToNumber(record.availability) - 1;
                return (
                  <b style={{ color: flag ? LOW_COLOR : CRITICAL_COLOR }}>{record.availability}</b>
                );
              },
            },
            {
              title: 'Result',
              dataIndex: 'i_r',
              key: 'i_r',
              align: 'center',
              render: (_, record) => {
                let asset = assetsCountermeasures.find((as) => as.id === record.asset_id);
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
        },
        {
          title: 'Without all countermeasures',
          children: [
            {
              title: 'C',
              dataIndex: 'n_c',
              key: 'n_c',
              align: 'center',
              render: (_, record) => {
                let asset = assetsNotCountermeasures.find((as) => as.id === record.asset_id);
                const flag =
                  asset.confidentiality >= convertImpactToNumber(record.confidentiality) - 1;
                return (
                  <b style={{ color: flag ? LOW_COLOR : CRITICAL_COLOR }}>
                    {record.confidentiality}
                  </b>
                );
              },
            },
            {
              title: 'I',
              dataIndex: 'n_i',
              key: 'n_i',
              align: 'center',
              render: (_, record) => {
                let asset = assetsNotCountermeasures.find((as) => as.id === record.asset_id);
                const flag = asset.integrity >= convertImpactToNumber(record.integrity) - 1;
                return (
                  <b style={{ color: flag ? LOW_COLOR : CRITICAL_COLOR }}>{record.integrity}</b>
                );
              },
            },
            {
              title: 'A',
              dataIndex: 'n_a',
              key: 'n_a',
              align: 'center',
              render: (_, record) => {
                let asset = assetsNotCountermeasures.find((as) => as.id === record.asset_id);
                const flag = asset.availability >= convertImpactToNumber(record.availability) - 1;
                return (
                  <b style={{ color: flag ? LOW_COLOR : CRITICAL_COLOR }}>{record.availability}</b>
                );
              },
            },
            {
              title: 'Result',
              dataIndex: 'n_r',
              key: 'n_r',
              align: 'center',
              render: (_, record) => {
                let asset = assetsNotCountermeasures.find((as) => as.id === record.asset_id);
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
        },
      ],
    },
  ];

  const columnAssets = [
    {
      title: 'Asset name',
      dataIndex: 'name',
      key: 'name',
      width: '60%',
    },
    {
      title: 'Severity',
      children: [
        {
          title: 'With countermeasures',
          key: 'implemented',
          dataIndex: 'implemented',
          align: 'center',
          width: '20%',
          render: (_, record) => assetsCountermeasures.find((as) => as.id === record.id)?.severity,
        },
        {
          title: 'Without all countermeasures',
          key: 'not_implemented',
          dataIndex: 'not_implemented',
          align: 'center',
          width: '20%',
          render: (_, record) =>
            assetsNotCountermeasures.find((as) => as.id === record.id)?.severity,
        },
      ],
    },
  ];

  const columnsAttacker = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: true,
      width: '20%',
    },
    {
      title: 'Type of threat',
      dataIndex: 'type',
      sorter: true,
      width: '20%',
    },
    {
      title: 'Target asset',
      tip: 'Asset name - Attack vector - Privilege',
      dataIndex: 'targets',
      key: 'targets',
      hideInForm: true,
      hideInSearch: true,
      width: '60%',
      render: (targets, record) => (
        <ul>
          {targets.map((target) => (
            <li key={target.asset_id}>
              {`${
                riskAssessmentReport.deployment_scenario?.assets?.find(
                  (as) => as.id === target.asset_id,
                )?.name
              } - ${target.attack_vector} - ${target.privilege}`}
            </li>
          ))}
        </ul>
      ),
    },
  ];

  const columnDefender = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: '40%',
    },
    {
      title: 'Cover vulnerability',
      dataIndex: 'cover_cves',
      render: (cves) => (
        <ul>
          {cves.map((cve) => (
            <li key={cve}>{cve}</li>
          ))}
        </ul>
      ),
    },
    {
      title: 'Cost',
      dataIndex: 'cost',
      width: '10%',
    },
    {
      title: 'Coverage',
      dataIndex: 'coverage',
      width: '10%',
    },
  ];

  const columnsAll = [
    {
      title: 'Attribute',
      dataIndex: 'attribute',
      key: 'attribute',
      width: '34%',
    },
    {
      title: 'With countermeasures',
      key: 'implemented',
      dataIndex: 'implemented',
      align: 'center',
      width: '33%',
      render: (_, record) => {
        if (record.attribute == 'Risk level') {
          return <b style={{ color: record.implemented[1] }}>{record.implemented[0]}</b>;
        }
        if (record.attribute == 'Severity') {
          return <b style={{ color: severityTypeToColor(_) }}>{_}</b>;
        }
        if (record.attribute == 'Likelihood') {
          return <b style={{ color: likelihoodTypeToColor(_) }}>{_}</b>;
        }
        return _;
      },
    },
    {
      title: 'Without all countermeasures',
      key: 'not_implemented',
      dataIndex: 'not_implemented',
      align: 'center',
      width: '33%',
      render: (_, record) => {
        if (record.attribute == 'Risk level') {
          return <b style={{ color: record.not_implemented[1] }}>{record.not_implemented[0]}</b>;
        }
        if (record.attribute == 'Severity') {
          return <b style={{ color: severityTypeToColor(_) }}>{_}</b>;
        }
        if (record.attribute == 'Likelihood') {
          return <b style={{ color: likelihoodTypeToColor(_) }}>{_}</b>;
        }
        return _;
      },
    },
  ];

  return (
    <>
      <Collapse defaultActiveKey={['1', '2', '3', '4']}>
        <Panel header={'Attacker profile - Defender profile'} key="0">
          <Row>
            <Col span={12} style={{ padding: '20px' }}>
              <h3>Attacker profile</h3>
              <ProTable
                columns={columnsAttacker}
                dataSource={attackers}
                rowKey="id"
                search={false}
                toolBarRender={false}
                pagination={{
                  pageSize: 7,
                  hideOnSinglePage: true,
                }}
                style={{
                  width: '100%',
                }}
                bordered
              />
            </Col>
            <Col span={12} style={{ padding: '20px' }}>
              <h3>Defender profile</h3>
              <ProTable
                columns={columnDefender}
                dataSource={riskAssessmentReport?.deployment_scenario?.countermeasures}
                rowKey="id"
                search={false}
                toolBarRender={false}
                pagination={{
                  pageSize: 7,
                  hideOnSinglePage: true,
                }}
                style={{
                  width: '100%',
                }}
                bordered
              />
            </Col>
          </Row>
        </Panel>
        <Panel header={'Risk level'} key="1">
          {/* <Space direction="vertical" size="middle"> */}
          <Row gutter={16}>
            <Col span={12}>
              <Row>
                <Col span={24}>
                  <h3>System profile</h3>
                  <Table
                    columns={columnsAll}
                    dataSource={dataSystem}
                    pagination={false}
                    rowKey="attribute"
                  />
                </Col>
              </Row>
              {supplimentLikelihood && (
                <Row style={{ marginTop: '24px' }}>
                  <Col span={12}>
                    <b
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '12px',
                      }}
                    >
                      Attacker capability
                    </b>
                    <RingProgress
                      forceFit
                      height={100}
                      width={100}
                      percent={supplimentLikelihood?.attacker_capability}
                    />
                  </Col>
                  <Col span={12}>
                    <b
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '12px',
                      }}
                    >
                      Effectiveness of defender
                    </b>
                    <RingProgress
                      forceFit
                      height={100}
                      width={100}
                      percent={supplimentLikelihood?.effectiveness_defender}
                      color={['#5B8FF9', '#E8EDF3']}
                    />
                  </Col>
                </Row>
              )}
            </Col>
            <Col span={12}>
              <Heatmap {...configHeadmap} />
            </Col>
          </Row>
          <Row>
            <h3>Assets</h3>
            <ProTable
              columns={columnAssets}
              dataSource={assetsCountermeasures}
              rowKey="id"
              search={false}
              toolBarRender={false}
              pagination={{
                pageSize: 7,
                hideOnSinglePage: true,
              }}
              style={{
                width: '100%',
              }}
              bordered
            />
          </Row>
          {/* </Space> */}
        </Panel>
        <Panel header={'Security goals'} key="2">
          <ProTable
            columns={columnsSeruityGoals}
            dataSource={securityGoals}
            rowKey="id"
            search={false}
            toolBarRender={false}
            bordered
            pagination={{
              hideOnSinglePage: true,
            }}
          />
        </Panel>
        <Panel header={'Countermeasures'} key="3">
          <Scatter {...configScatter} />
        </Panel>
      </Collapse>
    </>
  );
};

export default ResultDetail;
