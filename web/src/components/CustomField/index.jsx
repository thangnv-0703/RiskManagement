import ProForm from '@ant-design/pro-form';
import { EditableProTable } from '@ant-design/pro-table';

const CustomFields = ({columns}) => {

  return (
    <ProForm
      layout="vertical"
      hideRequiredMark
    >
      <ProForm.Item name="members">
        <EditableProTable
          recordCreatorProps={{
            record: () => {
              return {
                key: `0${Date.now()}`,
              };
            },
          }}
          columns={columns}
          rowKey="key"
        />
      </ProForm.Item>
    </ProForm>
  );
};

export default CustomFields;
