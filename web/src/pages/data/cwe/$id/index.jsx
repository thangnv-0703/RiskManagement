import { PageContainer } from "@ant-design/pro-layout"
import { Card, Descriptions, Typography } from "antd"
import { useEffect, useState } from "react"
import { getCWE } from "./service"

const { Paragraph } = Typography

const CWEDetail = (props) => {
    const { id } = props?.match?.params
    const [cwe, setCWE] = useState({})
    const [ellipsis, setEllipsis] = useState(true);

    const fetchData = async () => {
        const resData = await getCWE(id)
        if (resData) {
            setCWE(resData.data)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <PageContainer
            header={{
                title: "CWE Detail"
            }}
            content={
                <Descriptions column={1} style={{ marginBottom: -16 }}>
                    <Descriptions.Item label="CWE ID">
                        <a>
                            {id}
                        </a>
                    </Descriptions.Item>
                </Descriptions>
            }
        >
            <Card>
                <Descriptions title="CWE info" column={1}>
                    <Descriptions.Item label="CWE ID">{cwe?.cwe_id}</Descriptions.Item>
                    <Descriptions.Item label="CWE Name">
                        {cwe?.cwe_name}
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
                            {cwe?.description}
                        </Paragraph>
                    </Descriptions.Item>
                </Descriptions>
            </Card>
        </PageContainer>
    )
}

export default CWEDetail