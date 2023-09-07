import { PlusOutlined } from "@ant-design/icons"
import { ModalForm, ProFormText } from "@ant-design/pro-form"
import { PageContainer } from "@ant-design/pro-layout"
import ProTable from "@ant-design/pro-table"
import { Button, Checkbox, message } from "antd"
import { useRef, useState } from "react"
import { createUser, getUsers, updateUser } from "./service"


const UserManagerment = () => {

    const [visibleModalAddUser, setVisibleModalAddUser] = useState(false)

    const tableRef = useRef()

    const columnsUsers = [
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: '40%',
        },
        {
            title: 'Active',
            dataIndex: 'active',
            key: 'active',
            align: 'center',
            hideInForm: true,
            hideInSearch: true,
            width: '10%',
            render: (active, record) => <Checkbox checked={active} onClick={async () => {
                const res = await updateUser(record.id)
                if (res) {
                    if (tableRef.current) {
                        message.success('Save done!')
                        tableRef.current.reload()
                    }
                }
            }} />
        },
        {
            title: 'Created at',
            dataIndex: 'created_at',
            key: 'created_at',
            width: '15%',
            valueType: 'date',
            hideInForm: true,
            hideInSearch: true,
        },
        {
            title: 'Updated at',
            dataIndex: 'updated_at',
            key: 'updated_at',
            width: '15%',
            valueType: 'date',
            hideInForm: true,
            hideInSearch: true,
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            align: 'center',
            width: '20%',
            hideInForm: true,
            hideInSearch: true,
        }
    ]

    const handleCreateUser = async (values) => {
        const res = await createUser(values)
        if (res) {
            if (tableRef.current) {
                message.success('Save done!')
                tableRef.current.reload()
            }
            return true
        }
        return false
    }

    return (
        <PageContainer>
            <ProTable
                request={getUsers}
                columns={columnsUsers}
                rowKey="email"
                actionRef={tableRef}
                toolbar={{
                    settings: []
                }}
                toolBarRender={() => [
                    <Button
                        type="primary"
                        key="primary"
                        onClick={() => {
                            setVisibleModalAddUser(true);
                        }}
                    >
                        <PlusOutlined /> Add
                    </Button>,
                ]}
            />
            <ModalForm
                title="Add user"
                width="600px"
                visible={visibleModalAddUser}
                onVisibleChange={setVisibleModalAddUser}
                modalProps={{
                    destroyOnClose: true
                }}
                onFinish={handleCreateUser}
                layout={"vertical"}
            >
                <ProFormText
                    label="Email"
                    rules={[
                        {
                            required: true,
                        },
                        {
                            type: 'email',
                        }
                    ]}
                    name="email"
                />
            </ModalForm>
        </PageContainer>
    )
}

export default UserManagerment