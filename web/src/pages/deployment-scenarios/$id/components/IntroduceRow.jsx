import { Row, Col, Card, Badge } from "antd"
import { Gauge, Column, Line, Pie, measureTextWidth } from '@ant-design/plots';
import { CRITICAL_COLOR, HIGH_COLOR, LOW_COLOR, MEDIUM_COLOR, SEVERITY_LIST, UNDER_LOW_COLOR, VULNERABILITY_LIST } from "@/shared/constant";
import { percentToColor, riskLevelNumberToType, severityTypeToColor, vulnerabilityLevelToColor } from "@/shared/common";
import { ChartCard } from "@/components/Dashboard/Charts";


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

const IntroduceRowDeploymentScenarioDetail = () => {
    const renderStatistic = (containerWidth, text, style) => {
        const { width: textWidth, height: textHeight } = measureTextWidth(text, style);
        const R = containerWidth / 2; // r^2 = (w / 2)^2 + (h - offsetY)^2

        let scale = 1;

        if (containerWidth < textWidth) {
            scale = Math.min(Math.sqrt(Math.abs(Math.pow(R, 2) / (Math.pow(textWidth / 2, 2) + Math.pow(textHeight, 2)))), 1);
        }

        const textStyleStr = `width:${containerWidth}px;`;
        return `<div style="${textStyleStr};font-size:${scale}em;line-height:${scale < 1 ? 1 : 'inherit'};">${text}</div>`;
    }

    const dataAsset = [
        {
            type: SEVERITY_LIST[0].type,
            value: 38,
        },
        {
            type: SEVERITY_LIST[1].type,
            value: 52,
        },
        {
            type: SEVERITY_LIST[2].type,
            value: 61,
        },
        {
            type: SEVERITY_LIST[3].type,
            value: 145,
        },
        {
            type: SEVERITY_LIST[4].type,
            value: 48,
        },
    ];
    const dataVulnerability = [
        {
            type: VULNERABILITY_LIST[0].type,
            value: 380,
        },
        {
            type: VULNERABILITY_LIST[1].type,
            value: 520,
        },
        {
            type: VULNERABILITY_LIST[2].type,
            value: 610,
        },
        {
            type: VULNERABILITY_LIST[3].type,
            value: 1450,
        },
        {
            type: VULNERABILITY_LIST[4].type,
            value: 480,
        },
    ];
    const dataCountermeasure = [
        {
            type: 'Positive',
            value: 8,
        },
        {
            type: 'Negative',
            value: 7,
        }
    ]
    // const dataRiskAssessment = [
    //     {
    //         "created_at": "2022-06-26T07:56:02.050+00:00",
    //         "value": 2,
    //         "category": "Countermeasures're implemented",
    //         type: 'Medium',
    //     },
    //     {
    //         "created_at": "2022-06-26T07:56:02.050+00:00",
    //         "value": 3,
    //         "category": "Countermeasures aren't implemented",
    //         type: 'High',
    //     },
    //     {
    //         "created_at": "2022-07-26T07:56:02.050+00:00",
    //         "value": 4,
    //         "category": "Countermeasures're implemented",
    //         type: 'Critical',
    //     },
    //     {
    //         "created_at": "2022-07-26T07:56:02.050+00:00",
    //         "value": 2,
    //         "category": "Countermeasures aren't implemented",
    //         type: 'Medium',
    //     },
    //     {
    //         "created_at": "2022-08-26T07:56:02.050+00:00",
    //         "value": 4,
    //         "category": "Countermeasures're implemented",
    //         type: 'Critical',
    //     },
    //     {
    //         "created_at": "2022-08-26T07:56:02.050+00:00",
    //         "value": 4,
    //         "category": "Countermeasures aren't implemented",
    //         type: 'Critical',
    //     },
    //     {
    //         "created_at": "2022-09-26T07:56:02.050+00:00",
    //         "value": 4,
    //         "category": "Countermeasures're implemented",
    //         type: 'Critical',
    //     },
    //     {
    //         "created_at": "2022-09-26T07:56:02.050+00:00",
    //         "value": 4,
    //         "category": "Countermeasures aren't implemented",
    //         type: 'Critical',
    //     },
    //     {
    //         "created_at": "2022-10-26T07:56:02.050+00:00",
    //         "value": 4,
    //         "category": "Countermeasures're implemented",
    //         type: 'Critical',
    //     },
    //     {
    //         "created_at": "2022-10-26T07:56:02.050+00:00",
    //         "value": 4,
    //         "category": "Countermeasures aren't implemented",
    //         type: 'Critical',
    //     },
    // ]
    const configGauge = {
        percent: 0.75,
        range: {
            ticks: [0, 0.25, 0.5, 0.75, 1],
            color: [LOW_COLOR, MEDIUM_COLOR, HIGH_COLOR, CRITICAL_COLOR],
        },
        indicator: {
            pointer: {
                style: {
                    stroke: '#D0D0D0',
                },
            },
            pin: {
                style: {
                    stroke: '#D0D0D0',
                },
            },
        },
        statistic: {
            title: {
                formatter: ({ percent }) => `${percent * 100}%`,
                style: {
                    fontSize: '24px',
                    lineHeight: 1,
                    color: '#4B535E',
                },
            },
            content: {
                offsetY: 24,
                style: ({ percent }) => {
                    return {
                        fontSize: '24px',
                        color: percentToColor(percent)[1],
                    };
                },
                formatter: ({ percent }) => percentToColor(percent)[0],
            },
        },
        height: 200,
    };
    const configAsset = {
        data: dataAsset,
        xField: 'type',
        yField: 'value',
        tooltip: {
            title: 'Number asset',
        },
        label: {
            position: 'middle',
            style: {
                fill: '#001529',
                opacity: 0.6,
            },
        },
        xAxis: {
            label: {
                autoHide: true,
                autoRotate: false,
            },
        },
        height: 150,
        color: ({ type }) => severityTypeToColor(type),
    };
    const configVulnerability = {
        data: dataVulnerability,
        xField: 'type',
        yField: 'value',
        label: {
            position: 'middle',
            style: {
                fill: '#001529',
                opacity: 0.6,
            },
        },
        tooltip: {
            title: 'Number vulnerability',
        },
        xAxis: {
            label: {
                autoHide: true,
                autoRotate: false,
            },
        },
        height: 150,
        color: ({ type }) => vulnerabilityLevelToColor(type),
    }
    // const configRiskAssessment = {
    //     data: dataRiskAssessment,
    //     xField: 'created_at',
    //     yField: 'value',
    //     seriesField: 'category',
    //     xAxis: {
    //         type: 'time',
    //     },
    //     tooltip: {
    //         formatter: (data) => {
    //             return {
    //                 name: data.category,
    //                 value: data.type,
    //             }
    //         }
    //     },
    //     yAxis: {
    //         label: {
    //             formatter: (v) => riskLevelNumberToType(parseInt(v)),
    //             offset: 1,
    //         },
    //         min: 0,
    //         max: 5,
    //     },
    //     legend: false,
    //     height: 200,
    // };
    const configCountermeasure = {
        data: dataCountermeasure,
        angleField: 'value',
        colorField: 'type',
        color: ({ type }) => {
            if (type === 'Positive'){
                return UNDER_LOW_COLOR
            }
            return CRITICAL_COLOR
        },
        radius: 0.8,
        innerRadius: 0.6,
        legend: {
            layout: 'horizontal',
            position: 'bottom',
        },
        label: {
            formatter: () => ''
        },
        statistic: {
            // title: {
            //     offsetY: 0,
            //     customHtml: (container, _, datum) => {
            //         const { width, height } = container.getBoundingClientRect();
            //         const d = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
            //         const text = datum ? datum.type : 'Total';
            //         return renderStatistic(d, text, {
            //             fontSize: 12,
            //         });
            //     },
            // },
            content: {
                offsetY: 4,
                style: {
                    fontSize: '22px',
                },
                customHtml: (container, _, datum, data) => {
                    const { width } = container.getBoundingClientRect();
                    const text = datum ? `${datum.value}` : `${data.reduce((r, d) => r + d.value, 0)}`;
                    return renderStatistic(width, text, {
                        fontSize: 12,
                    });
                },
            },
        },
        interactions: [
            {
                type: 'element-selected',
            },
            {
                type: 'element-active',
            },
            {
                type: 'pie-statistic-active',
            },
        ],
        height: 200,
    };

    return (
        <Row gutter={24}>
            <Col {...topColResponsiveProps}>
                <ChartCard
                    bordered={false}
                    title="Risk"
                    contentHeight={200}
                >
                    <Gauge {...configGauge} />
                </ChartCard>
            </Col>
            <Col {...topColResponsiveProps}>
                <ChartCard
                    bordered={false}
                    title="Asset"
                    contentHeight={158}
                    total={140}
                >
                    <Column {...configAsset} />
                </ChartCard>
            </Col>
            <Col {...topColResponsiveProps}>
                <ChartCard
                    bordered={false}
                    title="Countermeasure"
                    contentHeight={200}
                >
                    <Pie {...configCountermeasure}/>
                </ChartCard>
            </Col>
            <Col {...topColResponsiveProps}>
                <ChartCard
                    bordered={false}
                    title="Vulnerability"
                    contentHeight={150}
                    total={6560}
                >
                    <Column {...configVulnerability} />
                </ChartCard>
            </Col>
        </Row>
    )
};

export default IntroduceRowDeploymentScenarioDetail