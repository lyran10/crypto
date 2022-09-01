import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


export const Toastify = () => {
  return(
    <>
    <ToastContainer/>
    </>
  )
}

export const errorToasts = (error) => {
  toast.warn(error, { position: toast.POSITION.TOP_CENTER });
};

export const loggedInToasts = (message) => {
  toast.success(message, { position: toast.POSITION.TOP_CENTER });
 };

export  const loggedOutToasts = (message) => {
  return toast.success(message, { position: toast.POSITION.TOP_CENTER });
 };

 export  const singedInToasts = (message) => {
  toast.success(message, { position: toast.POSITION.TOP_CENTER });
  };

