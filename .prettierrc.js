// .prettierrc.js
module.exports = {
  tabWidth: 2, // Default for everything
  useTabs: false,
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      options: {
        tabWidth: 4,
      },
    },
  ],
};
