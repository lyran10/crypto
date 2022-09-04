import { CryptoState } from "../cryptoContext";

export const LogoutButton = (props) => {
  const {Logout} = props
const {setOpenSideNav} = CryptoState()

const handleLogout = () => {
  setOpenSideNav("translate")
  Logout()

}

      return(
        <>
        <button
                onClick={() => {handleLogout()}}
                style={{ backgroundColor: "gold" }}
                className="mb-3 btn text-dark border-warning"
              >
                LOGOUT
              </button>
              
        </>
      )
}