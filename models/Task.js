module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define("Task", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false
    },

    category: {
      type: DataTypes.STRING,
      allowNull: false
    },

    mentalLoad: {
      type: DataTypes.ENUM("Low", "Medium", "High"),
      allowNull: false
    },

    energy: {
      type: DataTypes.ENUM("Low", "Medium", "High"),
      allowNull: false
    },

    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },

    status: {
      type: DataTypes.ENUM("pending", "done"),
      defaultValue: "pending"
    },

    points: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },

    // FK → child user who owns the task
    childId: {
      type: DataTypes.UUID,
      allowNull: false
    },

    // FK → parent who created task
    parentId: {
      type: DataTypes.UUID,
      allowNull: false
    }
  });

  Task.associate = (models) => {
    Task.belongsTo(models.User, { as: "child", foreignKey: "childId" });
    Task.belongsTo(models.User, { as: "parent", foreignKey: "parentId" });
  };

  return Task;
};