import React, { useContext, useEffect, useState } from 'react'
import DcBook from './DcBook'
import { Link, useLocation } from 'react-router-dom'
import contextCreator from 'src/pages/context/contextCreator'

const DcCmoponent = () => {
  // اسٹیٹ کی فنکشنز اور متغیرات
  const context = useContext(contextCreator)
  const { getEntries, dc } = context

  // لوکیشن نیویگیٹر
  const location = useLocation()

  // اسٹیٹز
  const [wait, setWait] = useState('')
  const [loading, setLoading] = useState('')

  // پورٹ فولیو لوڈ کریں
  useEffect(() => {
    async function fetchEntries() {
      // آپ یہاں انتظار کرسکتے ہیں
      setLoading('انٹریز لوڈ ہو رہی ہیں...')
      await getEntries(location.state.name)
      console.log(dc)
      // ...
      setLoading('')
    }
    fetchEntries()
  }, []) // یا [] اگر اثر کو پراپس یا اسٹیٹ کی ضرورت نہیں ہے

  // نمونہ ڈیٹا
  const data = dc

  const entriesPerPage = 5

  return (
    <>
      <div className="mx-2 mt-2">
        <h1>
          <Link className="btn btn-primary" to="/accountbook">
            واپس
          </Link>
        </h1>
        <center>
          <h1>{location.state.name} اکاؤنٹ</h1>
          <p>{loading}</p>
        </center>
        <DcBook data={data} entriesPerPage={entriesPerPage} />
      </div>
    </>
  )
}

export default DcCmoponent
