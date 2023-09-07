import { riskLevelToColor } from "@/shared/common";
import { CRITICAL_COLOR, HIGH_COLOR, LOW_COLOR, MEDIUM_COLOR } from "@/shared/constant";
import { Pie, measureTextWidth } from "@ant-design/charts";
import { Card } from "antd";

const RiskRatingBreakdownPie = ({ }) => {
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

    const data = [
        {
            type: 'Low',
            value: 20,
            number: 6,
            color: LOW_COLOR,
        },
        {
            type: 'Medium',
            value: 25,
            number: 5,
            color: MEDIUM_COLOR,
        },
        {
            type: 'High',
            value: 25,
            number: 4,
            color: HIGH_COLOR,
        },
        {
            type: 'Critical',
            value: 30,
            number: 3,
            color: CRITICAL_COLOR,
        },
    ];

    const config = {
        // appendPadding: 10,
        data,
        angleField: 'value',
        colorField: 'type',
        color: ({ type }) => {
            return riskLevelToColor(type)
        },
        radius: 0.8,
        innerRadius: 0.6,
        legend: {
            layout: 'horizontal',
            position: 'bottom',
        },
        label: {
            type: 'outer',
            content: '{name} {percentage}',
        },
        statistic: {
            title: {
                offsetY: -4,
                customHtml: (container, _, datum) => {
                    const { width, height } = container.getBoundingClientRect();
                    const d = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
                    const text = datum ? datum.type : 'Total';
                    return renderStatistic(d, text, {
                        fontSize: 28,
                    });
                },
            },
            content: {
                offsetY: 4,
                style: {
                    fontSize: '32px',
                },
                customHtml: (container, _, datum, data) => {
                    const { width } = container.getBoundingClientRect();
                    const text = datum ? `${datum.number}` : `${data.reduce((r, d) => r + d.number, 0)}`;
                    return renderStatistic(width, text, {
                        fontSize: 32,
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
    };


    return (
        <Card
            title={
                <span>Risk Rating Breakdown</span>
            }
        // hoverable
        >

            <Pie {...config} />
        </Card>
    )
}

export default RiskRatingBreakdownPie