import { Column } from '@ant-design/plots';

const ColumnChart = ({ items }) => {
  //   const data = [
  //     {
  //       type: '家具家电',
  //       sales: 38,
  //     },
  //     {
  //       type: '粮油副食',
  //       sales: 52,
  //     },
  //     {
  //       type: '生鲜水果',
  //       sales: 61,
  //     },
  //     {
  //       type: '美容洗护',
  //       sales: 145,
  //     },
  //     {
  //       type: '母婴用品',
  //       sales: 48,
  //     },
  //     {
  //       type: '进口食品',
  //       sales: 38,
  //     },
  //     {
  //       type: '食品饮料',
  //       sales: 38,
  //     },
  //     {
  //       type: '家庭清洁',
  //       sales: 38,
  //     },
  //   ];
  if (!items) items = [];
  const data = items?.map((item) => {
    return {
      type: item.name,
      licenses: item.licenses,
    };
  });
  const config = {
    data,
    xField: 'type',
    yField: 'licenses',
    label: {
      // 可手动配置 label 数据标签位置
      position: 'middle',
      // 'top', 'bottom', 'middle',
      // 配置样式
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    yAxis: {
      tickInterval: 1, // Adjust the tick interval here
    },
    meta: {
      type: {
        alias: '类别',
      },
      sales: {
        alias: '销售额',
      },
    },
    columnWidthRatio: 0.6, // Adjust the width by modifying this value
  };
  return <Column {...config} />;
};

export default ColumnChart;
