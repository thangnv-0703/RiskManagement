import { cvssToTypeAndColor } from '@/shared/common';
import { EyeOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Drawer, Space, Tag, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import { cve } from './service';

const { Paragraph } = Typography;

const CVE = () => {
	const actionRef = useRef();

	const columns = [
		{
			title: 'CVE ID',
			dataIndex: 'cve_id',
			key: 'cve_id',
			width: '20%'
		},
		{
			title: 'Description',
			dataIndex: 'description',
			key: 'description',
			width: '60%',
			hideInForm: true,
			hideInSearch: true,
			render: (_) => (
				<Paragraph ellipsis={{ tooltip: _, rows: 3 }}>
					{_}
				</Paragraph>
			)
		},
		{
			title: 'CVSS Severity',
			dataIndex: 'impact',
			key: 'cvss',
			width: '20%',
			hideInForm: true,
			hideInSearch: true,
			render: (impact) => (
				<Space
					direction="vertical"
					size="middle"
				>
					<div>
						V3: <CVSSSeverity cvss={impact?.baseMetricV3?.cvssV3?.baseScore} />
					</div>
					<div>
						V2: <CVSSSeverity cvss={impact?.baseMetricV2?.cvssV2?.baseScore} />
					</div>
				</Space>
			)
		},
	]

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
	return (
		<PageContainer>
			<ProTable
				// headerTitle="查询表格"
				actionRef={actionRef}
				rowKey="cve_id"
				search={{
					labelWidth: 120,
				}}
				request={cve}
				columns={columns}
				pagination={{
					pageSize: 10,
				}}
				toolbar={{
					settings: []
				}}

			/>
		</PageContainer>
	);
};

export default CVE;
