import Post from '../../schema/post_schema'
import { jest, it, describe, expect } from '@jest/globals'
import { postCreateController, postDeleteController, postLikeController, postUpdateController, postsGetController, singlePostGetController } from '../../controllers/post_controller'
jest.mock('../../schema/post_schema', () => jest.fn())

describe('Testing post create controller', () => {
  it('should create a new post and return a success message', async () => {
    const req = {
      body: {
        title: 'Test Post',
        body: 'This is a test post'
      },
      user: {
        userId: 'testUserId'
      }
    }

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }

    const saveMock = jest.fn().mockResolvedValueOnce()
    jest.spyOn(Post.prototype, 'save').mockImplementationOnce(saveMock)

    await postCreateController(req, res)

    expect(saveMock).toHaveBeenCalledWith()
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({ message: 'Post created successfully' })
  })

  it('should return an error response if there is an error while saving the post', async () => {
    const req = {
      body: {
        title: 'Test Post',
        body: 'This is a test post'
      },
      user: {
        userId: 'testUserId'
      }
    }

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }

    const saveMock = jest.fn().mockRejectedValueOnce('Error saving post')
    jest.spyOn(Post.prototype, 'save').mockImplementationOnce(saveMock)

    await postCreateController(req, res)

    expect(saveMock).toHaveBeenCalledWith()
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Error saving post' })
  })
})

describe('Testing post like controller', () => {
  it('should unlike a post if it is already liked', async () => {
    const req = {
      body: {
        postId: 'testPostId'
      },
      user: {
        userId: 'testUserId'
      }
    }

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }

    const post = {
      likes: ['testUserId'],
      updateOne: jest.fn().mockResolvedValueOnce()
    }
    jest.spyOn(Post, 'findById').mockResolvedValueOnce(post)

    await postLikeController(req, res)

    expect(Post.findById).toHaveBeenCalledWith('testPostId')
    expect(post.updateOne).toHaveBeenCalledWith({ $pull: { likes: 'testUserId' } })
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ message: 'Post unliked successfully' })
  })

  it('should like a post if it is not already liked', async () => {
    const req = {
      body: {
        postId: 'testPostId'
      },
      user: {
        userId: 'testUserId'
      }
    }

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }

    const post = {
      likes: [],
      updateOne: jest.fn().mockResolvedValueOnce()
    }
    jest.spyOn(Post, 'findById').mockResolvedValueOnce(post)

    await postLikeController(req, res)

    expect(Post.findById).toHaveBeenCalledWith('testPostId')
    expect(post.updateOne).toHaveBeenCalledWith({ $push: { likes: 'testUserId' } })
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ message: 'Post liked successfully' })
  })

  it('should return an error response if there is an error while finding the post', async () => {
    const req = {
      body: {
        postId: 'testPostId'
      },
      user: {
        userId: 'testUserId'
      }
    }

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }

    jest.spyOn(Post, 'findById').mockRejectedValueOnce('Error finding post')

    await postLikeController(req, res)

    expect(Post.findById).toHaveBeenCalledWith('testPostId')
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Error finding post' })
  })
})
jest.mock('../../schema/post_schema', () => ({
  find: jest.fn().mockReturnThis(),
  populate: jest.fn().mockReturnThis()
}))

describe('Testing post get controller', () => {
  it('should return posts for a given user ID', async () => {
    const req = {
      params: {
        id: 'user123'
      }
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }

    const expectedPosts = [
      { title: 'Post 1', postedBy: { username: 'user123' } },
      { title: 'Post 2', postedBy: { username: 'user123' } }
    ]

    jest.spyOn(Post, 'find').mockResolvedValue(expectedPosts)
    jest.spyOn(Post, 'populate').mockResolvedValue(expectedPosts)
    await postsGetController(req, res)

    expect(Post.find).toHaveBeenCalledWith({ postedBy: 'user123' })
    expect(Post.populate).toHaveBeenCalledWith('postedBy', 'user123')
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expectedPosts)
  })
})
