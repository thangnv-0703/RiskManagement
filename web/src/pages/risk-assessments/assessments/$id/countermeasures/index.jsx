import { MAX_INT } from '@/shared/constant';
import { generatorID } from '@/shared/key';
import { Col, Form, Input, Row, Table, Typography } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { getCountermeasuresInDeploymentScenario } from '../service';
import './index.css';
const EditableContext = React.createContext(null);
// const { Option, OptGroup } = Select;
const { Paragraph } = Typography

const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({ ...record, ...values });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                    {
                        validator: (_, value) => {
                            if (!value) {
                                return Promise.reject()
                            }
                            if (isNaN(value)) {
                                return Promise.reject(`${title} has to be a number.`);
                            }
                            const num = parseFloat(value)
                            if (title === 'Coverage')
                                if (num > 1.0 || num < 0) {
                                    return Promise.reject(`${title} between 0 and 1.`);
                                }
                                else if (title === 'Cost')
                                    if (num < 0) {
                                        return Promise.reject(`${title} need to be greater than 0.`);
                                    }
                            return Promise.resolve()
                        },
                    }
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};

const CountermeasuresSetting = ({
    countermeasures, setCountermeasures,
    benefitCriterion, setBenefitCriterion,
    damageCriterion, setDamageCriterion,
    vuls,
    deployment_scenario_id,
}) => {

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            width: '40%',
        },
        {
            title: 'Cover vulnerability',
            dataIndex: 'cover_cves',
            render: (cves) => (
                <ul>
                    {
                        cves.map(cve => (
                            <li key={cve}>
                                {cve}
                            </li>
                        )) 
                    }
                </ul>
            )
        },
        {
            title: 'Cost',
            dataIndex: 'cost',
            width: '10%',
            // editable: true,
        },
        {
            title: 'Coverage',
            dataIndex: 'coverage',
            width: '10%',
            // editable: true,
        },
    ];

    useEffect(() => {
        const fetchData = async () => {
            const resData = await getCountermeasuresInDeploymentScenario(deployment_scenario_id, {
                pageSize: MAX_INT
            })
            setCountermeasures(resData.data)
        }
        fetchData()
    }, [])

    const handleSave = (row) => {
        const newData = [...countermeasures];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...{ ...row, coverage: parseFloat(row.coverage), cost: parseFloat(row.cost) } });
        setCountermeasures(newData)
    };

    return (
        <div>
            <Row className="countermeasures_setup">
                <Col span={3}>
                    <b>Base Impact</b>
                </Col>
                <Col span={6}>
                    <Input value={damageCriterion} onChange={e => setDamageCriterion(parseInt(e.target.value))} />
                </Col>
                <Col span={3} offset={1}>
                    <b>Base Benefit</b>
                </Col>
                <Col span={6}>
                    <Input value={benefitCriterion} onChange={e => setBenefitCriterion(parseInt(e.target.value))} />
                </Col>
            </Row>


            <Table
                rowKey="name"
                components={{
                    body: {
                        row: EditableRow,
                        cell: EditableCell,
                    },
                }}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={countermeasures}
                columns={columns.map((col) => {
                    if (!col.editable) {
                        return col;
                    }

                    return {
                        ...col,
                        onCell: (record) => ({
                            record,
                            editable: col.editable,
                            dataIndex: col.dataIndex,
                            title: col.title,
                            handleSave: handleSave,
                        }),
                    };
                })}
                pagination={false}
            />
        </div>
    );
}
export default CountermeasuresSetting