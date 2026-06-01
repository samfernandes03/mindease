const { Task, User } = require("../models");

// CREATE TASK (ONLY PARENTS)
exports.createTask = async (req, res) => {
  try {
    const { title, category, mentalLoad, energy, dueDate, childId, points } = req.body;

    const parentId = req.user.id; // from auth middleware

    // check role
    if (req.user.role !== "parent") {
      return res.status(403).json({ message: "Only parents can create tasks" });
    }

    // check child exists
    const child = await User.findByPk(childId);
    if (!child || child.role !== "child") {
      return res.status(404).json({ message: "Child not found" });
    }

    const task = await Task.create({
      title,
      category,
      mentalLoad,
      energy,
      dueDate,
      points: points || 0,
      childId,
      parentId
    });

    return res.status(201).json(task);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};



// GET TASKS (FILTER BY USER ROLE)
exports.getTasks = async (req, res) => {
  try {
    let tasks;

    if (req.user.role === "parent") {
      tasks = await Task.findAll({
        where: { parentId: req.user.id }
      });
    } else {
      tasks = await Task.findAll({
        where: { childId: req.user.id }
      });
    }

    return res.json(tasks);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};



// UPDATE TASK
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // only parent or assigned child can update
    if (req.user.id !== task.parentId && req.user.id !== task.childId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await task.update(req.body);

    return res.json(task);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};



// DELETE TASK (ONLY PARENT)
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (req.user.role !== "parent") {
      return res.status(403).json({ message: "Only parents can delete tasks" });
    }

    await task.destroy();

    return res.json({ message: "Task deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};



// MARK TASK AS DONE (CHILD ACTION)
exports.completeTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (req.user.id !== task.childId) {
      return res.status(403).json({ message: "Only assigned child can complete task" });
    }

    task.status = "done";
    await task.save();

    return res.json(task);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};