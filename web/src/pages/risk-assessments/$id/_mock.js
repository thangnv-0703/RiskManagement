import { parse } from 'url';

function attackGraphs(req, res, u) {
  const attackGraphs = {'nodes': [{'x': 39, 'y': 64, 'type': 'node', 'shape': 'flow-circle', 'color': '#FA8C16', 'id': '0', 'label': 'Attacker'}, {'x': 178, 'y': 64, 'type': 'node', 'shape': 'flow-capsule', 'color': '#722ED1', 'id': '1', 'label': 'CVE-2008-4050'}, {'x': 342, 'y': 109, 'type': 'node', 'shape': 'flow-capsule', 'color': '#722ED1', 'id': '2', 'label': 'CVE-2008-1447'}, {'x': 342, 'y': 19, 'type': 'node', 'shape': 'flow-capsule', 'color': '#722ED1', 'id': '3', 'label': 'CVE-2003-0693'}, {'x': 506, 'y': 199, 'type': 'node', 'shape': 'flow-capsule', 'color': '#722ED1', 'id': '4', 'label': 'CVE-2007-4752'}, {'x': 506, 'y': 109, 'type': 'node', 'shape': 'flow-capsule', 'color': '#722ED1', 'id': '5', 'label': 'CVE-2008-0166'}, {'x': 506, 'y': 19, 'type': 'node', 'shape': 'flow-capsule', 'color': '#722ED1', 'id': '7', 'label': 'CVE-2008-0015'}, {'x': 670, 'y': 199, 'type': 'node', 'shape': 'flow-capsule', 'color': '#722ED1', 'id': '8', 'label': 'CVE-2001-1030'}, {'x': 670, 'y': 109, 'type': 'node', 'shape': 'flow-capsule', 'color': '#722ED1', 'id': '6', 'label': 'CVE-2001-0439'}, {'x': 670, 'y': 19, 'type': 'node', 'shape': 'flow-capsule', 'color': '#722ED1', 'id': '9', 'label': 'CVE-2004-0840'}, {'x': 834, 'y': 109, 'type': 'node', 'shape': 'flow-capsule', 'color': '#722ED1', 'id': '10', 'label': 'CVE-2008-3060'}, {'x': 998, 'y': 154, 'type': 'node', 'shape': 'flow-capsule', 'color': '#722ED1', 'id': '12', 'label': 'CVE-2009-1535'}, {'x': 998, 'y': 64, 'type': 'node', 'shape': 'flow-capsule', 'color': '#722ED1', 'id': '11', 'label': 'CVE-2008-5416'}], 'edges': [{'source': '0', 'target': '1', 'id': 'n0_node1'}, {'source': '1', 'target': '2', 'id': 'node0_node1'}, {'source': '1', 'target': '3', 'id': 'node1_node2'}, {'source': '2', 'target': '4', 'id': 'node1_node3'}, {'source': '2', 'target': '5', 'id': 'node1_node4'}, {'source': '3', 'target': '7', 'id': 'node2_node5'}, {'source': '7', 'target': '9', 'id': 'node2_node6'}, {'source': '5', 'target': '6', 'id': 'node3_node7'}, {'source': '5', 'target': '8', 'id': 'node3_node8'}, {'source': '4', 'target': '8', 'id': 'node4_node9'}, {'source': '8', 'target': '10', 'id': 'nod_node5'}, {'source': '6', 'target': '10', 'id': 'no_node6'}, {'source': '9', 'target': '10', 'id': 'nod_node7'}, {'source': '10', 'target': '12', 'id': 'nodnode8'}, {'source': '10', 'target': '11', 'id': 'nod_node9'}]}
  const cves = [
    {
      id: 1,
      cve: 'CVE-2008-4050',
      description: 'MS SMV service Stack BOF',
      assets: 'Administrative server',
      exploitability: 0.9996,
    },
    { 
      id: 2, 
      cve: 'CVE-2008-1447', 
      description: 'DNS Cache Poisoning', 
      assets: 'DNS server',
      exploitability: 0.4957,
    },
    {
      id: 3,
      cve: 'CVE-2003-0693',
      description: 'Heap corruption in OpenSSH',
      assets: 'DNS server',
      exploitability: 0.9607,
    },
    {
      id: 4,
      cve: 'CVE-2007-4752',
      description: 'Improper cookies handler in OpenSSH',
      assets: 'Gateway server',
      exploitability: 0.4607,
    },
    {
      id: 5,
      cve: 'CVE-2008-0166',
      description: 'Open SSL uses predictable random',
      assets: 'Gateway server',
      exploitability: 0.66,
    },
    // { id: 6, cve: 'CA-1996-83', description: 'Remote login', assets: 'Gateway server' },
    {
      id: 7,
      cve: 'CVE-2001-0439',
      description: 'LICQ Buffer Overflow (BOF)',
      assets: 'Local desktops',
      exploitability: 0.4607,
    },
    {
      id: 8,
      cve: 'CVE-2008-0015',
      description: 'MS Video ActiveX Stack BOF',
      assets: 'Local desktops',
      exploitability: 1,
    },
    {
      id: 9,
      cve: 'CVE-2001-1030',
      description: 'Squid port scan vulnerability',
      assets: 'Local desktops',
      exploitability: 0.6189,
    },
    {
      id: 10,
      cve: 'CVE-2004-0840',
      description: 'Remote code execution in SMTP',
      assets: 'Mail server',
      exploitability: 1,
    },
    {
      id: 11,
      cve: 'CVE-2008-3060',
      description: 'Error message information leakage',
      assets: 'Mail server',
      exploitability: 0.1375,
    },
    { 
      id: 12, 
      cve: 'CVE-2008-5416', 
      description: 'SQL Injection', 
      assets: 'SQL server',
      exploitability: 1, 
    },
    {
      id: 13,
      cve: 'CVE-2009-1535',
      description: 'IIS vulnerability in WebDAV service',
      assets: 'Web server',
      exploitability: 1,
    },
  ];
  const result = {
    attack_graphs: attackGraphs,
    cves: cves,
  };
  return res.json(result);
}

