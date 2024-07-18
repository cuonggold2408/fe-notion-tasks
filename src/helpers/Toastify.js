import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showToast = (type, message, callback, theme = "colored") => {
  switch (type) {
    case "success":
      toast.success(message, {
        position: "top-right",
        autoClose: 2000,
        onClose: callback,
        theme,
      });
      break;
    case "warn":
      toast.warn(message, {
        position: "top-right",
        autoClose: 2000,
        onClose: callback,
        theme,
      });
      break;
    case "error":
      toast.error(message, {
        position: "top-right",
        autoClose: 2000,
        theme,
        onClose: callback,
      });
      break;
    case "info":
      toast.info(message, {
        position: "top-right",
        autoClose: 2000,
        theme,
        onClose: callback,
      });
      break;
  }
};
