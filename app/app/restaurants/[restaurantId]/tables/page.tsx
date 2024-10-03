"use client"
import { fetchTables, regenerateQrCode, createTable } from "@/app/services/services"
import {useState, useEffect} from "react"
import type { Table } from "@/app/type/type"
import Navbar from "@/app/component/nav"

export default function TablesPage( {params}: {params: {restaurantId: string}} ){
 const {restaurantId} = params
 const [tables, setTables] = useState<Table[]>([])
 const [addTableForm, setAddTableForm] = useState(false)
 const [tableNumber, setTableNumber] = useState("")
 const tableArray = [{"table_number": tableNumber, "restaurant_id": restaurantId}]

async function handleAddTable() {
    createTable(tableArray)
    await loadQrCodes()
    setAddTableForm(false)
}
async function loadQrCodes() {
   const tables = await fetchTables(restaurantId)
   setTables(tables.data)
}
 useEffect(() => {
  loadQrCodes()
 }, [])

  return(
    <div>
      <Navbar />
      <h1>Tables Page</h1>
      <div className="flex flex-wrap gap-2">
        {tables.map((table) => (
          <div className="" key={table.id}>
            <div className=" mb-4 text-center">
              <img className="w-36 mx-auto" src={`data:image/png;base64, ${table.qr_code}`} alt="QR Code"/>
              <p>Table Number: {table.table_number}</p>
              <div className="flex gap-2">
                <button 
                  className="bg-blue-500 border border-blue-500 hover:bg-blue-700 text-white font-bold rounded" 
                  onClick={() => {
                    regenerateQrCode(table.id)
                    loadQrCodes()
                  }}
                > 
                  Regenerate QRcode
                </button>
              </div>
            </div>
          </div> 
        ))}
        <div className="flex flex-col pt-4 items-center gap-2">
          <button onClick={() => setAddTableForm(!addTableForm)} className="border-2 p-2 rounded-full hover:border-gray-300 hover:scale-105 transition duration-300 hover:bg-green-300 border-gray-300 flex flex-col items-center justify-center w-fit h-fit bg-green-100">
            <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          </button>
          <p className="text-center">Add more tables</p>
        </div>

        {addTableForm && (
          <div className="flex flex-col pt-4 items-center gap-2">
            <p className="text-center">Add tables</p>
            <input onChange={(e) => setTableNumber(e.target.value)} type="text" placeholder="Table number" className="border-2 p-2 rounded-full hover:border-gray-300 hover:scale-105 transition duration-300 hover:bg-green-300 border-gray-300"/> 
            <button onClick={()=> handleAddTable()}>Confirm</button>  
          </div>
        )}
      </div>  
    </div>
  )
}