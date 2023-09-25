const express = require("express");
const router = express.Router();
const path = require("path");
const gymController = require("../controllers/gymController");
const { fileUpload } = require("../middlewares/UploadFile");
const { isAuth } = require("../middlewares");
const Gym = require("../models/gym.model");

let multerWithFields = fileUpload.fields([
  { name: "image", maxCount: 1 },
  { name: "video", maxCount: 1 },
]);

// GET all gyms
router.get("/getGyms", gymController.getAllGyms);

// GET one gym
router.get("/getGym/:id", gymController.getOneGym);

// CREATE a gym
router.post(
  "/addGym",
  fileUpload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  gymController.createGym
);

router.get("/uploads/:filename", (req, res) => {
  const { filename } = req.params;
  const imagePath = path.join(__dirname, "../uploads", filename);

  res.sendFile(imagePath);
});
// UPDATE a gym
router.put("/updateGym/:id", gymController.updateGym);
// DELETE a gym
router.delete("/deleteGym/:id", gymController.deleteGym);

router.put("/like/:id", gymController.likeGym);

router.put("/unlike/:id", gymController.unlikeGym);

router.get("/:id", async (req, res) => {
  try {
    const gym = await Gym.findById(req.params.id).populate("likes");
    return res.send({ gym });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
