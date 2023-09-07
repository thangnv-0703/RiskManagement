import CVSSSeverity from "@/components/CVSSServerity"
import { PageContainer } from "@ant-design/pro-layout"
import { Card, Descriptions, Typography } from "antd"
import { useEffect, useState } from "react"
import { getCVE } from "./service"

const { Paragraph } = Typography

const CVEDetail = (props) => {
    const { id } = props?.match?.params
    const [cve, setCVE] = useState({})
    const [ellipsis, setEllipsis] = useState(true);

    const fetchData = async () => {
        const resData = await getCVE(id)
        if (resData) {
            setCVE(resData.data)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <PageContainer
            header={{
                title: "CVE Detail"
            }}
            content={
                <Descriptions column={1} style={{ marginBottom: -16 }}>
                    <Descriptions.Item label="CVE ID">
                        <a>
                            {id}
                        </a>
                    </Descriptions.Item>
                </Descriptions>
            }
        >
            <Card>
                <Descriptions title="CVE info" column={1}>
                    <Descriptions.Item label="CVE ID">{cve?.cve_id}</Descriptions.Item>
                    <Descriptions.Item label="CWE ID">
                        <a
                            onClick={() => {
                                window.open(`/data/cwe/${cve?.cwe_id}`, '_blank')
                            }}
                        >
                            {cve?.cwe_id}
                        </a>
                    </Descriptions.Item>
                    <Descriptions.Item label="Description">
                        <Paragraph
                            ellipsis={
                                ellipsis
                                    ? {
                                        rows: 3,
                                        expandable: true,
                                        symbol: 'more',
                                    }
                                    : false
                            }
                        >
                            {cve?.description}
                        </Paragraph>
                    </Descriptions.Item>
                    <Descriptions.Item label="CVSS V2">
                        {cve?.impact?.baseMetricV2?.cvssV2?.vectorString ? <><CVSSSeverity cvss={cve?.impact?.baseMetricV2?.exploitabilityScore} />{cve?.impact?.baseMetricV2?.cvssV2?.vectorString}</> : <i>(not available)</i>}
                    </Descriptions.Item>
                    <Descriptions.Item label="CVSS V3">
                        {cve?.impact?.baseMetricV3?.cvssV3?.vectorString ? <><CVSSSeverity cvss={cve?.impact?.baseMetricV3?.exploitabilityScore} />{cve?.impact?.baseMetricV3?.cvssV3?.vectorString?.replace('CVSS:3.1/', '')}</> : <i>(not available)</i>}
                    </Descriptions.Item>
                </Descriptions>
            </Card>
        </PageContainer>
    )
}

export default CVEDetail