const authController=require("../../Controller/Auth/Auth")
//const AddressController=require("../Controller/Adress/Addresscontoller");
const authenticateToken = require('../../middlewares/authToken')

module.exports=(app)=>
{
    app.route("/auth/createaccount").post(authController.createaccount)
    app.route("/auth/login").post(authController.login)
    app.route("/auth/profile/:id").post(authController.profile)
    app.route("/auth/getprofile/:id").get(authController.getprofile)
    app.route("/auth/updateProfile/:id").get(authController.updateProfile)
    app.route("/auth/deleteProfile/:id").get(authController.deleteProfile)
    app.route("/auth/getuser").get([ authenticateToken.authenticateToken],authController.getUser)
    app.route("/auth/updateByid/:id").put(authController.updateById)
    app.route("/auth/updateByname/:name").put(authController.deleteUser)
    app.route("/auth/createmarks").post(authController.createmarks)
    app.route("/auth/createstudent").post(authController.createstudent)
    app.route("/auth/getmarks/:id").get(authController.getmarks)
    app.route("/auth/verify/:token").get(authController.verifySignup)
    app.route("/auth/forgot").post(authController.forgetPassword)
    app.route("/auth/reset/:token").get(authController.resetPasswordForm)
    app.route("/auth/reset/:token").post(authController.resetPassword)

}
