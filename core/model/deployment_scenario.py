from enum import Enum
from typing import List, Optional
from pydantic import BaseModel,Field

class DeploymentScenarioStatus(Enum):
    REQUIREMENTS_ANALYSIS = 'Requirements Analysis'
    DEPLOYMENTS = 'Deployments'
    OPERATIONS = 'Operations'

class AccessVector(Enum):
    LOCAL = 'LOCAL'
    NETWORK = 'NETWORK'
    ADJACENT = 'ADJACENT_NETWORK'
    PHYSICAL = 'PHYSICAL'

class Privilege(Enum):
    NONE = 'NONE'
    OS_USER = 'OS_USER'
    OS_ADMIN = 'OS_ADMIN'
    APP_USER = 'APP_USER'
    APP_ADMIN = 'APP_ADMIN'

class ThreatType(Enum):
    SPOOFING_IDENTITY = 'Spoofing Identity'
    TAMPERING_WITH_DATA = 'Tampering With Data'
    REPUDIATION_THREATS = 'Repudiation Threats'
    INFORMATION_DISCLOSURE = 'Information Disclosure'
    DENIAL_OF_SERVICE = 'Denial of Service'
    ELEVATION_OF_PRIVILEGES = 'Elevation of Privileges'

class AssetType(Enum):
    APPLICATION = 'a'
    OPERATING_SYSTEM = 'o'
    HARDWARE = 'h'

class ExploitabilityCVSS(Enum):
    U = 'Unproven'
    POC = 'Proof-of-Concept'
    F = 'Functional'
    H = 'High'
    ND = 'Not Defined'

class RemediationLevelCVSS(Enum):
    OF = 'Official Fix'
    TF = 'Temporary Fix'
    W = 'Workaround'
    U = 'Unavailable'
    ND = 'Not Defined'

class ReportConfidenceCVSS(Enum):
    UC = 'Unconfirmed'
    UR = 'Uncorroborated'
    C = 'Confirmed'
    ND = 'Not Defined'

class SecurityGoal(BaseModel):
    id: int = Field(...)
    name: str = Field(...)
    description: str = Field(...)
    asset_id: str = Field(...)
    confidentiality: str = Field(...)
    availability: str = Field(...)
    integrity: str = Field(...)

class AssetRelationship(BaseModel):
    id: int = Field(...)
    source: str = Field(...)
    target: str = Field(...)
    access_vector: AccessVector = Field(...)
    privilege: Privilege = Field(...)

class AssetCpe(BaseModel):
    id: str = Field(...)
    name: str = Field(...)
    part: AssetType = Field(...)
    vendor: str = Field(...)
    product: str = Field(...)
    version: str = Field(...)
    cpe: Optional[str] = ''

class CVEOnAsset(BaseModel):
    cve_id: str = Field(...)
    cwe_id: str = Field(...)
    description: str = Field(...)
    impact: dict = Field(...)
    attack_vector: Optional[str] = Field(...)
    condition: dict = Field(...)

class AssetCve(BaseModel):
    asset_id: str = Field(...)
    cves: List[CVEOnAsset] = Field(...)

class AppliedCountermeasure(BaseModel):
    id: str = Field(...)
    name: str = Field(...)
    cost: float = Field(..., ge= 0)
    coverage: float = Field(..., ge= 0, le= 1)
    cover_cves: list = Field(...)

class AttackerTarget(BaseModel):
    asset_id: str = Field(...)
    attack_vector: str = Field(...)
    privilege: str = Field(...)


class Attacker(BaseModel):
    id: str = Field(...)
    targets: List[AttackerTarget] = Field(...)
    name: str = Field(...)
    description: str = Field(...)
    type: ThreatType = Field(...) 

class DeploymentScenario(BaseModel):
    id: str = Field(...)
    name: str = Field(...)
    description: str = Field(...)
    status: DeploymentScenarioStatus = Field(...)
    system_profile_id: Optional[str] = Field(...)
    security_goals: List[SecurityGoal] = Field(...)
    countermeasures: List[AppliedCountermeasure] = Field(...)
    assets: List[AssetCpe] = Field(...)
    asset_relationships: List[AssetRelationship] = Field(...)

    attackers: List[Attacker] = Field(...)
    cves: Optional[List[AssetCve]] = []
    attack_graph: Optional[dict] = {}
    base_impact: float = Field(...)
    base_benefit: float = Field(...)
    exploitability:  str = Field(...)
    remediation_level: str = Field(...)
    report_confidence: str = Field(...)

class StaticAssessment(BaseModel):
    damage_criterion: float = Field(...)
    benefit_criterion: float = Field(...)
    exploitability: ExploitabilityCVSS = Field(...)
    remediation_level: RemediationLevelCVSS = Field(...)
    report_confidence: ReportConfidenceCVSS = Field(...)
    