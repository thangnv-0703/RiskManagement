import { Col, Input, Row, Table, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import './index.css';

const { Paragraph } = Typography

const CountermeasuresSettingDetail = ({riskAssessmentReport}) => {

    const [countermeasures, setCountermeasures] = useState([])

    const columns = [
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
                    {
                        cves.map(cve => (
                            <li key={cve}>
                                {cve}
                            </li>
                        )) 
                    }
                </ul>
            )
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

    useEffect(() => {
        setCountermeasures(riskAssessmentReport?.deployment_scenario?.countermeasures)
    }, [])

    return (
        <div>
            <Row className="countermeasures_setup">
                <Col span={3}>
                    <b>Base Impact</b>
                </Col>
                <Col span={6}>
                    <Input value={riskAssessmentReport?.deployment_scenario?.base_impact} disabled/>
                </Col>
                <Col span={3} offset={1}>
                    <b>Base Benefit</b>
                </Col>
                <Col span={6}>
                    <Input value={riskAssessmentReport?.deployment_scenario?.base_benefit} disabled />
                </Col>
            </Row>


            <Table
                rowKey="name"
                bordered
                dataSource={countermeasures}
                columns={columns}
                pagination={false}
            />
        </div>
    );
}
export default CountermeasuresSettingDetail