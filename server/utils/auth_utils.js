import jsonwebtoken from 'jsonwebtoken'
export const generateToken = (payload) => {
  return jsonwebtoken.sign({ payload }, process.env.TOKEN_SECRET, { expiresIn: '2h' })
}

// Function to set HTTP-only cookie
export const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    maxAge: 2 * 60 * 60 * 1000, // 2 hours in milliseconds
    secure: (process.env.NODE_ENV === 'production')
    // Add other cookie options if needed (secure, sameSite, etc.)
  })
}
