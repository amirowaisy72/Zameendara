import React, { useContext, useEffect, useState } from 'react'
import Book from './Book'
import { Link } from 'react-router-dom'
import contextCreator from 'src/pages/context/contextCreator'

const Accounts = () => {
  // اسٹیٹ کی فنکشنز اور متغیرات
  const context = useContext(contextCreator)
  const { getAccounts, accounts, searchAccountAll } = context

  // اسٹیٹز
  const [wait, setWait] = useState('')
  const [loading, setLoading] = useState('')

  // پورٹ فولیو لوڈ کریں
  useEffect(() => {
    try {
      async function fetchAccounts() {
        // یہاں آپ انتظار کرسکتے ہیں
        setLoading('اکاؤنٹس لوڈ ہو رہے ہیں')
        await getAccounts()
        // ...
        setLoading('')
      }
      fetchAccounts()
    } catch (error) {
      setLoading('Some other problem occured')
    }
  }, []) // یا [] اگر اثر کو پراپس یا اسٹیٹ کی ضرورت نہیں ہے

  // نمونہ ڈیٹا
  const data = accounts

  const entriesPerPage = 5

  const handleSearch = async (e) => {
    try {
      setLoading('تلاش کر رہا ہے...')
      await searchAccountAll(e.target.value)
      setWait('')
    } catch (error) {
      setLoading('Some other problem occured')
    }
  }

  return (
    <>
      <div className="mx-2 mt-2">
        <h1>
          <Link className="btn btn-primary" to="/#/dashboard">
            ہوم
          </Link>
        </h1>
        <center>
          <h1>اکاؤنٹس کتاب</h1>
          <p>{loading}</p>
          <input
            className="form-control mb-3"
            onKeyUp={handleSearch}
            type="text"
            placeholder="اکاؤنٹس تلاش کریں..."
          />
        </center>
        <Book data={data} entriesPerPage={entriesPerPage} />
      </div>
    </>
  )
}

export default Accounts
