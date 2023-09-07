import { Card, Col, DatePicker, Row, Tabs } from 'antd';
import { Column } from '@ant-design/charts';
import numeral from 'numeral';
import styles from './style.less';
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const rankingListData = [];


for (let i = 0; i < 5; i += 1) {
  rankingListData.push({
    title: `CVE-2020-${Math.floor(Math.random() * 10000)}`,
    total: 10,
  });
}

const SystemProfileTopFive = ({
  rangePickerValue,
  salesData,
  isActive,
  handleRangePickerChange,
  loading,
  selectDate,
}) => (
  <Card
    // bordered={false}
    // bodyStyle={{
    //   padding: 0,
    // }}
  >
    <div className={styles.salesCard}>
        <Row>
          <Col span={12}>
          <div className={styles.salesRank}>
              <h4 className={styles.rankingTitle}>Vulnerabily rank</h4>
              <ul className={styles.rankingList}>
                {rankingListData.map((item, i) => (
                  <li key={item.title}>
                    <span className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}>
                      {i + 1}
                    </span>
                    <span className={styles.rankingItemTitle} title={item.title}>
                      {item.title}
                    </span>
                    <span className={styles.rankingItemValue}>
                      {numeral(item.total).format('0,0')}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.salesRank}>
              <h4 className={styles.rankingTitle}>Vulnerabily rank</h4>
              <ul className={styles.rankingList}>
                {rankingListData.map((item, i) => (
                  <li key={item.title}>
                    <span className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}>
                      {i + 1}
                    </span>
                    <span className={styles.rankingItemTitle} title={item.title}>
                      {item.title}
                    </span>
                    <span className={styles.rankingItemValue}>
                      {numeral(item.total).format('0,0')}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Col>
        </Row>        
    </div>
  </Card>
);

export default SystemProfileTopFive;
