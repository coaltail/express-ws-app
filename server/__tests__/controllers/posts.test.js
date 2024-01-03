import Post from '../../schema/post_schema'
import { jest, it, describe, expect } from '@jest/globals'
import { postCreateController, postDeleteController, postLikeController, postUpdateController, postsGetController, singlePostGetController } from '../../controllers/post_controller'
jest.mock('../../schema/post_schema.js')
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
      params: {
        id: 'testPostId'
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
      params: {
        id: 'testPostId'
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
      params: {
        id: 'testPostId'
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

describe('Testing post delete controller', () => {
  it('Should return 500 if an error occurs while deleting a post', async () => {
    const req = {
      model: {
        delete: jest.fn().mockRejectedValueOnce('Error deleting post')
      }
    }

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }

    await postDeleteController(req, res)

    expect(req.model.delete).toHaveBeenCalledWith()
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Error deleting post' })
  })
  it('Should return 200 if a post is deleted successfully', async () => {
    const req = {
      model: {
        delete: jest.fn().mockResolvedValueOnce()
      }
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    await postDeleteController(req, res)
    expect(req.model.delete).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ message: 'Post deleted successfully' })
  })
})

describe('Testing post update controller', () => {
  it('Should return 500 if an error occurs while updating a post', async () => {
    const req = {
      body: {
        title: 'Test Post',
        body: 'This is a test post'
      },
      model: {
        save: jest.fn().mockRejectedValueOnce('Error updating post')
      }
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    await postUpdateController(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Error updating post' })
  })
  it('Should return 200 if a post is updated successfully', async () => {
    const req = {
      body: {
        title: 'Test Post',
        body: 'This is a test post'
      },
      model: {
        save: jest.fn().mockResolvedValueOnce()
      }
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    await postUpdateController(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ message: 'Post updated successfully' })
  })
})
