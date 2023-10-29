import React, { useContext, useEffect, useState } from 'react'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import avatar8 from './../../assets/images/avatars/10.png'
import './style.css'
import contextCreator from 'src/pages/context/contextCreator'

const AppHeaderDropdown = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  const context = useContext(contextCreator)
  const { getAccountants, updateAccountant, deleteAccountant } = context
  const [wait, setWait] = useState('')

  // Function to close the pop-up
  const closePopup = () => {
    setIsPopupOpen(false)
  }

  // Function to decode the token
  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload
    } catch (error) {
      return ''
    }
  }

  const [adminAccountants, setAdminAccountants] = useState([])

  useEffect(() => {
    // Get the token from local storage
    const token = localStorage.getItem('token')

    // Decode the token to get the username
    if (token) {
      const decodedToken = decodeToken(token)
      setUsername(decodedToken.username)
      const adminRole = decodedToken.role

      if (adminRole === 'Admin') {
        const fetchAccountants = async () => {
          try {
            const response = await getAccountants()
            // Assuming the data returned from getAccountants is an array
            // Update the adminAccountants state with the fetched data
            setAdminAccountants(response)

            // Check if adminAccountants array's length is not zero
            if (response.length !== 0) {
              setIsPopupOpen(true)
            }
          } catch (error) {
            console.error('An error occurred while fetching other crops:', error)
          }
        }

        fetchAccountants()
      }
    }
  }, [])

  const handleLogout = () => {
    // Remove the token from localStorage (or any other storage you use)
    localStorage.removeItem('token')

    // Redirect to the login page
    navigate('/login') // Replace '/login' with the actual login route
  }

  const handleAllow = async (id) => {
    //First run fetch API to update
    setWait('اجازت دی جا رہی ہے')
    const response = await updateAccountant(id)
    if (response.success) {
      setWait('اجازت دے دی گئی')
      const updatedAccountants = adminAccountants.filter((accountant) => accountant._id !== id)
      setAdminAccountants(updatedAccountants)
    } else {
      // setWait('کچھ مسئلہ درپیش آگیا')
      setWait(response.error)
    }
  }

  const handleDecline = async (id) => {
    //First run fetch API to delete
    setWait('مسترد کیا جا رہا ہے')
    const response = await deleteAccountant(id)
    if (response.success) {
      console.log('success')
      setWait('کامیابی سے مسترد کر دیا گیا ہے')
      const updatedAccountants = adminAccountants.filter((accountant) => accountant._id !== id)
      setAdminAccountants(updatedAccountants)
    } else {
      console.log('problem')
      // setWait('کچھ مسئلہ درپیش آگیا')
      setWait(response.message)
    }
  }

  return (
    <div>
      <CDropdown variant="nav-item">
        <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
          <CAvatar src={avatar8} size="md" />
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end">
          <CDropdownHeader className="bg-light fw-semibold py-2">{username}</CDropdownHeader>
          <CDropdownItem to="/dashboard">
            <CIcon icon={cilBell} className="me-2" />
            تازہ ترین
            <CBadge color="info" className="ms-2">
              42
            </CBadge>
          </CDropdownItem>
          <CDropdownItem to="/dashboard">
            <CIcon icon={cilEnvelopeOpen} className="me-2" />
            ان باکس
            <CBadge color="success" className="ms-2">
              42
            </CBadge>
          </CDropdownItem>
          <CDropdownItem to="/dashboard">
            <CIcon icon={cilTask} className="me-2" />
            ٹاسک
            <CBadge color="danger" className="ms-2">
              42
            </CBadge>
          </CDropdownItem>
          <CDropdownItem to="/dashboard">
            <CIcon icon={cilCommentSquare} className="me-2" />
            کمنٹس
            <CBadge color="warning" className="ms-2">
              42
            </CBadge>
          </CDropdownItem>
          <CDropdownHeader className="bg-light fw-semibold py-2">Settings</CDropdownHeader>
          <CDropdownItem to="/dashboard">
            <CIcon icon={cilUser} className="me-2" />
            پروفائل
          </CDropdownItem>
          <CDropdownItem to="/dashboard">
            <CIcon icon={cilSettings} className="me-2" />
            سیٹنگز
          </CDropdownItem>
          <CDropdownItem to="/dashboard">
            <CIcon icon={cilCreditCard} className="me-2" />
            پیمنٹس
            <CBadge color="secondary" className="ms-2">
              42
            </CBadge>
          </CDropdownItem>
          <CDropdownItem to="/dashboard">
            <CIcon icon={cilFile} className="me-2" />
            پروجیکٹس
            <CBadge color="primary" className="ms-2">
              42
            </CBadge>
          </CDropdownItem>
          <CDropdownDivider />
          <CDropdownItem onClick={handleLogout}>
            <CIcon icon={cilLockLocked} className="me-2" />
            لاگ آؤٹ
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>
      {/* Pop-up message */}
      {isPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            {wait}
            <span className="close" onClick={closePopup}>
              &times;
            </span>
            {adminAccountants.map((accountant, index) => (
              <div key={index} className="mb-3">
                <p>{accountant.username} اس سسٹم کو استعمال کرنے کی اجازت چاہتے ہیں۔</p>
                <div className="btn-group" role="group" aria-label="Allow or Decline">
                  <button className="btn btn-success" onClick={() => handleAllow(accountant._id)}>
                    اجازت دیں
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDecline(accountant._id)}>
                    مسترد کر دیں
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AppHeaderDropdown
