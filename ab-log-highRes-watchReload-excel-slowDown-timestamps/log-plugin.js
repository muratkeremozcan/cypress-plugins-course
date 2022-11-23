// function expression form
const registerPlugin = (on) =>
  on('task', {
    print(message) {
      console.log(message)
      return null
    },
  })

// like default export
module.exports = registerPlugin
// like export const
// module.exports = {registerPlugin}

// function declaration form
// module.exports = function registerPlugin(on) {
//   on('task', {
//     print(s) {
//       console.log(s)
//       return null
//     },
//   })
// }
