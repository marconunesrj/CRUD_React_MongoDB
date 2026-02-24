import { Toaster } from 'react-hot-toast'
import { UsersPage } from './pages/UsersPage'

export default function App() {
  return (
    <>
      <UsersPage />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#141720',
            color: '#e8eaf0',
            border: '1px solid #252a3a',
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '14px',
          },
        }}
      />
    </>
  )
}
