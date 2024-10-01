"use client"
import { fetchTables, regenerateQrCode } from "@/app/services/services"
import {useState, useEffect} from "react"
import type { table } from "@/app/type/type"

export default function TablesPage(){
 const [tables, setTables] = useState<table[]>([])

 useEffect(() => {
  const loadTables = async () => {
    const tables = await fetchTables()
    setTables(tables.data)
  }  
  loadTables()
 },[regenerateQrCode])
 console.log(tables)

  return(
    <div>
      <h1>Tables Page</h1>
      <div className="flex flex-wrap gap-2">
        {tables.map((table) => (
          <div className="" key={table.id}>
            <div className=" mb-4 text-center">
              <img className="w-36 mx-auto" src={`data:image/png;base64, ${table.qr_code}`}/>
              <p>Table Number: {table.table_number}</p>
              <button className="bg-blue-500 border border-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => regenerateQrCode(table.id)}>Regenerate QRcode</button>
            </div>
          </div> 
        ))}
      </div>
    </div>

  )
}