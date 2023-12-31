import React from 'react'
import { CFooter } from '@coreui/react'
import { Link } from 'react-router-dom'

const AppFooter = () => {
  return (
    <CFooter>
      {/* <div>
        <a href="https://coreui.io" target="_blank" rel="noopener noreferrer">
          CoreUI
        </a>
        <span className="ms-1">&copy; 2023 creativeLabs.</span>
      </div> */}
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <Link to="/dashboard">Amir Owaisy Creations</Link>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
