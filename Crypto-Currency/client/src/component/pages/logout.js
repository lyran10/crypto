import { CryptoState } from "../../cryptoContext";

export const LogoutButton = (props) => {
  const {Logout} = props
const {settranslate} = CryptoState()

const handleLogout = () => {
  settranslate("translate")
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