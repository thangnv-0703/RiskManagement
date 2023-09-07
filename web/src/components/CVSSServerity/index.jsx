import { cvssToTypeAndColor } from "@/shared/common"
import { Tag } from "antd"


const CVSSSeverity = ({ cvss }) => {
    if (cvss) {
        const arr = cvssToTypeAndColor(cvss)
        return (
            <Tag
                color={arr[1]}
            >
                <b style={{ color: 'black' }}>
                    {`${cvss} ${arr[0]}`}
                </b>
            </Tag>
        )
    }
    return '(not available)'
}

export default CVSSSeverity