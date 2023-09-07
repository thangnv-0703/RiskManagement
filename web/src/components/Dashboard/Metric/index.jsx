import { Card, Col, Row } from "antd";
import './index.less'

const Metric = ({ data }) => {
    return (
        <>
            <Row>
                <Col span={12}>
                    <Card bordered style={{ backgroundColor: '#FF4536' }} bodyStyle={{ padding: '8px' }}>
                        <div>
                            Critical
                        </div>
                        <div className="metric-value">
                            {data.critical || '-'}
                        </div>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card bordered style={{ backgroundColor: '#FEC44B' }} bodyStyle={{ padding: '8px' }}>
                        <div>
                            High
                        </div>
                        <div className="metric-value">
                            {data.high || '-'}
                        </div>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <Card bordered style={{ backgroundColor: '#FBE452' }} bodyStyle={{ padding: '8px' }}>
                        <div>
                            Medium
                        </div>
                        <div className="metric-value">
                            {data.medium || '-'}
                        </div>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card bordered style={{ backgroundColor: '#93D150' }} bodyStyle={{ padding: '8px' }}>
                        <div>
                            Low
                        </div>
                        <div className="metric-value">
                            {data.low || '-'}
                        </div>
                    </Card>
                </Col>
            </Row>
        </>
    )
}
export default Metric;