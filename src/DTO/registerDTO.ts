import validator from "validator";
import ValidationResponse from "~/util/validationResponse";
class RegisterDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  profile: File | null;

  isValid() {
    var flag: boolean = true;
    var errors: Array<string> = [];
    if (!validator.isEmail(this.email)) {
      flag = false;
      errors.push("email is not valid");
    }
    if (!validator.isStrongPassword(this.password)) {
      flag = false;
      errors.push("password is not strong enough");
    }
    if (this.firstName.length < 3) {
      flag = false;
      errors.push("first name length must greater than 2");
    }
    if (this.lastName.length < 3) {
      flag = false;
      errors.push("last name length must greater than 2");
    }

    return ValidationResponse.create(flag, errors);
  }
}

export default RegisterDTO;
