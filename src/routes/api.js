const router = require('express').Router();

const UsersController =require("../controllers/userController");
const TasksController =require("../controllers/taskController");
const AuthVerifyMiddleware = require("../middlewares/AuthVerifyMiddleware");

/**
 * User Route
 */
router.post("/register", UsersController.register);
router.post("/login",UsersController.login);
router.post("/profileUpdate",AuthVerifyMiddleware,UsersController.profileUpdate);
router.get("/profileDetails",AuthVerifyMiddleware,UsersController.profileDetails);

router.get("/RecoverVerifyEmail/:email",UsersController.RecoverVerifyEmail);
router.get("/RecoverVerifyOTP/:email/:otp",UsersController.RecoverVerifyOTP);
router.post("/RecoverResetPass",UsersController.RecoverResetPass);

/**
 * Task Route
 */
router.get("/updateTaskStatus/:id/:status",AuthVerifyMiddleware,TasksController.updateTaskStatus);
router.get("/listTaskByStatus/:status",AuthVerifyMiddleware,TasksController.listTaskByStatus);
router.get("/listTaskGroupByStatus/:status", AuthVerifyMiddleware,TasksController.listTaskGroupByStatus);
router.get("/listTaskByGroup/:group/:status", AuthVerifyMiddleware,TasksController.listTaskByGroup);
router.get("/listTaskGroup", AuthVerifyMiddleware,TasksController.listTaskGroup);
router.get("/deleteTask/:id", AuthVerifyMiddleware,TasksController.deleteTask);
router.get("/tasks/:keyword", AuthVerifyMiddleware,TasksController.searchTask);
router.post("/createTask",AuthVerifyMiddleware,TasksController.createTask);
router.get("/taskStatusCount", AuthVerifyMiddleware,TasksController.taskStatusCount);
router.get("/task-group-count", AuthVerifyMiddleware,TasksController.taskGroupCount);


module.exports = router;