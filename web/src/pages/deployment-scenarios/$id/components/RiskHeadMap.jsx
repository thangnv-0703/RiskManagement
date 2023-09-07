
import { CRITICAL_COLOR, HIGH_COLOR, LOW_COLOR, MEDIUM_COLOR, RISK_MATRIX } from "@/shared/constant"
import { Heatmap } from "@ant-design/charts"
import { Card } from "antd"

const RiskHeatMap = () => {

    const dataHeatMap = RISK_MATRIX.map((cell) => ({
        ...cell,
        number: Math.floor(Math.random() * 20),
    }))


    const configHeadmap = {
        data: dataHeatMap,
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
            }
        },
        xAxis: {
            title: {
                text: 'Likelihood',
                position: 'center',
            }
        },
        label: {
            content: ({number}) => {
                return number ? number : '-'
            },
            style: {
                fontSize: 24,
                fontWeight: 500,
                textAlign: 'center',
                fill: 'black',
            },
        },
        color: (obj) => {
            const { value } = obj
            if (value <= 3)
                return LOW_COLOR
            if (value <= 7)
                return MEDIUM_COLOR
            if (value <= 12)
                return HIGH_COLOR
            return CRITICAL_COLOR
        }
    }
    return (
        <Card
            title="Risk Heat Map"
        >
            <Heatmap {...configHeadmap} />
        </Card>
    )

}

export default RiskHeatMap