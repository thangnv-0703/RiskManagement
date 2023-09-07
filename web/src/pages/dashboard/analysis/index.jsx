import { Suspense, useEffect, useState } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import IntroduceRow from './components/IntroduceRow';
import PageLoading from '@/components/Dashboard/PageLoading';
import { getDashboardData } from './service';

import ProportionSales from './components/ProportionSales';

const Analysis = () => {
  const [dataDashboard, setDataDashboard] = useState({});
  const [loading, setLoadding] = useState(true);
  const [cves, setCves] = useState({});
  const [deploymentScenario, setDeploymentScenario] = useState([]);
  const [assessmentResult, setAssessmentResult] = useState([]);

  const fetchData = async () => {
    setLoadding(true);
    const res = await getDashboardData();
    setDataDashboard(res);
    setDeploymentScenario(
      res.deployment_scenarios.data.map((item) => ({ id: item.id, name: item.name })),
    );

    const result = res.assessment_results.map((item) => ({
      name: item.name,
      riskLevel: isNaN(item.result?.risk?.risk_level?.not_countermeasures[1])
        ? 0
        : parseInt(item.result?.risk?.risk_level?.not_countermeasures[1]),
    }));

    setAssessmentResult(result);

    const cvesObject = {};
    res.deployment_scenarios.data.forEach((item) => {
      const cvesData = [];
      item.cves.forEach((assetCve) => {
        const cveOnAttackGraphCount = item.attack_graph?.nodes?.filter(
          (node) => node.asset_id === assetCve.asset_id && !node.is_asset & node.phase.includes(3),
        ).length;
        cvesData.push({
          asset_name: item.assets?.find((assetItem) => assetItem.id === assetCve.asset_id)?.name,
          value: assetCve.active?.length,
          type: 'total cve',
        });
        cvesData.push({
          asset_name: item.assets?.find((assetItem) => assetItem.id === assetCve.asset_id)?.name,
          type: 'critical cve',
          value: cveOnAttackGraphCount,
        });
      });
      cvesObject[item.id] = cvesData;
    });
    setLoadding(false);
    setCves(cvesObject);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <GridContent>
      <>
        <Suspense fallback={<PageLoading />}>
          <IntroduceRow loading={loading} visitData={dataDashboard} />
        </Suspense>

        <Suspense fallback={null}>
          <ProportionSales
            deploymentScenario={deploymentScenario}
            results={assessmentResult}
            loading={loading}
            data={cves}
          />
        </Suspense>
      </>
    </GridContent>
  );
};

export default Analysis;
