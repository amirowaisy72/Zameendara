import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { FaBook, FaPencilAlt, FaTrash } from 'react-icons/fa' // react-icons کتابخانے سے آئیکنز کو شامل کریں
import moment, { months } from 'moment/moment'

const Book = ({ data, entriesPerPage }) => {
  const [currentPage, setCurrentPage] = useState(1)

  const displayData = () => {
    const startIndex = (currentPage - 1) * entriesPerPage
    const endIndex = startIndex + entriesPerPage
    return data.slice(startIndex, endIndex)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const totalPages = Math.ceil(data.length / entriesPerPage)
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  const getStatusColor = (status) => {
    let backgroundColor, textColor

    switch (status) {
      case 'Regular':
        backgroundColor = '#33B81B'
        textColor = 'white'
        break
      case 'High Risk':
        backgroundColor = '#D7D414'
        textColor = '#FFFFF1'
        break
      case 'Black List':
        backgroundColor = 'red'
        textColor = 'white'
        break
      default:
        backgroundColor = 'transparent'
        textColor = 'black'
        break
    }

    return {
      backgroundColor,
      color: textColor,
    }
  }

  const isDeleteAllowed = (date) => {
    const creationTime = moment(date)
    const currentTime = moment()
    const hoursSinceCreation = currentTime.diff(creationTime, 'hours')
    console.log('Hours Since Creation:', hoursSinceCreation)
    return hoursSinceCreation <= 3
  }

  // Function to decode the token
  const getRole = () => {
    try {
      const token = localStorage.getItem('token')
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.role
    } catch (error) {
      return ''
    }
  }

  return (
    <div>
      <div className="table-responsive">
        <table className="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th>نام</th>
              <th>موبائل نمبر</th>
              <th>شناختی کارڈ نمبر</th>
              <th>پتہ</th>
              <th>ضامن</th>
              <th>اکاؤنٹ کی حالت</th>
              <th>کارروائیاں</th> {/* کارروائیوں کے لئے ایک ایکسٹرا کالم */}
            </tr>
          </thead>
          <tbody>
            {displayData().map((item) => (
              <tr key={item._id}>
                <td style={getStatusColor(item.status)}>{item.name}</td>

                <td>
                  {item.mobileNumbers.map((number, index) => (
                    <div key={index}>{number}</div>
                  ))}
                </td>
                <td>{item.idCardNumber}</td>
                <td>{item.address}</td>
                <td>{item.guarranter}</td>
                <td>{item.accountType}</td>
                <td>
                  <Link
                    className="btn btn-success mr-2"
                    to="/accountledger"
                    state={{ name: item.name }}
                  >
                    <FaBook /> {/* کتاب کے لئے آئکن */}
                  </Link>
                  {getRole() === 'Admin' && (
                    <Link
                      to="/updateAccount"
                      state={{
                        id: item._id,
                        name: item.name,
                        mobile: item.mobileNumbers,
                        address: item.address,
                        guarranter: item.guarranter,
                        idCard: item.idCardNumber,
                        status: item.status,
                        accountType: item.accountType,
                      }}
                      className="btn btn-warning mr-2"
                    >
                      <FaPencilAlt /> {/* ترتیب کے لئے آئکن */}
                    </Link>
                  )}
                  {isDeleteAllowed(item.date) && getRole() === 'Admin' && (
                    <Link
                      state={{
                        id: item._id,
                        name: item.name,
                      }}
                      className="btn btn-danger"
                      to="/deleteAccount"
                    >
                      <FaTrash /> {/* حذف کے لئے آئکن */}
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <nav aria-label="صفحہ کی نیویگیشن">
        <ul className="pagination justify-content-center">
          {pages.map((page) => (
            <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(page)}>
                {page}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

Book.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      mobile: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      guarranter: PropTypes.string.isRequired,
    }),
  ).isRequired,
  entriesPerPage: PropTypes.number.isRequired,
}

export default Book
