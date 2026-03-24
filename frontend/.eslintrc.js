module.exports = {
  extends: [
    'react-app',
    'react-app/jest'
  ],
  rules: {
    'no-unused-vars': 'off',
    'react/jsx-no-comment-textnodes': 'off',
    'react/jsx-pascal-case': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'no-useless-escape': 'off',
    'eqeqeq': 'off'
  }
};