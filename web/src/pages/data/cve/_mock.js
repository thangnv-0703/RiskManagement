import { parse } from 'url';
import cwes from './cwes.json'

function getCWE(req, res, u) {
  let realUrl = u;

  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }

  const { current = 1, pageSize = 10 } = req.query;
  const params = parse(realUrl, true).query;
  let dataSource = [...cwes];
  if (params.cwe_id) {
    dataSource = dataSource.filter((data) => data?.cwe_id?.includes(params.cwe_id || ''));
  }
  if (params.cwe_name) {
    dataSource = dataSource.filter((data) => data?.cwe_name?.includes(params.cwe_name || ''));
  }
  const total = dataSource.length
  const responseData = dataSource.slice((current - 1) * pageSize, current * pageSize)
  const result = {
    data: responseData,
    total: total,
    success: true,
    pageSize,
    current: parseInt(`${params.current}`, 10) || 1,
  };
  return res.json(result);
}

export default {
  'GET /api/cwes': getCWE,
};
