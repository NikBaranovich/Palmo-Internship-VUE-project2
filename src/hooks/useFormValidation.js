export function useFormValidation() {
  function isNameInvalid(name) {
    const minLength = 3;
    const maxLength = 30;
    if (!name) {
      return "Name field is required";
    }
    if (name.length < minLength) {
      return `Name must be at least ${minLength} characters`;
    }
    if (name.length > maxLength) {
      return `Name must be no more than ${maxLength} characters`;
    }
    return null;
  }
  function isEmailInvalid(email) {
    const atSymbol = email.indexOf("@");
    const dotSymbol = email.lastIndexOf(".");
    const spaceSymbol = email.indexOf(" ");

    if (!email) {
      return "Email field is required";
    }

    if (atSymbol === -1 || dotSymbol === -1) {
      return "Email must contain an at symbol and a dot";
    }

    if (atSymbol === 0 || dotSymbol === 0) {
      return "Invalid email format";
    }

    if (dotSymbol <= atSymbol + 1 || email.length <= dotSymbol + 1) {
      return "Invalid email format";
    }

    if (spaceSymbol != -1) {
      return "Email must not contain spaces";
    }

    return null;
  }
  function isPasswordInvalid(password) {
    // const hasNumber = /\d/.test(password);
    // const hasUpperCase = /[A-Z]/.test(password);
    const isLengthValid = password.length >= 6;
    if (!isLengthValid) {
      return "The password must be at least 6 characters";
    }
    // if (!hasNumber || !hasUpperCase) {
    //   return "The password must contain at least one number and capital letter";
    // }
    return null;
  }

  function isEndDateInvalid(startDate, endDate) {
    if (startDate.getTime() > endDate.getTime()) {
      return "The end date must be after the start date.";
    }
    return null;
  }
  function isStartDateInvalid(startDate, endDate) {
    if (startDate.getTime() > endDate.getTime()) {
      return "The start date must be before the end date.";
    }
    return null;
  }
  function isTitleInvalid(title) {
    if (!title) {
      return "Title is required";
    }
    return null;
  }
  function isImageFileInvalid(file) {
    if (!file) {
      return "File is empty";
    }
    if (file.type !== "image/jpeg") {
      return "Unsupported file format";
    }
    if (file.size > 1000000) {
      return "File size is too big";
    }
    return null;
  }
  return {
    isNameInvalid,
    isEmailInvalid,
    isPasswordInvalid,
    isEndDateInvalid,
    isStartDateInvalid,
    isTitleInvalid,
    isImageFileInvalid,
  };
}
