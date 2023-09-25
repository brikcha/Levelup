const router = require("express").Router();
const crud = require('../utils/crud')
const jwt = require("jsonwebtoken");
const {User} =require("../models/user");
const { banUserAccount } = require("../utils/crud");
const Token =require("../models/token");
const multer = require("multer"); // importation pour upload image
filename="";

//upload image
const mystorage= multer.diskStorage({
    destination:"./uploads",
    filename:(req,file,redirect)=>{
        let date= Date.now();
        //image/pmg
        let fl=date + "." + file.mimetype.split("/")[1];
        redirect(null,fl);
        filename=fl;
    }
})

const upload= multer({storage:mystorage});

// Bring in the User Registration function
const {
  userAuth,
  userLogin,
  checkRole,
  userRegister,
  serializeUser
} = require("../utils/Auth");
const { datacatalog } = require("googleapis/build/src/apis/datacatalog");
router.put('/:id/update',upload.any("image"),crud.user_update);
router.delete('/:id/delete',crud.user_delete);
router.get('/list/:role',crud.getbyrole );
router.put('/:id/des',crud.desactivate);
router.put("/:id/des", crud.banUserAccount);
// Users Registeration Route
router.post("/register-user",upload.any("image"),async (req, res) => {
  await userRegister(req.body,"user", res);
});


// Admin Registration Route non 
router.post("/register-admin", async (req, res) => {
  await userRegister(req.body, "admin", res);
});

// Vérifier les informations de connexion de l'utilisateur admin jdid 
//un seul admin une fois
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).send({ message: 'Email ou mot de passe incorrect' });
  }
  res.send({ token: user.token });
}); 

const users = [{
  email: 'najla@gmail.com',
  password: 'najla18',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjQwYzYwM2RjZjE5MjQ0NGQwNTUyYTZhIiwicm9sZSI6ImFkbWluIiwidXNlcm5hbWUiOiJuYWpsYSIsImVtYWlsIjoibmFqbGFAZ21haWwuY29tIiwiaWF0IjoxNjc4NTMyNjg3LCJleHAiOjE2NzkxMzc0ODd9.i9dnmWb925xyQZJXut6Tx9CMsOIlgYwpkjy7HOJuPbk',
  role: 'admin'
}];

// changer mot de passe de admin avec token jdida
router.post('/changepassword', (req, res) => {
  const { token,password, newPassword } = req.body;

  try {
    // Vérifier que le token est valide et a été signé avec la clé secrète appropriée
    const decoded = jwt.verify(token, process.env.APP_SECRET);

    // Vérifier que l'utilisateur décodé est un administrateur
    if (decoded.role !== 'admin') {
      throw new Error('Token invalide');
    }

    // Vérifier que l'ancien mot de passe est correct pour l'utilisateur
    const user = users.find(u => u.email === decoded.email && u.password === password);
    if (!user) {
      return res.status(401).send({ message: 'Ancien mot de passe incorrect' });
    }

    // Mettre à jour le mot de passe de l'utilisateur
    user.password = newPassword;

    res.send({ message: 'Mot de passe modifié avec succès' });

  } catch (err) {
    return res.status(401).send({ message: 'Token invalide' });
  }
});




// Super Coach Registration Route
router.post("/register-coach",upload.any("image","pdf"), async (req, res) => {
  await userRegister(req.body, "coach", res);
});

// Users Login Route
router.post("/login-user", async (req, res) => {
  await userLogin(req.body, "user", res);
});

// Admin Login Route non 
router.post("/login-admin", async (req, res) => {
  await userLogin(req.body, "admin", res);
});

// Super Admin Login Route  
router.post("/login-coach", async (req, res) => {
  await userLogin(req.body, "coach", res);
});

// Profile Route
router.get("/profile", userAuth, async (req, res) => {
  return res.json(serializeUser(req.user));
});

// Users Protected Route
router.get(
  "/user-protectd",
  userAuth,
  checkRole(["user"]),
  async (req, res) => {
    return res.json("Hello User");
  }
);

// Admin Protected Route
router.get(
  "/admin-protectd",
  userAuth,
  checkRole(["admin"]),
  async (req, res) => {
    return res.json("Hello Admin");
  }
);

// coach Protected Route
router.get(
  "/coach-protectd",
  userAuth,
  checkRole(["coach"]),
  async (req, res) => {
    return res.json("Hello coach");
  }
);

// Super Admin Protected Route
router.get(
  "coach-and-admin-protectd",
  userAuth,
  checkRole(["coach", "admin"]),
  async (req, res) => {
    return res.json("coach  and Admin");
  }
);

// amine 
// iaActivatetd 
router.get("/verify/:id/:token", async (req, res) => {
  try {
    // Find the user by ID
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send("Invalid link");

    // Find the verification token
    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send("Invalid link");

    // Update the user's verification status and remove the token
    user.isActive = true;
    await user.save();
    await Token.findByIdAndRemove(token._id);

    res.status(200).send("Email verified successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred");
  }
});

router.put("/banAcc/:id", banUserAccount);

module.exports = router;
