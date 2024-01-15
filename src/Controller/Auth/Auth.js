const User = require("../../Modals/Auth");
const Address = require("../../Modals/Address");
const userProfile = require("../../Modals/userProfile");
const studentprofile = require("../../Modals/studentprofile");
const Marks = require("../../Modals/marks");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendVerificationEmail } = require("../../utils/sendmail");
const { generateVerificationToken} = require("../../utils/token_generation");
const crypto=require("crypto");


module.exports = {
  getprofile: async (req, res) => {
    try {
      const readprofile = await userProfile
        .findOne({ _id: req.params.id })
        .populate("userId")
        .exec();
      console.log(readprofile);
    } catch (error) {
      console.log(error);
    }
  },
  //get marks

  getstudent: async (req, res) => {
    try {
      const stu = studentprofile
        .findById(_Id)
        .populate("userId")
        .populate({
          path: "marks",
          model: "marksSchema",
          select: "subject score",
        })
        .exec();
      console.log(stu);
      // const readprofile=await studentprofile.findOne({_id:req.params.id}).populate('userId').exec()
      //   console.log(readprofile);
    } catch (error) {
      console.log(error);
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result) {
          const accessToken = jwt.sign(
            { userId: user._id },
            process.env.SECRET_KEY,
            { expiresIn: "3d" }
          );
          return res.status(200).json({ data: user, token: accessToken });
        } else {
          // Passwords don't match, login failed
          return res.status(404).json({ message: "Incorrect password" });
        }
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  },

  getUser: async (req, res) => {
    try {
      console.log(req.userId);
      const user = await User.findOne({ _id: req.userId });
      res.status(200).json({ message: "USER FOUND", data: user });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "ERROR is ", error: error.message });
    }
  },
 createaccount: async (req, res) => {
    try {
      const verificationToken = generateVerificationToken();
      const verificationLink = `${process.env.BACKEND_LINK}/auth/verify/${verificationToken}`;
      const { name, email, password } = req.body;
      const user = await User.findOne({ email: email });
      if (user && user.email === email) {
        return res
          .status(200)
          .json({ statusCode: 204, message: "email already exist", data: {} });
      }
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        name: name,
        email: email,
        password: passwordHash,
        verificationtoken:verificationToken,
      });
      const msg = {
        from:{
          email: "hurairaabu098@gmail.com",
          name: "Sana",
        },
        to: email,
        html: `<p>Click on the button to verify your email:</p><a href="${verificationLink}"><button>Verify Email</button></a>`,
        subject: "Account Verification",
        text: "Kindly Verify yourself",
      };
      await sendVerificationEmail(msg);
      return res
        .status(200)
        .json({ statusCode: 204, message: "success", data: newUser });
    } catch (error) {
      console.log(error);
    }
  },
  verifySignup: async (req, res, next) => {
    try {
      if (req.params.token) {
        const token = req.params.token;
        const user = await User.findOne({ verificationtoken: token });
        if (!user) {
          return res.redirect(`${process.env.FRONTEND_URL}/alreadyverified`); // Redirect to a failure page
        }
        user.emailVerification = true;
        user.verificationtoken = null; // You might want to remove the token after verification
        await user.save();
        res.redirect(`${process.env.FRONTEND_URL}/verificationsuccessful`); // Redirect to a success page
      } else {
        return res
          .status(401)
          .json({ error: "There is no token Please add token in this" });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  

      // Se
  profile: async (req, res) => {
    try {
      const { name, profilePic, address } = req.body;
      const { id } = req.params;
      const useData = await User.findOne({ _id: id });
      if (!useData) {
        return res.status(400).json({ error: "User not found" });
      }
      const users = await userProfile.create({
        userId: id,
        name: name,
        profilePic: profilePic,
        address: address,
      });

      return res.status(200).json({
        message: "profile created",
        data: { user: users },
      });
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Error occurred", error: error.message });
    }
  },
  getprofile: async (req, res) => {
    try {
      const readprofile = await userProfile
        .findOne({ _id: req.params.id })
        .populate("userId")
        .exec();
      console.log(readprofile);
    } catch (error) {
      console.log(error);
    }
  },
  updateProfile: async (req, res) => {
    try {
      const { updatedName, updatedProfilePic, updatedAddress } = req.body;

      const updatedProfile = await userProfile.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            name: updatedName,
            profilePic: updatedProfilePic,
            address: updatedAddress,
          },
        }
      );

      if (!updatedProfile) {
        return res.status(404).json({ message: "User profile not found" });
      }

      res
        .status(200)
        .json({
          message: "User profile updated successfully",
          userProfile: updatedProfile,
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  deleteProfile: async (req, res) => {
    try {
      const deletedProfile = await userProfile.findbyidAndDelete(req.params.id);

      if (!deletedProfile) {
        return res.status(404).json({ message: "User profile not found" });
      }

      res
        .status(200)
        .json({
          message: "User profile deleted successfully",
          userProfile: deletedProfile,
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  //testtttt
  /*profile: async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const { id } = req.params;

    // Hash the password
        const passwordHash = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({
      id: id,
      name: name,
      email: email,
      password: passwordHash,
    });
    if (!newUser) {
      return res.status(500).json({ message: "Failed to create user account" });
    }
    const userProfile = await UserProfile.create({
      userId: newUser._id,
      username: newUser.username,
      userpassword: newUser.password,
      useremail: newUser.email,
    });

    if (!userProfile) {
      await User.findById(newUser._id); 
      return res.status(500).json({ message: "Failed to create user profile" });
    }

    const profileeePic = await profilePic.create({
      userId: newUser._id,
      username: newUser.name,
      useremail:newUser.email,
      userProfile:newUser.profile,
    });

    const address = await Address.create({
      userId: newUser._id,
     
    });

    // Generate a verification token
    const verificationToken = jwt.sign(
      { userId: newUser._id },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      statusCode: "200",
      message: "login successful. Create your profile with your email address.",
      data: { user: newUser, userProfile, profileeePic, address, verificationToken },
    });
  } catch (error) {
    return res.status(500).json({ message: "Error occurred", error: error.message });
  }
},
*/
  //module.exports = { signupp };

  updateById: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const { id } = req.params;
      console.log(id);
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (name) {
        user.name = name;
      }
      if (email) {
        user.email = email;
      }
      if (password) {
        user.password = password;
      }
      await user.save();
      return res.status(200).json({
        message: "User updated successfully",
        data: user,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error updating user", error: error.message });
    }
  },
  updateUser: async (req, res) => {
    try {
      const username = await User.updateOne(
        { name: req.body.name },
        { $set: {} }
      );
      res.status(200).json({ message: "User updated", data: username });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error is ", error: error.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const username = await User.destroy({ name: req.params.name });

      res.status(200).json({ message: "User updated", data: username });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error is ", error: error.message });
    }
  },
  createmarks: async (req, res) => {
    try {
      const { studentId, marks } = req.body;
      const num = await Marks.create({
        studentId: studentId,
        marks: marks,
      });
      return res.status(200).json({
        message: "profile created",
        data: { marks: num },
      });
    } catch (error) {
      console.log(error);
    }
  },
  createstudent: async (req, res) => {
    try {
      const { userId, name, address, rollNumber, profilePic } = req.body;
      const students = await studentprofile.create({
        userId: userId,
        address: address,
        rollNumber: rollNumber,
        profilePic: profilePic,
        name: name,
      });
      return res.status(200).json({
        message: "profile created",
        data: { student: students },
      });
    } catch (error) {}
  },
  getmarks: async (req, res) => {
    try {
      const studentId = req.params.id;
      let marks = await Marks.find({ studentId: studentId })
        .select("marks -_id")
        .populate({
          path: "studentId", // Populate the 'studentId' field in the Marks schema
          model: "studentprofile", // Specify the model for the 'studentId' field
          select: "name profilePic rollNumber address -_id",
          populate: {
            path: "userId", // Populate the 'userId' field in the Student schema
            model: "auth", // Specify the model for the 'userId' field
            select: "email -_id", // Select only the 'email' field from the User schema
          },
        })
        .exec();
      return res.status(200).json({
        message: "profile created",
        data: { marks: marks },
      });
    } catch (error) {
      console.log(error);
    }
  },
  forgetPassword: async (req, res, next) => {
    try {
      const email = req.body.email;
      const resetToken = crypto.randomBytes(20).toString("hex");
      const user = await User.findOne({ email });
      if (user && user.emailVerification === true) {
        user.resetToken = resetToken;
        await user.save();
        const verificationLink = `${process.env.BACKEND_LINK}/auth/reset/${resetToken}`;
        const subject = "Reset your password";
        const text = `Verify your Account ${verificationLink}`;
        const msg = {
          from: {
            email: "hurairaabu098@gmail.com",
            name: "Student",
          },
          to: email,
          subject: subject,
          text: text,
        };
        await sendVerificationEmail(msg);
        // sendVerificationEmail(email, resetLink, subject);
        return res.status(200).json({
          message: "Password reset link sent to your email",
        });
      } else {
        return res.status(400).json({ error: "Invalid email/password" });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  resetPassword: async (req, res, next) => {
    const resetToken = req.params.token;
    const newPassword = req.body.newPassword;
    const user = await User.findOne({ resetToken });
    if (!user) {
      return res.status(400).json({ error: "Invalid email and/or password" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined; // Clear the reset token
    await user.save();
    return res.json({ success: true, message: "Password Changed", data: user });
    // res.render("passwordResetSuccess");
  },
  resetPasswordForm: async (req, res, next) => {
    try {
      const resetToken = req.params.token;
      // Find user by reset token
      const user = await User.findOne({ resetToken });
      if (!user) {
        return res.render("passwordResetError", {
          error: "Invalid or expired reset token.",
        });
      }
      // res.status(200).json({ message: "this is a valid reset token" });
      res.redirect(`${process.env.FRONTEND_URL}/forgetPassword/${resetToken}`);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  },
};
