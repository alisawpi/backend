var _ = require('lodash')

const dummy = () => {
  return 1
}

/*TOTAL LIKES OF ALL BLOGS*/
const totalLikes = (blogs) => {
  let total = blogs.reduce(function (a, blog) {
    return a + blog.likes
  }, 0)
  return total
}

/*BLOG WITH MOST LIKES*/
const favoriteBlog = (blogs) => {
  let result = blogs[0]
  for (var i = 0; i < blogs.length; i++){
    if (blogs[i].likes > result.likes){
      result = blogs[i]
    }
  }
  return result
}
/*WRITER WITH MOST BLOGS*/
const mostBlogs = (blogs) => {
  let result = {
    author: '',
    blogs: ''
  }
  const groupedByAuthor = _.values(_.groupBy(blogs, function(blog) {return blog.author}))
  for (var i = 0; i < groupedByAuthor.length; i++){
    if (groupedByAuthor[i].length > result.blogs){
      result = {
        author: groupedByAuthor[i][0].author,
        blogs: groupedByAuthor[i].length
      }
    }
  }
  return result
}
/*WRITER WITH MOST LIKES */
const mostLikes = (blogs) => {
  let result = {
    author: '',
    likes: ''
  }
  const groupedByAuthor = _.values(_.groupBy(blogs, function(blog) {return blog.author}))
  for (var i = 0; i < groupedByAuthor.length; i++){
    const total  = totalLikes(groupedByAuthor[i])
    if (total > result.likes){
      result = {
        author: groupedByAuthor[i][0].author,
        likes: total
      }
    }
  }
  return result
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}