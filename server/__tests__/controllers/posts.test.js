import Post from '../../schema/post_schema'
import { jest, it, describe, expect, afterEach } from '@jest/globals'
import { postCreateController, postDeleteController, postLikeController, postUpdateController, postsGetController, singlePostGetController } from '../../controllers/post_controller'
jest.mock('../../schema/post_schema', () => jest.fn())
jest.mock('../../schema/post_schema.js', () => ({
  find: jest.fn().mockReturnThis(),
  populate: jest.fn().mockReturnThis()
}))

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

describe('Testing postsGetController', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return posts with populated postedBy field', async () => {
    const mockFind = jest.spyOn(Post, 'find').mockReturnThis()
    const mockPopulate = jest.spyOn(Post, 'populate').mockReturnThis()

    const req = {
      params: {
        id: 'user_id'
      },
      user:
      {
        userId: 'user_id'
      }
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }

    await postsGetController(req, res)

    expect(mockFind).toHaveBeenCalledWith({ postedBy: 'user_id' })
    expect(mockPopulate).toHaveBeenCalledWith('postedBy', 'username')
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.any(Array))
  })

  it('should handle errors and return 500 status with error message', async () => {
    const mockFind = jest.spyOn(Post, 'find').mockRejectedValue('Database error').catch((err) => { console.log(err) })

    const req = {
      params: {
        id: 'user_id'
      }
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }

    await postsGetController(req, res).catch((err) => { console.log(err) })

    expect(mockFind).toHaveBeenCalledWith({ postedBy: 'user_id' })
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Database error' })
  })
})
