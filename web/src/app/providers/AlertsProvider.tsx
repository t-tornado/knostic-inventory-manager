import { ToastContainer } from "react-toastify";
import { Fragment } from "react/jsx-runtime";
import "react-toastify/dist/ReactToastify.css";

export const AlertsProvider = () => {
  return (
    <Fragment>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
      />
    </Fragment>
  );
};
