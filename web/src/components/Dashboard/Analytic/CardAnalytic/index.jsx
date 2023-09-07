import React from 'react';
import { Avatar } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { history } from 'umi';

const Analytic = ({ destination, quantity, type, icon }) => {
  return (
    <div
      style={{
        backgroundColor: '#FFF',
        borderRadius: '5px',
        flexGrow: 1,
        alignSelf: 'stretch',
        cursor: 'pointer',
      }}
      onClick={() => history.replace(destination)}
    >
      <div
        style={{
          padding: '24px 32px',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontWeight: '400',
              fontSize: '14px',
              color: '#8c8c8c',
              lineHeight: '24px',
              minHeight: '64px',
            }}
          >
            {`Total ${type}${quantity > 1 ? 's' : ''}`}
          </span>
          <span style={{ fontWeight: '700', fontSize: '40px', color: '#000', display: 'inline' }}>
            {quantity}
          </span>
        </div>
        <Avatar style={{ backgroundColor: '#1890ff' }} icon={icon} size={50} />
      </div>
      <div
        style={{
          borderRadius: '0px 0px 5px 5px',
          backgroundColor: '#ABD',
          padding: '3px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontWeight: '400',
            fontSize: '16px',
            color: '#8c8c8c',
            marginRight: '6px',
          }}
        >
          View All
        </span>
        <RightOutlined style={{ fill: 'black' }} />
      </div>
    </div>
  );
};

export default Analytic;
