import { CRITICAL_COLOR, HIGH_COLOR, LIKELIHOOD_LIST, LOW_COLOR, MEDIUM_COLOR, RISK_LEVEL_LIST, SEVERITY_LIST, UNDER_LOW_COLOR } from "./constant"

export const mappingAssetType = (type) => {
    switch (type) {
        case 'OS':
            return 'o'
        case 'APPLICATION':
            return 'a'
        case 'HARDWARE':
            return 'h'
        default:
            return undefined
    }
}

export const convertAssetType = (type) => {
    switch (type) {
        case 'o':
            return 'OS'
        case 'a':
            return 'APPLICATION'
        case 'h':
            return 'HARDWARE'
        default:
            return undefined
    }
}

export const convertImpactToNumber = (type) => {
    switch (type) {
        case 'HIGH':
            return 3
        case 'MEDIUM':
            return 2
        case 'LOW':
            return 1
        default:
            return undefined
    }
}

export const convertDatetimeISO = (datetime) => {
    return datetime.substring(0, 10);
}

export const toTitleCase = (str) => {
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

export const cvssToTypeAndColor = (cvss) => {
    if (cvss >= 9)
        return ['Critical', CRITICAL_COLOR]
    if (cvss >= 7)
        return ['High', HIGH_COLOR]
    if (cvss >= 4)
        return ['Medium', MEDIUM_COLOR]
    return ['Low', LOW_COLOR]
}

export const riskLevelToColor = (rl) => {
    if (rl === 'Critical')
        return CRITICAL_COLOR
    if (rl === 'High')
        return HIGH_COLOR
    if (rl === 'Medium')
        return MEDIUM_COLOR
    return LOW_COLOR
}

export const severityToType = (severity) => {
    if (severity <= 1.8)
        return ['Negligible', 1]
    if (severity <= 3.6)
        return ['Low', 2]
    if (severity <= 5.4)
        return ['Moderate', 3]
    if (severity <= 7.2)
        return ['Significant', 4]
    return ['Catastrophic', 5]
}

export const likelihoodToType = (likelihood) => {
    if (likelihood <= 0.2)
        return ['Improbable', 1]
    if (likelihood <= 0.4)
        return ['Remote', 2]
    if (likelihood <= 0.6)
        return ['Occsional', 3]
    if (likelihood <= 0.8)
        return ['Probale', 4]
    return ['Frequent', 5]
}

export const riskLevelToType = (severity, likelihood) => {
    const le = severity * likelihood
    if (le > 12)
        return ['Critical', CRITICAL_COLOR, 4]
    if (le > 7)
        return ['High', HIGH_COLOR, 3]
    if (le > 3)
        return ['Medium', MEDIUM_COLOR, 2]
    return ['Low', LOW_COLOR, 1]
}

export const riskLevelNumberToType = (riskLevel) => {
    if (riskLevel === 4)
        return 'Critical'
    if (riskLevel === 3)
        return 'High'
    if (riskLevel === 2)
        return 'Medium'
    if (riskLevel === 1)
        return 'Low'
    return ''
}

export const riskSeverityNumberToType = (severity) => {
    if (severity === 5)
        return 'Catastrophic'
    if (severity === 4)
        return 'Significant'
    if (severity === 3)
        return 'Moderate'
    if (severity === 2)
        return 'Low'
    if (severity === 1)
        return 'Negligible'
    return ''
}

export const riskLikelihoodNumberToType = (likelihood) => {
    if (likelihood === 5)
        return 'Frequent'
    if (likelihood === 4)
        return 'Probale'
    if (likelihood === 3)
        return 'Occsional'
    if (likelihood === 2)
        return 'Remote'
    if (likelihood === 1)
        return 'Improbable'
    return ''
}

export const toFixNumber = (num) => {
    return Math.round(num * 100) / 100
}

export const percentToColor = (percent) => {
    if (percent <= 0.25)
        return ['Low', LOW_COLOR]
    if (percent <= 0.5)
        return ['Medium', MEDIUM_COLOR]
    if (percent <= 0.75)
        return ['High', HIGH_COLOR]
    return ['Critical', CRITICAL_COLOR]
}

export const severityTypeToColor = (severity) => {
    if (severity === 'Negligible')
        return UNDER_LOW_COLOR
    if (severity === 'Low')
        return LOW_COLOR
    if (severity === 'Moderate')
        return MEDIUM_COLOR
    if (severity === 'Significant')
        return HIGH_COLOR
    return CRITICAL_COLOR
}

export const likelihoodTypeToColor = (severity) => {
    if (severity === 'Improbable')
        return UNDER_LOW_COLOR
    if (severity === 'Low')
        return LOW_COLOR
    if (severity === 'Occsional')
        return MEDIUM_COLOR
    if (severity === 'Significant')
        return HIGH_COLOR
    return CRITICAL_COLOR
}

export const vulnerabilityLevelToColor = (score) => {
    if (score === 'None')
        return UNDER_LOW_COLOR
    if (score === 'Low')
        return LOW_COLOR
    if (score === 'Medium')
        return MEDIUM_COLOR
    if (score === 'High')
        return HIGH_COLOR
    return CRITICAL_COLOR
}