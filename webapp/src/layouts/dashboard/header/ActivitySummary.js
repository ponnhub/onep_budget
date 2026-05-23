import { useContext, useState } from "react"
import { AppContext } from "../../../App"

export default function ActivitySummary() {


    const { cardTotal } = useContext(AppContext)


    return (<>{cardTotal}</>)
}