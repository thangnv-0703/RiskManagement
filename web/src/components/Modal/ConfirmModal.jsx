import { ModalForm } from "@ant-design/pro-form"


const ModalConfirm = ({title, visible, onVisibleChange, onOk}) => {
    return (
        <ModalForm
           title={title}
           width="400px"
           visible={visible}
           onVisibleChange={onVisibleChange}
           onFinish={onOk}
        >
            Are you sure ?
        </ModalForm>
    )
}

export default ModalConfirm