import Post from '../../schema/post_schema'
import { jest, it, describe, expect, afterEach, beforeEach, beforeAll } from '@jest/globals'
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

describe('postsGetController', () => {
  afterEach(() => {
    jest.clearAllMocks() // Clear mock function calls after each test
  })

  const mockReq = {
    params: {
      id: 'user123' // replace with a valid user ID for testing
    }
  }

  const mockRes = {
    status: jest.fn(),
    json: jest.fn()
  }

  it('should retrieve and return posts for a given user ID', async () => {
    // Mock the behavior of the Post.find and populate methods
    const fakePosts = [{ title: 'Post 1', body: 'One' }, { title: 'Post 2', body: 'Two' }]
    Post.find = jest.fn().mockResolvedValue(fakePosts)
    Post.populate = jest.fn().mockResolvedValue(fakePosts.map(post => ({ postedBy: { username: 'user123' }, ...post })))

    // Call the function with the mock request and response objects
    await postsGetController(mockReq, mockRes)

    // Verify that the response status is set to 200
    expect(mockRes.status).toHaveBeenCalledWith(200)

    // Verify that the response JSON method is called with the expected posts
    expect(mockRes.json).toHaveBeenCalledWith(fakePosts)
  })
})
