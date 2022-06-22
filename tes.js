 [
    (check("firstname").not().isEmpty().withMessage("Firstname is required"),
    check("lastname", "Lastname is really required").not().isEmpty(),
    check("lastname").not().isEmpty().withMessage("Lastname is required"),
    check("email")
      .not()
      .isEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid Email"),
    check("email").custom(async (email) => {
      const value = await isEmailInUse(email);
      if (value) {
        throw new Error("Email is already in Use!!!");
      }
    }),
    check("phone_no").not().isEmpty().withMessage("Phone_no is required"),
    check("phone_no").custom(async (phone) => {
      const value = await findout.isPhoneInUse(phone);
      if (value) {
        throw new Error("Phone number is already in Use!!!");
      }
    }),
    check("password").not().isEmpty().withMessage("Password is required"),
    check("confirm_password", "Please retype the password above")
      .not()
      .isEmpty(),
    check("confirm_password", "Passwords do not match").custom(
      (value, { req }) => value === req.body.password
    )),
  ],