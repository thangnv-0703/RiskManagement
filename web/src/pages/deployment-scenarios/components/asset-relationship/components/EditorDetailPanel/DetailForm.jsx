import { Card, Form, Input, Select } from 'antd';
import { withPropsAPI } from 'gg-editor';
import React from 'react';
import { Typography } from 'antd';
const { Paragraph} = Typography;

const upperFirst = (str) => str.toLowerCase().replace(/( |^)[a-z]/g, (l) => l.toUpperCase());

const { Item } = Form;
const { Option } = Select;
const inlineFormItemLayout = {
  labelCol: {
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    sm: {
      span: 16,
    },
  },
};

class DetailForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      assets: '',
      description: '',
    }
  }

  get item() {
    const { propsAPI } = this.props;
    return propsAPI.getSelected()[0];
  }

  getAssets = (value) => {
    const result = this.props.cves.filter((item) => item.cve_id == value)
    return result.length !== 0 ? result[0].assets : ''
  }
  getDescription = (value) => {
    const result = this.props.cves.filter((item) => item.cve_id == value)
    return result.length !== 0 ? result[0].description : ''
  }
  // saveModel = () => {
  //   const {save} = this.props.propsAPI
  //   localStorage.setItem('dataGraph', JSON.stringify(save()));
  // }
  handleFieldChange = (values) => {
    const { propsAPI} = this.props;
    const { getSelected, executeCommand, update} = propsAPI;
    setTimeout(() => {
      const item = getSelected()[0];

      if (!item) {
        return;
      }

      executeCommand(() => {
        // console.log(item, values);
        update(item, { ...values });
      });

    }, 0);
  };
  handleInputBlur = (type) => (e) => {
    e.preventDefault();
    this.handleFieldChange({
      [type]: e.currentTarget.value,
    });
  };
  handleInputChange = (value) => {
    this.handleFieldChange({
      'label': value
    })
    this.setState({
      assets: this.getAssets(value),
      description: this.getDescription(value),
    })
    this.handleFieldChange(value)
  }

  componentDidMount = () => {
    const { label } = this.item ? this.item.getModel() : ''
    this.setState({
      assets: this.getAssets(label),
      description: this.getDescription(label),
    })
  }

  // compo

  // componentWillUnmount = () => {
  //   console.log('model',this.props.propsAPI.save())
  // }

  renderNodeDetail = () => {
    const { label } = this.item.getModel();
    return (
      <Form
        initialValues={{
          label,
        }}
        layout="vertical"
      >
        <Item label={<b>Label</b>} name="label" >
          <Select
            showSearch
            placeholder="CVE"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            // onBlur={this.handleInputBlur('label')}
            // defaultValue={label}
            onChange={this.handleInputChange}
            name="label"
          >
            {this.props.cves.map((cve) => <Option title={cve.description} key={cve.id} value={cve.cve_id} >{cve.cve_id}</Option>)}
          </Select>
        </Item>
        <Item label={<b>Asset</b>}>
          {this.state.assets}
        </Item>
        <Item label={<b>Description</b>}>
          <Paragraph
            ellipsis={{tooltip: this.state.description, rows: 5 }}
          >
            {this.state.description}
          </Paragraph>          
        </Item>
      </Form>
    );
  };
  renderEdgeDetail = () => {
    const { label = '', shape = 'flow-smooth' } = this.item.getModel();
    return (
      <Form
        initialValues={{
          label,
          shape,
        }}
      >
        <Item label="Label" name="label" {...inlineFormItemLayout}>
          <Input onBlur={this.handleInputBlur('label')} />
        </Item>
        <Item label="Shape" name="shape" {...inlineFormItemLayout}>
          <Select
            onChange={(value) =>
              this.handleFieldChange({
                shape: value,
              })
            }
          >
            <Option value="flow-smooth">Smooth</Option>
            <Option value="flow-polyline">Polyline</Option>
            <Option value="flow-polyline-round">Polyline Round</Option>
          </Select>
        </Item>
      </Form>
    );
  };
  renderGroupDetail = () => {
    const { label = '新建分组' } = this.item.getModel();
    return (
      <Form
        initialValues={{
          label,
        }}
      >
        <Item label="Label" name="label" {...inlineFormItemLayout}>
          <Input onBlur={this.handleInputBlur('label')} />
        </Item>
      </Form>
    );
  };

  render() {
    const { type } = this.props;

    if (!this.item) {
      return null;
    }
    if (upperFirst(type) === 'edge') {
      this.saveModel();
      return null;
    }
    return (
      <Card type="inner" size="small" title={upperFirst(type)} bordered={false}>
        {type === 'node' && this.renderNodeDetail()}
        {/* {type === 'edge' && this.renderEdgeDetail()}
        {type === 'group' && this.renderGroupDetail()} */}
      </Card>
    );
  }
}

export default withPropsAPI(DetailForm);