function countermeasure(req, res, u){
  const countermeasures = [
    {id: 1, name: 'Filtering external traffics', cover_cves: ['CVE-2004-0840', 'CVE-2009-1535'], cost: 70, coverage: 0.62},
    {id: 2, name: 'Apply MS workaround', cover_cves: ['CVE-2008-0015'], cost: 14, coverage: 0.65},
    {id: 3, name: 'Disable WebDAV', cover_cves: ['CVE-2009-1535'], cost: 250, coverage: 0.44},
    {id: 4, name: 'Patch OpenSSH', cover_cves: ['CVE-2003-0693', 'CVE-2007-4752'], cost: 63, coverage: 0.75},
    {id: 5, name: 'Disable port scan', cover_cves: ['CVE-2001-1030'], cost: 11, coverage: 0.45},
    {id: 6, name: 'Add network IDS', cover_cves: ['CVE-2008-3060','CVE-2009-0568'], cost: 102, coverage: 0.38},
    {id: 7, name: 'Gateway firewall', cover_cves: ['CVE-2001-0439'], cost: 205, coverage: 0.33},
    {id: 8, name: 'Query restriction', cover_cves: ['CVE-2008-5416'], cost: 84, coverage: 0.28},
    {id: 9, name: 'Apply MS09-004 work around', cover_cves: ['CVE-2008-5416'], cost: 31, coverage: 0.43},
    {id: 13, name: 'Encryption', cover_cves: ['CVE-2008-1447'], cost: 34, coverage: 0.31},
    {id: 10, name: 'Limit access to DNS server', cover_cves: ['CVE-2008-1447'], cost: 53, coverage: 0.5},
    {id: 11, name: 'Digital signature', cover_cves: ['CVE-2008-3060'], cost: 33, coverage: 0.3},
    {id: 12, name: 'Use POP3', cover_cves: ['CVE-2008-3060'], cost: 153, coverage: 0.25},
  ]
  const result = {
    countermeasures: countermeasures,
  };
  return res.json(result);
}

function assessments(req, res, u, b){
  const body = (b && b.body) || req.body;
  console.log('Body', body);
  return res.json({ok: true});
}

export default {
  'GET /api/attack_graphs': attackGraphs,
  'GET /api/countermeasures': countermeasure,
  'POST /api/assessments': assessments,
};
