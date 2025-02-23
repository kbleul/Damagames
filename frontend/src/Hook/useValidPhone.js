import { useMemo, useState } from "react";


export default function useValidPhone() {
  const [phone, setPhone] = useState("");
  const [PhoneError, setPhoneError] = useState("");


  useMemo(() => {
    if ([...phone].slice(0, 3).join("") == "251") {
      setPhoneError( "No need to add 251");
      setPhone((prev) => prev?.substring(3));
    }
    if ([...phone][0] == "0") {
      setPhoneError("No need to start with 0");
      setPhone((prev) => prev?.substring(1));
    }
    if ([...phone].length > 9) {
      setPhone((prev) => prev?.substring(0, 9));
    }
    if (
      ([...phone][0] !== "0" || [...phone].slice(0, 3).join("") !== "251") &&
      [...phone].length === 9
    ) {
      setPhoneError("");
    }
  }, [phone]);

  return [phone, setPhone, PhoneError];
}
