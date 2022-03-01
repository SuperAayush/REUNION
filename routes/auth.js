const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//ADDITION
router.post("/add", async (req, res) => {
  try {
    //GENARATE NEW PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //CREATE NEW PASSWORD
    const newUser = new User({
      name:req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    //SAVE USER AND RESPOND
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err)
  }
});

//AUTHENTICATION
router.post("/authenticate", async (req, res) => {
    const user = await User.findOne({ 
      email: req.body.email,
       });
    !user && res.status(404).json("user not found");

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    !validPassword && res.status(400).json("wrong password")

    if (validPassword) {
		const token = jwt.sign(
			{
				name: user.username,
				email: user.email,
			},
			'secret123'
    )

		return res.json({ jwtToken: token })
	}
  
});

module.exports = router;
