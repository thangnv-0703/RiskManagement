import styles from '../style.less';

const rankingListData = [];


for (let i = 0; i < 5; i += 1) {
  rankingListData.push({
    title: `CVE-2020-${Math.floor(Math.random() * 10000)}`,
    total: 10,
  });
}

const Rank = () => {

    return (
        <div className={styles.salesRank}>
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
                            {item.total}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Rank