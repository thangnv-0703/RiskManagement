import { Card, Form, Select } from 'antd';
import { withPropsAPI } from 'gg-editor';
import React from 'react';
import { Typography } from 'antd';
const { Paragraph } = Typography;

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
      assetCpe: this.props.assets.find((asset) => asset.id === this.item?.getModel()?.asset_id),
      attacker: this.props.attackers.find(
        (attacker) => attacker.id === this.item?.getModel()?.attacker_id,
      ),
    };
  }

  get item() {
    const { propsAPI } = this.props;
    return propsAPI?.getSelected()[0];
  }

  getAssets = (asset_id) => {
    const result = this.props.assets.find((item) => item.id == asset_id);
    return result ? result.name : '';
  };

  getAssetPart = (part) => {
    let result = '';
    switch (part) {
      case 'o':
        result = 'Operating System';
        break;
      case 'a':
        result = 'Application';
        break;
      case 'h':
        result = 'Hardware';
        break;
    }
    return result;
  };

  getDescription = (asset_id, cve_id) => {
    const asset = this.props.cves.find((item) => item.asset_id == asset_id);
    const cve = asset?.cves?.find((cve) => cve.cve_id === cve_id);
    return cve ? cve.description : '';
  };
  // saveModel = () => {
  //   const {save} = this.props.propsAPI
  //   localStorage.setItem('dataGraph', JSON.stringify(save()));
  // }
  handleFieldChange = (values) => {
    const { propsAPI } = this.props;
    const { getSelected, executeCommand, update } = propsAPI;
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
  handleCveInputChange = (value) => {
    let tmp = value.split('_');
    const cve_id = tmp[1];
    const asset_id = tmp[0];
    this.handleFieldChange({
      label: cve_id,
      cve_id,
      asset_id,
    });
    this.setState({
      ...this.state,
      assets: this.getAssets(asset_id),
      description: this.getDescription(asset_id, cve_id),
    });
  };

  handleAttackerInputChange = (value) => {
    const attacker_id = value;
    this.handleFieldChange({
      label: this.props.attackers.find((attacker) => attacker.id === attacker_id)?.name,
      attacker_id,
    });
  };

  handleAssetInputChange = (value) => {
    const asset_id = value;
    const assetCpe = this.props.assets.find((asset) => asset.id === asset_id);
    this.handleFieldChange({
      label: this.props.assets.find((asset) => asset.id === asset_id)?.name,
      asset_id,
    });
    this.setState({
      ...this.state,
      assetCpe: assetCpe,
    });
  };

  componentDidMount = () => {
    const { label, is_attacker, cve_id, asset_id } = this.item ? this.item.getModel() : '';
    if (is_attacker) {
    } else {
      this.setState({
        ...this.state,
        assets: this.getAssets(asset_id),
        description: this.getDescription(asset_id, cve_id),
      });
    }
  };

  // compo

  // componentWillUnmount = () => {
  //   console.log('model',this.props.propsAPI.save())
  // }

  renderNodeDetail = () => {
    const { label, is_attacker, is_asset, cve_id, asset_id, attacker_id } = this.item.getModel();
    if (is_attacker) {
      return (
        <Form
          initialValues={{
            label: attacker_id ? attacker_id : 'Select threat',
          }}
          layout="vertical"
        >
          <Item label={<b>Threat</b>} name="label">
            <Select
              showSearch
              placeholder="CVE"
              optionFilterProp="children"
              onChange={this.handleAttackerInputChange}
              name="label"
            >
              {this.props.attackers.map((attacker) => (
                <Select.Option value={`${attacker.id}`} key={`${attacker.id}`}>
                  {attacker.name}
                </Select.Option>
              ))}
            </Select>
          </Item>
          <Item label={<b>Description</b>}>{this.state.attacker?.description}</Item>
        </Form>
      );
    }
    if (is_asset) {
      return (
        <Form
          initialValues={{
            label: asset_id ? asset_id : 'Select asset',
          }}
          layout="vertical"
        >
          <Item label={<b>Asset</b>} name="label">
            <Select
              showSearch
              placeholder="Asset"
              optionFilterProp="children"
              onChange={this.handleAssetInputChange}
              name="label"
            >
              {this.props.assets.map((asset) => (
                <Select.Option value={`${asset.id}`} key={`${asset.id}`}>
                  {asset.name}
                </Select.Option>
              ))}
            </Select>
          </Item>
          <Item label={<b>Part</b>}>{this.getAssetPart(this.state.assetCpe?.part)}</Item>
          <Item label={<b>Product</b>}>{this.state.assetCpe?.product}</Item>
          <Item label={<b>Vendor</b>}>{this.state.assetCpe?.vendor}</Item>
          <Item label={<b>Version</b>}>{this.state.assetCpe?.version}</Item>
        </Form>
      );
    }
    return (
      <Form
        initialValues={{
          label: asset_id ? `${asset_id}_${cve_id}` : 'Select CVE',
        }}
        layout="vertical"
      >
        <Item label={<b>CVE</b>} name="label">
          <Select
            showSearch
            placeholder="CVE"
            optionFilterProp="children"
            // filterOption={(input, option) =>
            //     option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            // }
            // onBlur={this.handleInputBlur('label')}
            // defaultValue={label}
            onChange={this.handleCveInputChange}
            name="label"
          >
            {this.props.cves.map((asset) => (
              <>
                <Select.OptGroup
                  label={`${this.getAssets(asset.asset_id)}`}
                  key={`${asset.asset_id}`}
                >
                  {asset.cves.map((cve) => (
                    <Select.Option
                      value={`${asset.asset_id}_${cve.cve_id}`}
                      key={`${asset.asset_id}_${cve.cve_id}`}
                    >
                      {cve.cve_id}
                    </Select.Option>
                  ))}
                </Select.OptGroup>
              </>
            ))}
          </Select>
        </Item>
        <Item label={<b>Asset</b>}>{this.state.assets}</Item>
        <Item label={<b>Description</b>}>
          <Paragraph ellipsis={{ tooltip: this.state.description, rows: 5 }}>
            {this.state.description}
          </Paragraph>
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
      </Card>
    );
  }
}

export default withPropsAPI(DetailForm);
