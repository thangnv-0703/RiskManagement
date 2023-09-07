import { useEffect } from "react"


const APIDocs = () => {

    useEffect(() => {
        window.open('/api/docs', '_blank')
    }, [])

    return ''
}
export default APIDocs