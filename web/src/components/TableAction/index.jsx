import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons"
import { Tooltip } from "antd"



const IconAction = ({icon, title, onClick}) => {
    return (
        <a
            onClick={onClick}
        >
            <Tooltip
                title={title}
            >
                {icon}
            </Tooltip>
        </a>
    )
}

export const DetailIconAction = ({title, onClick}) => {
    return (
        <IconAction
            icon={<EyeOutlined />}
            title={title ? title : 'Detail'}
            onClick={onClick}
        />
    )
}

export const EditIconAction = ({title, onClick}) => {
    return (
        <IconAction
            icon={<EditOutlined />}
            title={title ? title : 'Edit'}
            onClick={onClick}
        />
    )
}

export const DeleteIconAction = ({title, onClick}) => {
    return (
        <IconAction
            icon={<DeleteOutlined />}
            title={title ? title : 'Delete'}
            onClick={onClick}
        />
    )
}

export default IconAction