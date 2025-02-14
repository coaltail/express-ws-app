import Post from '../schema/post_schema.js'

export async function postCreateController (req, res) {
  try {
    const { title, body } = req.body
    const postedBy = req.user.userId
    const post = new Post({ title, body, postedBy })
    await post.save()
    res.status(201).json({ message: 'Post created successfully' })
  } catch (err) {
    res.status(500).json({ error: err })
  }
}

export async function postLikeController (req, res) {
  try {
    const { id } = req.params
    const { userId } = req.user
    const post = await Post.findById(id)
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }
    const isLiked = post.likes.includes(userId)
    if (isLiked) {
      await post.updateOne({ $pull: { likes: userId } })
      return res.status(200).json({ message: 'Post unliked successfully' })
    } else {
      await post.updateOne({ $push: { likes: userId } })
      return res.status(200).json({ message: 'Post liked successfully' })
    }
  } catch (err) {
    res.status(500).json({ error: err })
  }
}

export async function postsGetController (req, res) {
  try {
    const { id } = req.params
    const posts = await Post.find({ postedBy: id }).select('body title likes')
    if (posts.length === 0) {
      return res.status(404).json({ message: 'Posts not found' })
    }
    console.log(posts)
    return res.status(200).json(posts)
  } catch (err) {
    return res.status(500).json({ error: err.message }) // Handle the error by sending the error message in the response
  }
}

export async function postDeleteController (req, res) {
  try {
    const post = req.model
    await post.delete()
    res.status(200).json({ message: 'Post deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: err })
  }
}

export async function postUpdateController (req, res) {
  try {
    const { title, body } = req.body
    const post = req.model
    post.title = title
    post.body = body
    await post.save()
    res.status(200).json({ message: 'Post updated successfully' })
  } catch (err) {
    res.status(500).json({ error: err })
  }
}

export async function singlePostGetController (req, res) {
  try {
    const { id } = req.params
    const post = await Post.findById(id)
    post.populate('postedBy', 'username')
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }
    res.status(200).json(post)
  } catch (err) {
    res.status(500).json({ error: err })
  }
}
